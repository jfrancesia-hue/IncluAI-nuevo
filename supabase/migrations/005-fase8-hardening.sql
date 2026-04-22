-- ============================================
-- IncluIA — Migración 005: Hardening de Fase 8
-- Resuelve hallazgos de security review:
--   C1 (CRITICAL) MVs sin RLS → revocar + funciones wrappers
--   C2 (CRITICAL) Auditoría puede fallar silenciosamente → INSERT policy explícita
--   H2 (HIGH)    touch_school_activity SECURITY DEFINER peligroso → validar tipo_usuario
--   M2 (MEDIUM)  SECURITY DEFINER sin search_path → fijar search_path
--   M4 (MEDIUM)  gov_user con fila en perfiles accede a PII propia → política explícita
--
-- Idempotente: se puede correr varias veces.
-- ============================================

-- --------------------------------------------
-- C1 — Revocar acceso directo a las materialized views
-- --------------------------------------------
REVOKE ALL ON mv_gov_coverage_daily FROM PUBLIC, authenticated, anon;
REVOKE ALL ON mv_gov_impact_daily FROM PUBLIC, authenticated, anon;
REVOKE ALL ON mv_gov_compliance_daily FROM PUBLIC, authenticated, anon;

-- Wrappers SECURITY DEFINER: solo gov_users con jurisdicción accesible pueden leer.
CREATE OR REPLACE FUNCTION get_gov_coverage_for(p_jurisdiction_id UUID)
RETURNS SETOF mv_gov_coverage_daily AS $$
BEGIN
  IF NOT es_gov_user() THEN
    RAISE EXCEPTION 'Acceso denegado: no es gov_user'
      USING ERRCODE = 'insufficient_privilege';
  END IF;
  IF p_jurisdiction_id NOT IN (
    SELECT jurisdiction_id FROM gov_jurisdicciones_accesibles()
  ) THEN
    RAISE EXCEPTION 'Jurisdicción fuera de alcance'
      USING ERRCODE = 'insufficient_privilege';
  END IF;
  RETURN QUERY
    SELECT * FROM mv_gov_coverage_daily WHERE jurisdiction_id = p_jurisdiction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

CREATE OR REPLACE FUNCTION get_gov_impact_for(p_jurisdiction_id UUID)
RETURNS SETOF mv_gov_impact_daily AS $$
BEGIN
  IF NOT es_gov_user() THEN
    RAISE EXCEPTION 'Acceso denegado: no es gov_user'
      USING ERRCODE = 'insufficient_privilege';
  END IF;
  IF p_jurisdiction_id NOT IN (
    SELECT jurisdiction_id FROM gov_jurisdicciones_accesibles()
  ) THEN
    RAISE EXCEPTION 'Jurisdicción fuera de alcance'
      USING ERRCODE = 'insufficient_privilege';
  END IF;
  RETURN QUERY
    SELECT * FROM mv_gov_impact_daily WHERE jurisdiction_id = p_jurisdiction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

CREATE OR REPLACE FUNCTION get_gov_compliance_for(p_jurisdiction_id UUID)
RETURNS SETOF mv_gov_compliance_daily AS $$
BEGIN
  IF NOT es_gov_user() THEN
    RAISE EXCEPTION 'Acceso denegado: no es gov_user'
      USING ERRCODE = 'insufficient_privilege';
  END IF;
  IF p_jurisdiction_id NOT IN (
    SELECT jurisdiction_id FROM gov_jurisdicciones_accesibles()
  ) THEN
    RAISE EXCEPTION 'Jurisdicción fuera de alcance'
      USING ERRCODE = 'insufficient_privilege';
  END IF;
  RETURN QUERY
    SELECT * FROM mv_gov_compliance_daily WHERE jurisdiction_id = p_jurisdiction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Permitir que authenticated llame las funciones (el control de acceso está adentro).
GRANT EXECUTE ON FUNCTION get_gov_coverage_for(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_gov_impact_for(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_gov_compliance_for(UUID) TO authenticated;

-- --------------------------------------------
-- C2 — Política INSERT explícita en gov_audit_log
-- (redundante con SECURITY DEFINER pero defensive)
-- --------------------------------------------
DROP POLICY IF EXISTS "gov_audit_log_insert_via_definer" ON gov_audit_log;
CREATE POLICY "gov_audit_log_insert_via_definer" ON gov_audit_log
  FOR INSERT WITH CHECK (true);

-- --------------------------------------------
-- H2 — touch_school_activity: validar tipo_usuario + SECURITY INVOKER
-- --------------------------------------------
CREATE OR REPLACE FUNCTION touch_school_activity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE schools s
     SET last_activity_at = NOW()
    FROM perfiles p
    WHERE p.id = NEW.user_id
      AND s.id = p.school_id
      AND p.school_id IS NOT NULL
      AND p.tipo_usuario = 'docente';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;
-- SECURITY DEFINER se mantiene porque perfiles tiene RLS y el trigger corre como
-- authenticated que no puede UPDATE schools. La validación de tipo_usuario evita abuso.

-- --------------------------------------------
-- M2 — Fijar search_path en funciones SECURITY DEFINER preexistentes
-- --------------------------------------------
CREATE OR REPLACE FUNCTION es_gov_user()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM gov_users WHERE user_id = auth.uid());
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public, pg_temp;

CREATE OR REPLACE FUNCTION gov_jurisdicciones_accesibles()
RETURNS TABLE(jurisdiction_id UUID) AS $$
  WITH RECURSIVE raiz AS (
    SELECT gu.jurisdiction_id AS id
      FROM gov_users gu
      WHERE gu.user_id = auth.uid()
  ), arbol AS (
    SELECT id FROM raiz
    UNION ALL
    SELECT j.id
      FROM gov_jurisdictions j
      JOIN arbol a ON j.parent_id = a.id
  )
  SELECT id FROM arbol;
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public, pg_temp;

CREATE OR REPLACE FUNCTION registrar_auditoria_gov(
  p_action TEXT,
  p_resource_type TEXT DEFAULT NULL,
  p_resource_id UUID DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_payload_hash TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_gov_user_id UUID;
  v_log_id UUID;
BEGIN
  SELECT id INTO v_gov_user_id FROM gov_users WHERE user_id = auth.uid();

  IF v_gov_user_id IS NULL THEN
    RAISE EXCEPTION 'registrar_auditoria_gov: usuario no es gov_user'
      USING ERRCODE = 'insufficient_privilege';
  END IF;

  INSERT INTO gov_audit_log (
    gov_user_id, action, resource_type, resource_id,
    ip_address, user_agent, payload_hash
  ) VALUES (
    v_gov_user_id, p_action, p_resource_type, p_resource_id,
    p_ip_address, p_user_agent, p_payload_hash
  )
  RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- --------------------------------------------
-- M4 — Blindaje explícito: gov_user NO lee perfiles (ni el propio)
-- Evita que un gov_user migrado desde otro rol conserve acceso a perfiles.
-- --------------------------------------------
DROP POLICY IF EXISTS "Usuarios ven su propio perfil" ON perfiles;
CREATE POLICY "Usuarios ven su propio perfil" ON perfiles
  FOR SELECT USING (
    auth.uid() = id
    AND NOT EXISTS (SELECT 1 FROM gov_users WHERE user_id = auth.uid())
  );

-- --------------------------------------------
-- L4 — refresh_gov_mvs como SECURITY DEFINER para que se pueda invocar desde
--       edge functions con rol authenticated (vía RPC controlada).
-- --------------------------------------------
CREATE OR REPLACE FUNCTION refresh_gov_mvs()
RETURNS VOID AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_gov_coverage_daily;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_gov_impact_daily;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_gov_compliance_daily;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;
-- Este RPC es sensible: solo service_role debería llamarlo. Revocar para authenticated.
REVOKE EXECUTE ON FUNCTION refresh_gov_mvs() FROM PUBLIC, authenticated, anon;

-- ============================================
-- FIN 005-fase8-hardening.sql
-- ============================================

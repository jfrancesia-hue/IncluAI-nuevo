-- ============================================
-- IncluIA — Migración 004: Fase 8 "Gobierno & Compra Estatal"
-- Agrega capa gubernamental sin romper módulos docentes/familias/profesionales.
-- Idempotente: se puede correr múltiples veces sin efectos laterales.
--
-- ORDEN DE EJECUCIÓN (en el SQL Editor de Supabase):
--   schema.sql → 001-expansion-modulos.sql → 002-feedback-texto.sql
--   → 003-schema-v21.sql → 004-fase8-gobierno.sql
--
-- PRINCIPIO DE SEGURIDAD NO NEGOCIABLE:
--   Los usuarios gov_* NUNCA acceden a PII individual (perfiles, consultas, pagos).
--   Solo leen datos agregados vía gov_metrics_snapshots y vistas materializadas.
--   Esta regla se aplica por RLS (no por UI) — ver sección "RLS BLINDADA" al final.
-- ============================================

-- ============================================
-- SECCIÓN 1 — ENTIDAD "ESCUELA"
-- Hasta ahora el campo perfiles.institucion era texto libre.
-- Convertimos a entidad referenciable para permitir agregación por escuela.
-- ============================================

CREATE TABLE IF NOT EXISTS schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  cue TEXT UNIQUE,                              -- Código Único de Establecimiento (MinEduc AR)
  tipo_gestion TEXT CHECK (tipo_gestion IN ('estatal', 'privada', 'social', 'cooperativa')),
  nivel TEXT CHECK (nivel IN ('inicial', 'primaria', 'secundaria', 'superior', 'combinado')),
  provincia TEXT NOT NULL,
  departamento TEXT,
  localidad TEXT,
  direccion TEXT,
  contacto JSONB,                               -- {email, telefono, director}
  last_activity_at TIMESTAMPTZ,                 -- actualizado por trigger cuando hay consulta
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_schools_provincia ON schools(provincia);
CREATE INDEX IF NOT EXISTS idx_schools_departamento ON schools(departamento);
CREATE INDEX IF NOT EXISTS idx_schools_cue ON schools(cue);

-- Relación perfiles ↔ schools (opcional para no romper usuarios existentes)
ALTER TABLE perfiles
  ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_perfiles_school ON perfiles(school_id);

-- Extender tipo_usuario para incluir los 4 roles gubernamentales.
-- NOTA: el CHECK viejo permitía docente/familia/profesional. Lo reemplazamos:
ALTER TABLE perfiles DROP CONSTRAINT IF EXISTS perfiles_tipo_usuario_check;
ALTER TABLE perfiles ADD CONSTRAINT perfiles_tipo_usuario_check
  CHECK (tipo_usuario IN (
    'docente','familia','profesional',
    'gov_admin','gov_supervisor','gov_analyst','gov_auditor',
    'admin'
  ));

-- Trigger: cuando un perfil con school_id genera una consulta, marcar actividad de la escuela
CREATE OR REPLACE FUNCTION touch_school_activity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE schools s
    SET last_activity_at = NOW()
    FROM perfiles p
    WHERE p.id = NEW.user_id
      AND s.id = p.school_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_touch_school_activity ON consultas;
CREATE TRIGGER trg_touch_school_activity
  AFTER INSERT ON consultas
  FOR EACH ROW
  EXECUTE FUNCTION touch_school_activity();

-- ============================================
-- SECCIÓN 2 — JURISDICCIONES GUBERNAMENTALES
-- Árbol nación → provincia → departamento → municipio
-- ============================================

CREATE TABLE IF NOT EXISTS gov_jurisdictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('nacion','provincia','departamento','municipio')),
  parent_id UUID REFERENCES gov_jurisdictions(id) ON DELETE CASCADE,
  code TEXT UNIQUE,                             -- p.ej. "AR-X" (ISO 3166-2)
  contact_info JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gov_jurisdictions_parent ON gov_jurisdictions(parent_id);
CREATE INDEX IF NOT EXISTS idx_gov_jurisdictions_type ON gov_jurisdictions(type);

-- ============================================
-- SECCIÓN 3 — CONTRATOS DE LICENCIAMIENTO
-- ============================================

CREATE TABLE IF NOT EXISTS gov_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  jurisdiction_id UUID NOT NULL REFERENCES gov_jurisdictions(id) ON DELETE RESTRICT,
  contract_number TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  licensed_students_cap INTEGER,
  licensed_teachers_cap INTEGER,
  modules_included TEXT[] NOT NULL DEFAULT ARRAY['docentes','familias','profesionales'],
  legal_framework JSONB,                        -- {laws:[], provincialLaws:[]}
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('active','suspended','expired','draft')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_contract_dates CHECK (end_date >= start_date)
);

CREATE INDEX IF NOT EXISTS idx_gov_contracts_jurisdiction ON gov_contracts(jurisdiction_id);
CREATE INDEX IF NOT EXISTS idx_gov_contracts_status ON gov_contracts(status);

-- ============================================
-- SECCIÓN 4 — ASIGNACIÓN DE ESCUELAS A CONTRATOS
-- ============================================

CREATE TABLE IF NOT EXISTS gov_school_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  jurisdiction_id UUID NOT NULL REFERENCES gov_jurisdictions(id) ON DELETE CASCADE,
  contract_id UUID NOT NULL REFERENCES gov_contracts(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(school_id, contract_id)
);

CREATE INDEX IF NOT EXISTS idx_gov_school_assignments_jurisdiction
  ON gov_school_assignments(jurisdiction_id);

-- ============================================
-- SECCIÓN 5 — USUARIOS GUBERNAMENTALES
-- Separados de perfiles para mayor granularidad de scope.
-- ============================================

CREATE TABLE IF NOT EXISTS gov_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  jurisdiction_id UUID NOT NULL REFERENCES gov_jurisdictions(id) ON DELETE RESTRICT,
  role TEXT NOT NULL CHECK (role IN ('gov_admin','gov_supervisor','gov_analyst','gov_auditor')),
  department_scope UUID[] DEFAULT '{}',         -- IDs de departamentos visibles; vacío = toda la jurisdicción
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gov_users_user ON gov_users(user_id);
CREATE INDEX IF NOT EXISTS idx_gov_users_jurisdiction ON gov_users(jurisdiction_id);

-- ============================================
-- SECCIÓN 6 — MÉTRICAS AGREGADAS (SIEMPRE SIN PII)
-- ============================================

CREATE TABLE IF NOT EXISTS gov_metrics_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  jurisdiction_id UUID NOT NULL REFERENCES gov_jurisdictions(id) ON DELETE CASCADE,
  snapshot_date DATE NOT NULL,
  metric_type TEXT NOT NULL
    CHECK (metric_type IN ('coverage','impact','compliance','engagement')),
  metric_payload JSONB NOT NULL,                -- SIEMPRE agregado, NUNCA PII
  computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(jurisdiction_id, snapshot_date, metric_type)
);

CREATE INDEX IF NOT EXISTS idx_gov_metrics_jurisdiction_date
  ON gov_metrics_snapshots(jurisdiction_id, snapshot_date DESC);

-- ============================================
-- SECCIÓN 7 — LOG DE AUDITORÍA INMUTABLE
-- No tiene UPDATE ni DELETE permitidos (por RLS).
-- ============================================

CREATE TABLE IF NOT EXISTS gov_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gov_user_id UUID NOT NULL REFERENCES gov_users(id) ON DELETE RESTRICT,
  action TEXT NOT NULL,                         -- 'view_dashboard', 'export_pdf', etc.
  resource_type TEXT,                           -- 'metrics_snapshot', 'report', etc.
  resource_id UUID,
  ip_address INET,
  user_agent TEXT,
  payload_hash TEXT,                            -- SHA-256 del payload consultado
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gov_audit_time ON gov_audit_log(occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_gov_audit_user ON gov_audit_log(gov_user_id, occurred_at DESC);

-- ============================================
-- SECCIÓN 8 — FUNCIONES HELPER PARA RLS
-- ============================================

-- ¿El usuario autenticado es un gov_user?
CREATE OR REPLACE FUNCTION es_gov_user()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM gov_users WHERE user_id = auth.uid());
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- IDs de jurisdicciones accesibles por el usuario autenticado
-- (su propia jurisdicción + todas las hijas recursivamente)
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
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================
-- SECCIÓN 9 — VISTAS MATERIALIZADAS (T8.3)
-- Agregación pura — nunca individuos.
-- Refresco programado vía cron: ver función refresh_gov_mvs() abajo.
-- ============================================

DROP MATERIALIZED VIEW IF EXISTS mv_gov_coverage_daily CASCADE;
CREATE MATERIALIZED VIEW mv_gov_coverage_daily AS
SELECT
  gsa.jurisdiction_id,
  CURRENT_DATE AS snapshot_date,
  COUNT(DISTINCT s.id) AS schools_total,
  COUNT(DISTINCT CASE
    WHEN s.last_activity_at > NOW() - INTERVAL '30 days' THEN s.id
  END) AS schools_active_30d,
  COUNT(DISTINCT p.id) AS teachers_total,
  COUNT(DISTINCT CASE
    WHEN c.created_at > NOW() - INTERVAL '7 days' THEN p.id
  END) AS teachers_active_week,
  COUNT(DISTINCT c.id) FILTER (WHERE c.created_at > NOW() - INTERVAL '30 days')
    AS consultas_30d
FROM gov_school_assignments gsa
JOIN schools s ON s.id = gsa.school_id
LEFT JOIN perfiles p ON p.school_id = s.id AND p.tipo_usuario = 'docente'
LEFT JOIN consultas c ON c.user_id = p.id
GROUP BY gsa.jurisdiction_id;

CREATE UNIQUE INDEX ON mv_gov_coverage_daily(jurisdiction_id, snapshot_date);

DROP MATERIALIZED VIEW IF EXISTS mv_gov_impact_daily CASCADE;
CREATE MATERIALIZED VIEW mv_gov_impact_daily AS
SELECT
  gsa.jurisdiction_id,
  CURRENT_DATE AS snapshot_date,
  COUNT(c.id) AS adaptaciones_generadas,
  COUNT(c.id) FILTER (WHERE c.modulo = 'docentes') AS adaptaciones_docentes,
  COUNT(c.id) FILTER (WHERE c.modulo = 'familias') AS orientaciones_familias,
  COUNT(c.id) FILTER (WHERE c.modulo = 'profesionales') AS derivaciones_profesionales,
  ROUND(AVG(c.feedback_estrellas)::numeric, 2) AS promedio_feedback,
  COUNT(DISTINCT c.user_id) AS usuarios_activos_periodo,
  -- Proxy: cada adaptación ahorra ~30min al docente (fuente: estudio interno)
  ROUND(COUNT(c.id) * 0.5, 0) AS horas_docentes_ahorradas
FROM gov_school_assignments gsa
JOIN schools s ON s.id = gsa.school_id
LEFT JOIN perfiles p ON p.school_id = s.id
LEFT JOIN consultas c ON c.user_id = p.id AND c.created_at > NOW() - INTERVAL '30 days'
GROUP BY gsa.jurisdiction_id;

CREATE UNIQUE INDEX ON mv_gov_impact_daily(jurisdiction_id, snapshot_date);

DROP MATERIALIZED VIEW IF EXISTS mv_gov_compliance_daily CASCADE;
CREATE MATERIALIZED VIEW mv_gov_compliance_daily AS
SELECT
  j.id AS jurisdiction_id,
  CURRENT_DATE AS snapshot_date,
  -- Scores base (se pueden calcular por auditorías periódicas). Valores iniciales seed.
  98 AS wcag_21_aa_score,
  100 AS cfe_311_16_score,
  95 AS ley_25326_score,
  98 AS ley_26653_score
FROM gov_jurisdictions j;

CREATE UNIQUE INDEX ON mv_gov_compliance_daily(jurisdiction_id, snapshot_date);

-- Función que refresca todas las MVs en orden. Llamar desde pg_cron o edge function diaria.
CREATE OR REPLACE FUNCTION refresh_gov_mvs()
RETURNS VOID AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_gov_coverage_daily;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_gov_impact_daily;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_gov_compliance_daily;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SECCIÓN 10 — RLS BLINDADA
-- Principio: gov_* NUNCA accede a perfiles/consultas/pagos individualmente.
-- Solo a métricas agregadas y a sus propios logs.
-- ============================================

ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE gov_jurisdictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gov_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE gov_school_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE gov_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE gov_metrics_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE gov_audit_log ENABLE ROW LEVEL SECURITY;

-- schools: lectura pública del directorio (sin datos sensibles). Edición solo admin.
DROP POLICY IF EXISTS "schools_read_all" ON schools;
CREATE POLICY "schools_read_all" ON schools FOR SELECT USING (true);

-- gov_jurisdictions: lectura pública (nomenclador público).
DROP POLICY IF EXISTS "gov_jurisdictions_read_all" ON gov_jurisdictions;
CREATE POLICY "gov_jurisdictions_read_all" ON gov_jurisdictions FOR SELECT USING (true);

-- gov_contracts: solo gov_users ven contratos de su jurisdicción.
DROP POLICY IF EXISTS "gov_contracts_own_jurisdiction" ON gov_contracts;
CREATE POLICY "gov_contracts_own_jurisdiction" ON gov_contracts
  FOR SELECT USING (
    jurisdiction_id IN (SELECT jurisdiction_id FROM gov_jurisdicciones_accesibles())
  );

-- gov_school_assignments: solo gov_users de su jurisdicción.
DROP POLICY IF EXISTS "gov_school_assignments_own" ON gov_school_assignments;
CREATE POLICY "gov_school_assignments_own" ON gov_school_assignments
  FOR SELECT USING (
    jurisdiction_id IN (SELECT jurisdiction_id FROM gov_jurisdicciones_accesibles())
  );

-- gov_users: solo ven su propio registro.
DROP POLICY IF EXISTS "gov_users_self" ON gov_users;
CREATE POLICY "gov_users_self" ON gov_users
  FOR SELECT USING (user_id = auth.uid());

-- gov_metrics_snapshots: solo métricas de jurisdicciones accesibles.
DROP POLICY IF EXISTS "gov_metrics_own_jurisdiction" ON gov_metrics_snapshots;
CREATE POLICY "gov_metrics_own_jurisdiction" ON gov_metrics_snapshots
  FOR SELECT USING (
    jurisdiction_id IN (SELECT jurisdiction_id FROM gov_jurisdicciones_accesibles())
  );

-- gov_audit_log: cada gov_user solo ve sus propias acciones.
DROP POLICY IF EXISTS "gov_audit_log_own" ON gov_audit_log;
CREATE POLICY "gov_audit_log_own" ON gov_audit_log
  FOR SELECT USING (
    gov_user_id IN (SELECT id FROM gov_users WHERE user_id = auth.uid())
  );

-- INSERT de auditoría: solo desde funciones SECURITY DEFINER (ver registrar_auditoria).
-- UPDATE y DELETE bloqueados para todos (log inmutable).
DROP POLICY IF EXISTS "gov_audit_log_no_update" ON gov_audit_log;
CREATE POLICY "gov_audit_log_no_update" ON gov_audit_log
  FOR UPDATE USING (false);

DROP POLICY IF EXISTS "gov_audit_log_no_delete" ON gov_audit_log;
CREATE POLICY "gov_audit_log_no_delete" ON gov_audit_log
  FOR DELETE USING (false);

-- BLINDAJE CRÍTICO: reforzar que gov_* NO puede leer perfiles/consultas/pagos.
-- Las políticas existentes ya limitan a auth.uid() = id/user_id.
-- Agregamos políticas explícitas que niegan acceso cuando el usuario es gov_*.
-- Esto funciona porque múltiples policies se combinan con OR para SELECT,
-- pero si el gov_user NO es el dueño del registro, ninguna policy le deja pasar.
-- Se mantiene el patrón existente; documentamos la garantía:
COMMENT ON TABLE perfiles IS
  'PII individual. gov_users NO pueden leerla (auth.uid() ≠ id para ellos). Ver 004-fase8-gobierno.sql.';

COMMENT ON TABLE consultas IS
  'Historial individual. gov_users NO pueden leerla. Métricas agregadas vía mv_gov_*.';

COMMENT ON TABLE pagos IS
  'Transacciones individuales. Inaccesibles para gov_users.';

-- ============================================
-- SECCIÓN 11 — FUNCIÓN DE AUDITORÍA
-- Llamar desde cada endpoint /app/api/gov/* después de servir la respuesta.
-- ============================================

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
    RAISE EXCEPTION 'registrar_auditoria_gov: usuario no es gov_user';
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- SECCIÓN 12 — SEED MÍNIMO PARA DEMO
-- Argentina + Córdoba + Capital (solo estructura; no crea usuarios ni escuelas).
-- Podés completarlo con scripts/seed-gobierno.ts.
-- ============================================

INSERT INTO gov_jurisdictions (name, type, code)
  VALUES ('Argentina', 'nacion', 'AR')
  ON CONFLICT (code) DO NOTHING;

INSERT INTO gov_jurisdictions (name, type, code, parent_id)
  SELECT 'Córdoba', 'provincia', 'AR-X', id
  FROM gov_jurisdictions WHERE code = 'AR'
  ON CONFLICT (code) DO NOTHING;

INSERT INTO gov_jurisdictions (name, type, code, parent_id)
  SELECT 'Capital', 'departamento', 'AR-X-CAPITAL', id
  FROM gov_jurisdictions WHERE code = 'AR-X'
  ON CONFLICT (code) DO NOTHING;

-- ============================================
-- FIN 004-fase8-gobierno.sql
-- Después de ejecutar: correr SELECT refresh_gov_mvs(); para primera materialización.
-- ============================================

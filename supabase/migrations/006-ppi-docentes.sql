-- ============================================
-- IncluIA — Migración 006: PPI (Proyecto Pedagógico Individual) para docentes
-- Conforme a Resolución CFE 311/16 y Ley 26.206
--
-- Principio de privacidad: IncluIA NO almacena nombres completos de alumnos.
-- El docente identifica al alumno con iniciales o pseudónimo. Cuando imprime
-- el PPI, completa el nombre a mano fuera del sistema.
-- ============================================

-- --------------------------------------------
-- Tabla principal: documentos PPI
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS ppi_documentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES perfiles(id) ON DELETE CASCADE,

  -- Identificación SIN PII completa del alumno (iniciales, pseudónimo, "Alumno A")
  alumno_identificador TEXT NOT NULL,
  alumno_edad INTEGER NOT NULL CHECK (alumno_edad BETWEEN 3 AND 25),
  alumno_nivel TEXT NOT NULL,                    -- inicial/primaria/secundaria
  alumno_anio_grado TEXT,                        -- "5° grado", "2° año", etc.
  alumno_discapacidades TEXT[] NOT NULL,         -- reusa los ids del catálogo
  alumno_diagnostico TEXT,                       -- texto libre opcional

  -- Contexto institucional
  institucion TEXT NOT NULL,
  ciclo_lectivo TEXT NOT NULL,                   -- "2026"
  periodo TEXT NOT NULL DEFAULT 'anual'
    CHECK (periodo IN ('anual','primer_cuatrimestre','segundo_cuatrimestre','trimestral')),

  -- Inputs del docente que alimentan a Claude
  fortalezas_observadas TEXT,
  barreras_observadas TEXT,
  contexto_familiar TEXT,
  equipo_externo TEXT,                           -- terapeutas, integradores, etc.

  -- Secciones generadas (JSON estructurado)
  secciones JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- {
  --   datos_generales, fortalezas, barreras, apoyos,
  --   contenidos_priorizados, adaptaciones_metodologicas,
  --   evaluacion, acuerdos_familia, articulacion_equipo,
  --   seguimiento_trimestral
  -- }

  estado TEXT NOT NULL DEFAULT 'borrador'
    CHECK (estado IN ('borrador','completo','presentado','archivado')),
  version_schema TEXT NOT NULL DEFAULT '1.0',

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  generado_at TIMESTAMPTZ,                       -- cuándo Claude completó las secciones
  presentado_at TIMESTAMPTZ                      -- cuándo el docente marcó como presentado
);

CREATE INDEX IF NOT EXISTS idx_ppi_user ON ppi_documentos(user_id);
CREATE INDEX IF NOT EXISTS idx_ppi_ciclo ON ppi_documentos(user_id, ciclo_lectivo);
CREATE INDEX IF NOT EXISTS idx_ppi_estado ON ppi_documentos(user_id, estado);
CREATE INDEX IF NOT EXISTS idx_ppi_discapacidades ON ppi_documentos USING GIN(alumno_discapacidades);

-- Trigger: actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION ppi_touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_ppi_touch ON ppi_documentos;
CREATE TRIGGER trg_ppi_touch
  BEFORE UPDATE ON ppi_documentos
  FOR EACH ROW
  EXECUTE FUNCTION ppi_touch_updated_at();

-- --------------------------------------------
-- Vínculos con consultas previas
-- Un PPI puede nutrirse de las guías que el docente ya generó para ese alumno.
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS ppi_consultas (
  ppi_id UUID NOT NULL REFERENCES ppi_documentos(id) ON DELETE CASCADE,
  consulta_id UUID NOT NULL REFERENCES consultas(id) ON DELETE CASCADE,
  vinculado_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (ppi_id, consulta_id)
);

CREATE INDEX IF NOT EXISTS idx_ppi_consultas_ppi ON ppi_consultas(ppi_id);

-- --------------------------------------------
-- Seguimiento trimestral (hitos a lo largo del ciclo lectivo)
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS ppi_seguimientos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ppi_id UUID NOT NULL REFERENCES ppi_documentos(id) ON DELETE CASCADE,
  fecha DATE NOT NULL,
  trimestre INTEGER NOT NULL CHECK (trimestre BETWEEN 1 AND 4),
  logros TEXT,
  desafios TEXT,
  ajustes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ppi_seg ON ppi_seguimientos(ppi_id, trimestre);

-- --------------------------------------------
-- RLS — cada docente SOLO ve sus PPIs
-- --------------------------------------------
ALTER TABLE ppi_documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppi_consultas ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppi_seguimientos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ppi_own" ON ppi_documentos;
CREATE POLICY "ppi_own" ON ppi_documentos
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "ppi_consultas_own" ON ppi_consultas;
CREATE POLICY "ppi_consultas_own" ON ppi_consultas
  FOR ALL
  USING (
    EXISTS (SELECT 1 FROM ppi_documentos WHERE id = ppi_id AND user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM ppi_documentos WHERE id = ppi_id AND user_id = auth.uid())
  );

DROP POLICY IF EXISTS "ppi_seg_own" ON ppi_seguimientos;
CREATE POLICY "ppi_seg_own" ON ppi_seguimientos
  FOR ALL
  USING (
    EXISTS (SELECT 1 FROM ppi_documentos WHERE id = ppi_id AND user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM ppi_documentos WHERE id = ppi_id AND user_id = auth.uid())
  );

-- --------------------------------------------
-- Función helper: cuántos PPIs creados en el ciclo lectivo actual
-- Se usa desde lib/plan.ts para validar límite por plan.
-- --------------------------------------------
CREATE OR REPLACE FUNCTION ppis_en_ciclo(p_user_id UUID, p_ciclo TEXT)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::int
  FROM ppi_documentos
  WHERE user_id = p_user_id
    AND ciclo_lectivo = p_ciclo
    AND estado != 'archivado';
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp;

GRANT EXECUTE ON FUNCTION ppis_en_ciclo(UUID, TEXT) TO authenticated;

-- Bloqueo adicional: gov_users NO acceden a ppi_* (la policy ya lo garantiza
-- porque auth.uid() = user_id nunca matchea para ellos, pero lo comentamos).
COMMENT ON TABLE ppi_documentos IS
  'PPIs de docentes. Sin PII completa del alumno (iniciales/pseudónimo). gov_users no acceden.';

-- ============================================
-- FIN 006-ppi-docentes.sql
-- ============================================

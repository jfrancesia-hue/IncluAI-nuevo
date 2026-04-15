-- ============================================
-- IncluIA — Migración 001: Expansión a 3 módulos (docentes / familias / profesionales)
-- Ejecutar DESPUÉS de supabase/schema.sql en el SQL Editor de Supabase.
-- Es idempotente: se puede correr múltiples veces sin romper.
-- ============================================

-- 1) Columna tipo_usuario + especialidad en perfiles
ALTER TABLE perfiles
  ADD COLUMN IF NOT EXISTS tipo_usuario TEXT NOT NULL DEFAULT 'docente'
  CHECK (tipo_usuario IN ('docente', 'familia', 'profesional'));

ALTER TABLE perfiles
  ADD COLUMN IF NOT EXISTS especialidad TEXT;

-- 2) Extender consultas para soportar los 3 módulos
ALTER TABLE consultas
  ADD COLUMN IF NOT EXISTS modulo TEXT NOT NULL DEFAULT 'docentes'
  CHECK (modulo IN ('docentes', 'familias', 'profesionales'));

-- Docentes traía nivel y materia como NOT NULL. Los módulos nuevos no los
-- requieren, así que los hacemos nullables.
ALTER TABLE consultas ALTER COLUMN nivel DROP NOT NULL;
ALTER TABLE consultas ALTER COLUMN materia DROP NOT NULL;
ALTER TABLE consultas ALTER COLUMN situacion_apoyo DROP NOT NULL;

ALTER TABLE consultas
  ADD COLUMN IF NOT EXISTS datos_modulo JSONB;

CREATE INDEX IF NOT EXISTS idx_consultas_modulo ON consultas(modulo);

-- 3) Vista de estadísticas ampliada por módulo
CREATE OR REPLACE VIEW estadisticas_generales AS
SELECT
  COUNT(DISTINCT p.id) AS total_usuarios,
  COUNT(DISTINCT CASE WHEN p.tipo_usuario = 'docente' THEN p.id END) AS total_docentes,
  COUNT(DISTINCT CASE WHEN p.tipo_usuario = 'familia' THEN p.id END) AS total_familias,
  COUNT(DISTINCT CASE WHEN p.tipo_usuario = 'profesional' THEN p.id END) AS total_profesionales,
  COUNT(c.id) AS total_consultas,
  COUNT(CASE WHEN c.modulo = 'docentes' THEN 1 END) AS consultas_docentes,
  COUNT(CASE WHEN c.modulo = 'familias' THEN 1 END) AS consultas_familias,
  COUNT(CASE WHEN c.modulo = 'profesionales' THEN 1 END) AS consultas_profesionales,
  COUNT(CASE WHEN c.created_at > NOW() - INTERVAL '30 days' THEN 1 END) AS consultas_ultimo_mes,
  COUNT(CASE WHEN c.created_at > NOW() - INTERVAL '7 days' THEN 1 END) AS consultas_ultima_semana,
  ROUND(AVG(c.feedback_estrellas), 2) AS promedio_feedback,
  COUNT(DISTINCT CASE WHEN p.plan = 'pro' THEN p.id END) AS usuarios_pro,
  COUNT(DISTINCT CASE WHEN p.plan = 'free' THEN p.id END) AS usuarios_free
FROM perfiles p
LEFT JOIN consultas c ON p.id = c.user_id;

-- 4) Actualizar handle_new_user para leer tipo_usuario y especialidad del metadata
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO perfiles (id, nombre, apellido, email, tipo_usuario, especialidad)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nombre', ''),
    COALESCE(NEW.raw_user_meta_data->>'apellido', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'tipo_usuario', 'docente'),
    NEW.raw_user_meta_data->>'especialidad'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

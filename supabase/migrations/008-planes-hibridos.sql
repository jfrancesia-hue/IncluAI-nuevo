-- ============================================
-- Migración 008: Planes Híbridos (Sonnet/Opus)
-- ============================================
-- Reemplaza el enum de planes (free, pro, institucional) por
-- (free, basico, profesional, premium) para el nuevo pricing
-- basado en modelos híbridos: Sonnet 4.6 para Free/Básico/Profesional,
-- Opus 4.7 solo para Premium.
--
-- Nota: en el schema actual la columna `plan` es TEXT + CHECK, no un
-- ENUM nativo de PostgreSQL. Esto simplifica la migración: basta con
-- actualizar los check constraints.
-- ============================================

BEGIN;

-- 1. Resetear todos los perfiles a 'free' (no hay suscripciones reales)
UPDATE perfiles SET plan = 'free';

-- 2. Normalizar histórico de pagos: 'pro' y 'institucional' → 'premium'
--    (mantenemos la fila para trazabilidad contable; 'premium' es el
--    plan de mayor valor del nuevo tier y no rompe la aggregate de MRR)
UPDATE pagos SET plan = 'premium' WHERE plan IN ('pro', 'institucional');

-- 3. Eliminar check constraints viejos
ALTER TABLE perfiles DROP CONSTRAINT IF EXISTS perfiles_plan_check;
ALTER TABLE pagos DROP CONSTRAINT IF EXISTS pagos_plan_check;

-- 4. Nuevo constraint en perfiles (incluye 'free')
ALTER TABLE perfiles
  ADD CONSTRAINT perfiles_plan_check
  CHECK (plan IN ('free', 'basico', 'profesional', 'premium'));

-- 5. Nuevo constraint en pagos (solo planes pagos)
ALTER TABLE pagos
  ADD CONSTRAINT pagos_plan_check
  CHECK (plan IN ('basico', 'profesional', 'premium'));

-- 6. Confirmar default
ALTER TABLE perfiles ALTER COLUMN plan SET DEFAULT 'free';

-- 7. Recrear vista estadisticas_generales con los 4 planes nuevos.
--    (La vista original en schema.sql/001-expansion-modulos.sql usaba 'pro'
--    y ahora quedaría rota tras el cambio de CHECK. Se recrea acá.)
DROP VIEW IF EXISTS estadisticas_generales;
CREATE VIEW estadisticas_generales AS
SELECT
  COUNT(DISTINCT p.id) AS total_docentes,
  COUNT(c.id) AS total_consultas,
  COUNT(CASE WHEN c.created_at > NOW() - INTERVAL '30 days' THEN 1 END) AS consultas_ultimo_mes,
  COUNT(CASE WHEN c.created_at > NOW() - INTERVAL '7 days' THEN 1 END) AS consultas_ultima_semana,
  ROUND(AVG(c.feedback_estrellas), 2) AS promedio_feedback,
  COUNT(DISTINCT CASE WHEN p.plan = 'free' THEN p.id END) AS usuarios_free,
  COUNT(DISTINCT CASE WHEN p.plan = 'basico' THEN p.id END) AS usuarios_basico,
  COUNT(DISTINCT CASE WHEN p.plan = 'profesional' THEN p.id END) AS usuarios_profesional,
  COUNT(DISTINCT CASE WHEN p.plan = 'premium' THEN p.id END) AS usuarios_premium
FROM perfiles p
LEFT JOIN consultas c ON p.id = c.user_id;

COMMIT;

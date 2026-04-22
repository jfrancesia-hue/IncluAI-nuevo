-- ============================================
-- Tests SQL para RLS de Fase 8.
-- Correr en un proyecto de testing (NO prod) con psql o el SQL editor.
-- Cada bloque debe terminar con ROLLBACK; el último devuelve el resultado.
-- ============================================

-- Setup de fixtures (una sola vez):
--   insert into auth.users (id, email) values ('11111111-1111-1111-1111-111111111111','gov_admin@test.ar')
--     on conflict do nothing;
--   insert into gov_users (user_id, jurisdiction_id, role)
--     values ('11111111-1111-1111-1111-111111111111',
--             (select id from gov_jurisdictions where code='AR-X'), 'gov_admin')
--     on conflict do nothing;

-- 1) gov_user NO ve perfiles de otros docentes
BEGIN;
SET local request.jwt.claims = '{"sub":"11111111-1111-1111-1111-111111111111"}';
SELECT COUNT(*) AS perfiles_visibles_para_gov FROM perfiles;
-- Expected: 0 o 1 (solo el propio perfil si existe)
ROLLBACK;

-- 2) gov_user NO ve consultas
BEGIN;
SET local request.jwt.claims = '{"sub":"11111111-1111-1111-1111-111111111111"}';
SELECT COUNT(*) AS consultas_visibles_para_gov FROM consultas;
-- Expected: 0
ROLLBACK;

-- 3) gov_user NO ve pagos
BEGIN;
SET local request.jwt.claims = '{"sub":"11111111-1111-1111-1111-111111111111"}';
SELECT COUNT(*) AS pagos_visibles_para_gov FROM pagos;
-- Expected: 0
ROLLBACK;

-- 4) gov_user SÍ ve métricas de su jurisdicción (cuando hay seeds)
BEGIN;
SET local request.jwt.claims = '{"sub":"11111111-1111-1111-1111-111111111111"}';
SELECT metric_type, metric_payload FROM gov_metrics_snapshots LIMIT 5;
ROLLBACK;

-- 5) gov_audit_log: UPDATE debe fallar
BEGIN;
SET local request.jwt.claims = '{"sub":"11111111-1111-1111-1111-111111111111"}';
UPDATE gov_audit_log SET action = 'tampered' WHERE id = (SELECT id FROM gov_audit_log LIMIT 1);
-- Expected: ERROR: new row violates row-level security policy
ROLLBACK;

-- 6) gov_user NO puede insertar perfiles arbitrarios
BEGIN;
SET local request.jwt.claims = '{"sub":"11111111-1111-1111-1111-111111111111"}';
INSERT INTO perfiles (id, nombre, apellido, email) VALUES (gen_random_uuid(), 'X', 'Y', 'x@y.ar');
-- Expected: ERROR
ROLLBACK;

-- 7) Función gov_jurisdicciones_accesibles devuelve árbol correcto
BEGIN;
SET local request.jwt.claims = '{"sub":"11111111-1111-1111-1111-111111111111"}';
SELECT j.name, j.type
FROM gov_jurisdictions j
WHERE j.id IN (SELECT jurisdiction_id FROM gov_jurisdicciones_accesibles());
-- Expected: provincia + todos sus departamentos hijos
ROLLBACK;

-- 8) Refresh de MVs no expone PII
SELECT refresh_gov_mvs();
SELECT * FROM mv_gov_coverage_daily LIMIT 3;
SELECT * FROM mv_gov_impact_daily LIMIT 3;
-- Verificar manualmente que no hay columnas con nombres/emails individuales

-- ============================================
-- IncluIA — Migración 002: columna feedback_texto
-- Ejecutar DESPUÉS de 001-expansion-modulos.sql.
-- ============================================

ALTER TABLE consultas
  ADD COLUMN IF NOT EXISTS feedback_texto TEXT;

-- ============================================
-- IncluIA — Migración 007: PPI conforme al Anexo II completo de Res. CFE 311/16
-- Agrega campos faltantes para que el PPI cumpla con los ejes prioritarios
-- obligatorios del marco nacional y habilite disclaimers provinciales.
-- Idempotente.
-- ============================================

-- Jurisdicción (para referenciar la norma provincial en el documento)
ALTER TABLE ppi_documentos
  ADD COLUMN IF NOT EXISTS jurisdiccion TEXT DEFAULT 'bsas';

-- Datos de familia/tutor responsable — parentesco + iniciales + contacto
-- (NUNCA nombre completo — coherente con política de privacidad).
ALTER TABLE ppi_documentos
  ADD COLUMN IF NOT EXISTS familia_responsable JSONB;
-- Estructura esperada:
-- { parentesco: "madre" | "padre" | "tutor/a" | "otro",
--   iniciales_o_alias: "M.G. (mamá)",
--   contacto_masked: "11-****-2345",
--   ocupacion?: "docente",
--   observaciones?: "familia muy presente" }

-- Intérprete LSA (obligatorio según Anexo II si discapacidad auditiva y se requiere)
ALTER TABLE ppi_documentos
  ADD COLUMN IF NOT EXISTS requiere_interprete_lsa BOOLEAN NOT NULL DEFAULT false;

-- Comentarios para documentación
COMMENT ON COLUMN ppi_documentos.jurisdiccion IS
  'Jurisdicción provincial — ajusta el alias del PPI y la norma citada al pie.';
COMMENT ON COLUMN ppi_documentos.familia_responsable IS
  'Datos de familia/tutor SIN nombre completo. Solo parentesco, iniciales y contacto enmascarado.';
COMMENT ON COLUMN ppi_documentos.requiere_interprete_lsa IS
  'Bandera del Anexo II — si el PPI requiere intérprete de Lengua de Señas Argentina.';

-- ============================================
-- FIN 007-ppi-anexo2-completo.sql
-- ============================================

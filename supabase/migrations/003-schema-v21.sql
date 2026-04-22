-- ============================================
-- IncluIA v2.1 — Guía pedagógica estructurada
-- Agrega soporte para respuesta JSON enriquecida con multimedia
-- Documento de referencia: docs/1-CAMBIOS-AGENTE.md
-- ============================================

-- Columna para la guía estructurada (reemplaza paulatinamente a respuesta_ia markdown)
ALTER TABLE public.consultas
  ADD COLUMN IF NOT EXISTS respuesta_ia_estructurada JSONB;

-- Versión del schema con que se generó la guía (1.0 = markdown, 2.1 = estructurado)
ALTER TABLE public.consultas
  ADD COLUMN IF NOT EXISTS version_schema TEXT DEFAULT '1.0';

-- Índice para búsquedas por versión de schema (filtrar consultas nuevas vs legacy)
CREATE INDEX IF NOT EXISTS idx_consultas_version_schema
  ON public.consultas (version_schema);

-- Anotación: el campo respuesta_ia (markdown) se mantiene por retrocompatibilidad.
-- Se puede deprecar cuando todas las consultas nuevas estén en v2.1 y el frontend
-- viejo haya sido retirado.
COMMENT ON COLUMN public.consultas.respuesta_ia
  IS 'Deprecado desde v2.1 — usar respuesta_ia_estructurada';

COMMENT ON COLUMN public.consultas.respuesta_ia_estructurada
  IS 'Guía pedagógica validada por GuiaPedagogicaSchema (v2.1+)';

COMMENT ON COLUMN public.consultas.version_schema
  IS 'Versión del schema con que se generó la guía — 1.0 = markdown legacy, 2.1 = estructurado';

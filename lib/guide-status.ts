import type { StructuredGuide } from '@/lib/guide-schema';

type ConsultaMinima = {
  respuesta_ia: string | null;
  datos_modulo: Record<string, unknown> | null;
};

/**
 * Una guía se considera "incompleta" cuando el stream no terminó de generarse
 * o el modelo devolvió una respuesta absurdamente corta. En esos casos el
 * usuario puede regenerarla sin que le cobremos cupo de plan nuevamente.
 */
export function isGuiaIncompleta(consulta: ConsultaMinima): boolean {
  const respuesta = consulta.respuesta_ia;
  if (!respuesta) return true;
  if (respuesta.length < 500) return true;

  const structured = (consulta.datos_modulo ?? {}).structured as
    | StructuredGuide
    | undefined;

  // Corte abrupto: si la última línea no vacía termina con letra (sin
  // puntuación, asterisco, paréntesis ni similar), el stream se cortó a mitad
  // de una oración. Ejemplo real: "Si se descon" — guía trabada confirmada.
  if (terminaCortada(respuesta)) return true;

  // Cantidad mínima de secciones — una guía completa tiene ≥4 headings.
  const secciones = countMarkdownHeadings(respuesta);
  if (!structured && secciones < 4) return true;
  if (structured && structured.sections.length < 3) return true;

  return false;
}

function terminaCortada(md: string): boolean {
  const end = md.trimEnd();
  if (end.length === 0) return true;
  const lastChar = end.charAt(end.length - 1);
  // Caracteres que indican cierre "natural" de una guía.
  return !/[.!?:)*>”"`'\-—–…»』】]/.test(lastChar);
}

function countMarkdownHeadings(md: string): number {
  let count = 0;
  for (const line of md.split('\n')) {
    if (/^#{1,6}\s+\S/.test(line)) count++;
  }
  return count;
}

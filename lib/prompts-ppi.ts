import type { PPIFormValues, PPISeccionKey } from '@/lib/types/ppi'
import { SECCION_LABELS } from '@/lib/types/ppi'

/**
 * Prompt para generar un Proyecto Pedagógico Individual (PPI) completo
 * conforme al marco normativo argentino:
 *  - Res. CFE 311/16 (trayectorias educativas integrales con discapacidad)
 *  - Ley 26.206 (Educación Nacional)
 *  - Ley 26.378 (Convención sobre los Derechos de las Personas con Discapacidad)
 */

export const PPI_SYSTEM_PROMPT = `Sos un/a docente experto/a en educación inclusiva argentina con 20 años de trayectoria en escuelas de gestión estatal y privada. Asesorás a docentes de escuela común para redactar Proyectos Pedagógicos Individuales (PPI) conforme a la Resolución CFE 311/16, Ley 26.206 y Ley 26.378.

Principios que guían tu escritura:
1. Tono profesional, propio del ámbito educativo argentino. Usás "el/la estudiante", no "niño/niña". Evitás diminutivos.
2. Lenguaje basado en fortalezas (no en déficits). Escribís "requiere apoyos visuales para..." y no "no puede...".
3. Nombrás las barreras del CONTEXTO, no del estudiante. "La organización del aula tradicional resulta una barrera" antes que "el estudiante no se adapta".
4. Citás el marco normativo cuando corresponde pero NUNCA inventás números de artículo. Si dudás, decís "conforme a la Resolución CFE 311/16" sin especificar artículo.
5. Las adaptaciones deben ser CONCRETAS, OBSERVABLES y EVALUABLES — no genéricas.
6. NO incluís el nombre completo del alumno: usás el identificador (iniciales o pseudónimo) que te da el docente.
7. NUNCA inventás diagnósticos médicos. Si el docente no cargó diagnóstico, evitás nombrar condiciones específicas.
8. Generás contenido listo para imprimir: sin emojis, sin viñetas decorativas, con párrafos bien estructurados.
9. Respetás la diversidad de contextos argentinos: escuelas urbanas y rurales, gestión estatal y privada, distintas provincias.

Formato de salida: **exclusivamente JSON válido** con la estructura pedida, sin texto antes o después, sin markdown fences.`

function listarDiscapacidades(ids: string[]): string {
  const mapa: Record<string, string> = {
    visual: 'discapacidad visual',
    auditiva: 'discapacidad auditiva',
    motriz: 'discapacidad motriz',
    intelectual: 'discapacidad intelectual',
    tea: 'Trastorno del Espectro Autista (TEA)',
    tdah: 'TDAH',
    multiple: 'discapacidad múltiple',
    visceral: 'discapacidad visceral',
    otra: 'discapacidad (a especificar por el equipo)',
  }
  return ids.map((id) => mapa[id] ?? id).join(', ')
}

export function buildPPIUserPrompt(
  input: PPIFormValues,
  guiasPrevias: Array<{ materia?: string; contenido: string }> = []
): string {
  const guiasResumen =
    guiasPrevias.length > 0
      ? `\n\nGUÍAS PEDAGÓGICAS YA GENERADAS PARA ESTE ESTUDIANTE:\n${guiasPrevias
          .map((g, i) => `${i + 1}. ${g.materia ?? 'Sin materia'} — ${g.contenido.slice(0, 200)}`)
          .join('\n')}`
      : ''

  return `Redactá el Proyecto Pedagógico Individual (PPI) del siguiente estudiante:

IDENTIFICACIÓN (interna — NO incluir nombre completo en el documento):
- Identificador: ${input.alumno_identificador}
- Edad: ${input.alumno_edad} años
- Nivel: ${input.alumno_nivel}
- Año/grado: ${input.alumno_anio_grado ?? 'no especificado'}
- Discapacidad/es: ${listarDiscapacidades(input.alumno_discapacidades)}
- Diagnóstico aportado por el docente: ${input.alumno_diagnostico ?? 'no especificado'}

INSTITUCIÓN Y CICLO:
- Institución: ${input.institucion}
- Ciclo lectivo: ${input.ciclo_lectivo}
- Período del PPI: ${input.periodo.replace(/_/g, ' ')}

OBSERVACIONES DEL DOCENTE:
Fortalezas observadas:
${input.fortalezas_observadas}

Barreras observadas:
${input.barreras_observadas}

Contexto familiar aportado:
${input.contexto_familiar ?? 'sin datos'}

Equipo externo de apoyo:
${input.equipo_externo ?? 'sin datos'}
${guiasResumen}

SALIDA ESPERADA (JSON ESTRICTO):
{
  "datos_generales": { "titulo": "...", "contenido": "párrafo inicial con contexto institucional y del estudiante, SIN nombre completo" },
  "fortalezas": { "titulo": "Fortalezas del estudiante", "contenido": "párrafo introductorio", "puntos": ["fortaleza 1", "fortaleza 2", "fortaleza 3"] },
  "barreras": { "titulo": "Barreras para el aprendizaje y la participación", "contenido": "texto reconociendo que las barreras están en el contexto, no en el estudiante", "puntos": ["barrera 1", "barrera 2"] },
  "apoyos": { "titulo": "Configuraciones de apoyo", "contenido": "párrafo según CFE 311/16", "puntos": ["apoyo concreto 1", "apoyo concreto 2", "apoyo concreto 3"] },
  "contenidos_priorizados": { "titulo": "Contenidos curriculares priorizados", "contenido": "texto que explica el criterio de priorización", "puntos": ["contenido 1 con justificación", "contenido 2"] },
  "adaptaciones_metodologicas": { "titulo": "Adaptaciones metodológicas", "contenido": "párrafo", "puntos": ["adaptación concreta 1", "adaptación concreta 2", "adaptación concreta 3"] },
  "evaluacion": { "titulo": "Criterios y modalidad de evaluación", "contenido": "texto que describe cómo se evalúa basado en capacidades y no por comparación con pares", "puntos": ["criterio 1", "criterio 2"] },
  "acuerdos_familia": { "titulo": "Acuerdos con la familia", "contenido": "texto describiendo espacios de encuentro, canales de comunicación y acuerdos concretos", "puntos": ["acuerdo 1", "acuerdo 2"] },
  "articulacion_equipo": { "titulo": "Articulación con equipo de apoyo externo", "contenido": "texto — si no hay equipo externo, indicarlo y proponer pasos para buscarlo", "puntos": ["acción 1", "acción 2"] },
  "seguimiento_trimestral": { "titulo": "Plan de seguimiento trimestral", "contenido": "explicación del seguimiento", "puntos": ["Trimestre 1: qué se evaluará", "Trimestre 2: ...", "Trimestre 3: ..."] }
}

Cada "contenido" debe tener entre 80 y 220 palabras.
Cada "puntos" debe listar entre 3 y 6 ítems concretos y evaluables.
Devolvé SOLO el JSON, sin markdown, sin texto adicional.`
}

export function buildPPIRegenerarPrompt(
  input: PPIFormValues,
  seccion: PPISeccionKey,
  instruccion?: string
): string {
  return `Regenerá exclusivamente la sección "${SECCION_LABELS[seccion]}" del PPI del estudiante ${input.alumno_identificador} (${input.alumno_edad} años, ${input.alumno_nivel}).

Fortalezas observadas por el docente: ${input.fortalezas_observadas}
Barreras observadas: ${input.barreras_observadas}
${instruccion ? `\nINSTRUCCIÓN ADICIONAL DEL DOCENTE: ${instruccion}\n` : ''}

Devolvé SOLO un JSON con la forma:
{ "titulo": "...", "contenido": "párrafo de 80-220 palabras", "puntos": ["...", "...", "..."] }

Sin markdown, sin texto adicional antes o después del JSON.`
}

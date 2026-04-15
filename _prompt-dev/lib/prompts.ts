// ============================================
// IncluIA — Constructor de Prompts para Claude
// Este archivo es el CORAZÓN del sistema.
// Cada modificación aquí impacta directamente la calidad de las guías.
// ============================================

import { FormularioConsulta } from '@/lib/types'
import { getDiscapacidadesByIds } from '@/data/discapacidades'

/**
 * SYSTEM PROMPT
 * Define el rol y las reglas generales de Claude como asistente pedagógico.
 * Separado del prompt del usuario para mantener consistencia.
 */
export const SYSTEM_PROMPT = `Sos un especialista en educación inclusiva con más de 20 años de experiencia en el sistema educativo argentino. Tenés profundo conocimiento en:

- Diseño Universal para el Aprendizaje (DUA)
- Adecuaciones curriculares de acceso y significativas (Resolución CFE N° 311/16)
- Configuraciones de apoyo según las necesidades del alumno
- Diseños curriculares jurisdiccionales de las provincias argentinas
- Normativa vigente: Ley 26.206, Convención sobre los Derechos de las Personas con Discapacidad, Ley 26.378

REGLAS DE RESPUESTA:
1. Siempre respondés de forma CONCRETA y PRÁCTICA — con ejemplos reales aplicables al contenido específico que te dan
2. NUNCA respondés con teoría genérica ni definiciones de manual
3. Cada estrategia que proponés incluye un ejemplo concreto usando el contenido que el docente va a enseñar
4. Usás lenguaje claro, profesional y respetuoso — sin jerga técnica innecesaria
5. Reconocés la realidad de las aulas argentinas: falta de recursos, aulas numerosas, falta de acompañamiento
6. Siempre proponés alternativas de bajo costo y fáciles de implementar
7. Cuando es pertinente, sugerís recursos digitales gratuitos disponibles en Argentina
8. Respondés en español rioplatense argentino

FORMATO DE RESPUESTA:
Organizá tu respuesta en las secciones indicadas, usando encabezados con ## para cada sección.
Dentro de cada sección, usá listas con viñetas para las estrategias.
Cada estrategia debe tener: la acción + un ejemplo concreto con el contenido indicado.`

/**
 * buildPrompt()
 * Construye el prompt del usuario con toda la información del formulario.
 * El objetivo es dar a Claude TODA la información necesaria para generar
 * una guía realmente personalizada y útil.
 */
export function buildPrompt(form: FormularioConsulta): string {
  // Obtener datos completos de las discapacidades seleccionadas
  const discapacidades = getDiscapacidadesByIds(form.discapacidades)

  // Construir bloque de discapacidades con estrategias clave
  const bloqueDiscapacidades = discapacidades
    .map(d => {
      return `- **${d.label}**: ${d.descripcion}
  Estrategias clave a considerar: ${d.estrategias_clave.join(', ')}`
    })
    .join('\n')

  // Si seleccionó "otra", agregar la descripción libre
  const otraDiscapacidad = form.discapacidad_otra
    ? `\n- **Otra condición especificada por el docente**: ${form.discapacidad_otra}`
    : ''

  // Mapear situación de apoyo a texto legible
  const apoyoTexto: Record<string, string> = {
    maestra_integradora: 'Cuenta con Maestra de Apoyo a la Inclusión (MAI) / Maestra Integradora',
    acompanante_terapeutico: 'Cuenta con Acompañante Terapéutico (AT) en el aula',
    sin_apoyo: 'NO cuenta con ningún apoyo profesional adicional en el aula',
    en_diagnostico: 'El alumno está en proceso de diagnóstico (aún sin certificado de discapacidad)',
    otro: 'Otra situación de apoyo',
  }

  // Bloque de contexto adicional (si el docente lo completó)
  const bloqueContexto = form.contexto_aula
    ? `\n## Contexto del aula descrito por el docente:\n${form.contexto_aula}`
    : ''

  const bloqueObjetivo = form.objetivo_clase
    ? `\n## Objetivo de la clase:\n${form.objetivo_clase}`
    : ''

  // --- PROMPT PRINCIPAL ---
  const prompt = `Necesito que generes una GUÍA PEDAGÓGICA CONCRETA E INCLUSIVA para la siguiente situación real de aula:

## Datos del contexto:
- **Nivel educativo**: ${form.nivel_id}${form.subnivel_id ? ` — ${form.subnivel_id}` : ''}
- **Año/Grado/Sala**: ${form.anio_grado}
- **Materia/Área**: ${form.materia}
- **Contenido a trabajar**: ${form.contenido}
- **Cantidad de alumnos con discapacidad en el aula**: ${form.cantidad_alumnos}
- **Situación de apoyo**: ${apoyoTexto[form.situacion_apoyo] || form.situacion_apoyo_otra || 'No especificada'}

## Discapacidad/es del alumno/s:
${bloqueDiscapacidades}${otraDiscapacidad}
${bloqueContexto}
${bloqueObjetivo}

---

Generá la guía con las siguientes 7 secciones. En CADA sección, las estrategias deben ser concretas y usar como ejemplo el contenido "${form.contenido}" de la materia ${form.materia}:

## 1. 📚 Contenidos prioritarios y adecuación curricular
- Qué contenidos priorizar del tema "${form.contenido}"
- Qué nivel de complejidad es apropiado
- Cómo adaptar el contenido sin empobrecerlo
- Ejemplo concreto de adecuación para este contenido

## 2. 🎯 Estrategias de enseñanza concretas
- Al menos 4 estrategias diferentes para enseñar "${form.contenido}"
- Cada estrategia con ejemplo paso a paso
- Incluir opciones de alta y baja tecnología
- Considerar DUA: múltiples formas de representación, acción/expresión y motivación

## 3. 🧰 Materiales y recursos adaptados
- Materiales concretos para trabajar "${form.contenido}" (describir cómo hacerlos)
- Recursos digitales gratuitos disponibles en Argentina
- Adaptaciones de materiales que ya existen en el aula
- Al menos un material listo para usar o instrucciones para crearlo

## 4. 📝 Evaluación justa y diferenciada
- Cómo evaluar "${form.contenido}" de forma accesible
- Al menos 3 instrumentos de evaluación alternativos
- Criterios de evaluación adaptados pero rigurosos
- Ejemplo de rúbrica o grilla adaptada para este contenido

## 5. 💬 Comunicación y vínculo en el aula
- Cómo presentar la actividad inclusivamente al grupo completo
- Estrategias para que el alumno participe con sus pares
- Cómo manejar posibles situaciones de frustración
- Lenguaje a usar y evitar

## 6. ⚠️ Qué evitar
- Errores comunes que docentes cometen con esta discapacidad
- Prácticas que parecen inclusivas pero no lo son
- Qué NO hacer al trabajar "${form.contenido}" con este alumno

## 7. 🤝 Coordinación con otros actores
- Qué comunicar a la familia sobre el trabajo con "${form.contenido}"
- Cómo coordinar con ${form.situacion_apoyo === 'sin_apoyo' ? 'el Equipo de Orientación Escolar (EOE) y qué gestiones hacer para conseguir apoyo' : 'la maestra integradora / acompañante terapéutico'}
- Qué registrar en el legajo del alumno
- Sugerencias para la próxima reunión de equipo

${form.discapacidades.length > 1 ? `\n## 8. 🔄 Estrategias unificadas para múltiples discapacidades\nEl aula tiene alumnos con diferentes discapacidades. Proponé estrategias que beneficien a TODOS simultáneamente al trabajar "${form.contenido}", siguiendo los principios del DUA.` : ''}

IMPORTANTE: No respondas con teoría. Cada punto debe tener un EJEMPLO CONCRETO usando "${form.contenido}" como contenido.`

  return prompt
}

/**
 * Estimación de tokens para control de costos.
 * Aproximación: 1 token ≈ 4 caracteres en español
 */
export function estimarTokens(texto: string): number {
  return Math.ceil(texto.length / 4)
}

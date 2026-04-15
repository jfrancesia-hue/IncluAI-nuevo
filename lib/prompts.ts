// ============================================
// IncluIA — Constructor de Prompts para Claude
// Este archivo es el CORAZÓN del sistema.
// Cada modificación aquí impacta directamente la calidad de las guías.
// ============================================

import { FormularioConsulta, FormularioFamilia, FormularioProfesional } from '@/lib/types'
import { getDiscapacidadesByIds } from '@/data/discapacidades'
import { getEspecialidadById } from '@/data/especialidades'
import { getAreaFamiliaById } from '@/data/areas-familia'
import { getObjetivoProfesionalById } from '@/data/objetivos-profesional'

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
9. Cuando corresponde, citás la normativa específica entre paréntesis — ej: "(Res. CFE 311/16, art. 23)" o "(Ley 26.206, art. 11)"

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

// ============================================
// SYSTEM PROMPT — FAMILIAS
// ============================================

export const SYSTEM_PROMPT_FAMILIAS = `Sos un especialista en acompañamiento familiar para personas con discapacidad, con más de 20 años de experiencia en Argentina. Tenés conocimiento profundo en:

- Desarrollo infantil y del ciclo vital en personas con discapacidad
- Estrategias de crianza positiva adaptadas
- Comunicación aumentativa y alternativa (CAA) en el hogar
- Derechos de las personas con discapacidad en Argentina (Ley 22.431, Ley 24.901, CUD)
- Regulación emocional y manejo conductual en el hogar
- Estimulación temprana y actividades funcionales en casa
- Realidad de las familias argentinas: recursos limitados, falta de cobertura, distancia a centros de atención

REGLAS DE RESPUESTA:
1. Respondés como si hablaras con un padre o madre que está agotado/a y necesita ayuda CONCRETA
2. NUNCA juzgás ni culpabilizás a la familia
3. Cada consejo incluye un EJEMPLO PRÁCTICO que se puede hacer hoy en casa
4. Usás lenguaje cálido, empático y simple — sin jerga clínica
5. Reconocés que la familia hace lo mejor que puede con lo que tiene
6. Proponés actividades con materiales de casa (no costosos ni difíciles de conseguir)
7. Cuando es necesario, orientás sobre trámites y derechos en Argentina citando normativa (Ley 24.901, Ley 22.431, Ley 26.378, CUD)
8. Respondés en español rioplatense argentino

FORMATO: Secciones con ## y listas con viñetas. Cada consejo con ejemplo concreto.`

// ============================================
// SYSTEM PROMPT — PROFESIONALES
// ============================================

export const SYSTEM_PROMPT_PROFESIONALES = `Sos un consultor interdisciplinario especializado en atención de personas con discapacidad, con más de 20 años de experiencia clínica y docente en Argentina. Tenés conocimiento en:

- Abordaje clínico adaptado para todas las discapacidades
- Comunicación terapéutica con pacientes con diversas necesidades comunicativas
- Adaptación de espacios de atención (consultorios, hospitales, domicilios)
- Manejo conductual durante procedimientos médicos y terapéuticos
- Evaluación funcional adaptada
- Trabajo interdisciplinario y coordinación de equipos
- Marco legal: Ley 24.901 (prestaciones), Ley 26.378 (Convención), CUD, obras sociales

REGLAS DE RESPUESTA:
1. Respondés con nivel técnico-profesional pero accesible
2. Cada recomendación es ESPECÍFICA para la especialidad del profesional que consulta
3. Incluís protocolos paso a paso cuando corresponde
4. Diferenciás claramente entre lo ideal y lo posible con recursos limitados
5. Sugerís cómo adaptar técnicas estándar al paciente concreto
6. Incluís qué comunicar a la familia después de la atención
7. Proponés cómo coordinar con otros profesionales del equipo
8. Respondés en español rioplatense argentino
9. Citás marco legal y guías de práctica cuando corresponde (Ley 24.901, Ley 26.378, protocolos ministeriales)

FORMATO: Secciones con ## y listas con viñetas. Cada estrategia con ejemplo concreto.`

// ============================================
// BUILDER — FAMILIAS
// ============================================

export function buildPromptFamilias(form: FormularioFamilia): string {
  const discapacidades = getDiscapacidadesByIds(form.discapacidades)
  const bloqueDisc = discapacidades.map((d) => `- **${d.label}**: ${d.descripcion}`).join('\n')
  const areasLabels = form.areas_ayuda
    .map((id) => getAreaFamiliaById(id)?.label ?? id)
    .join(', ')

  const situacionTexto: Record<string, string> = {
    ambos_padres: 'Familia con ambos padres presentes',
    monoparental: 'Familia monoparental',
    familia_ampliada: 'Familia ampliada (abuelos, tíos involucrados)',
    otro: 'Otra situación familiar',
  }

  return `Necesito una GUÍA PRÁCTICA PARA FAMILIAS para esta situación real:

## Sobre el/la hijo/a:
- **Edad**: ${form.edad_rango} años
${form.nombre_hijo ? `- **Nombre**: ${form.nombre_hijo}` : ''}
- **Discapacidad/es**:
${bloqueDisc}
${form.diagnostico_detalle ? `- **Detalle del diagnóstico**: ${form.diagnostico_detalle}` : ''}

## ¿En qué necesita ayuda la familia?
- **Áreas**: ${areasLabels}
- **Situación específica**: ${form.situacion_especifica}

## Contexto familiar:
- **Situación**: ${situacionTexto[form.situacion_familiar] ?? form.situacion_familiar}
- **Terapias**: ${form.tiene_terapias ? form.terapias_detalle || 'Sí, tiene terapias' : 'No realiza terapias actualmente'}
${form.contexto_adicional ? `- **Contexto adicional**: ${form.contexto_adicional}` : ''}

---

Generá la guía con estas secciones:

## 1. 🏠 Entendiendo la situación
- Explicar brevemente por qué se da esta situación en relación a la discapacidad
- Normalizar: "esto es esperable y tiene solución"
- Qué esperar de forma realista

## 2. 🎯 Estrategias concretas para casa
- Al menos 5 estrategias prácticas para las áreas: ${areasLabels}
- Cada una con ejemplo paso a paso usando cosas de la casa
- Incluir opciones para cuando hay poco tiempo o energía
- Alternativas si no funciona la primera opción

## 3. 📅 Rutina sugerida
- Proponer una rutina diaria adaptada que incluya las estrategias
- Horarios orientativos pero flexibles
- Momentos clave del día donde aplicar cada estrategia
- Tips para las transiciones entre actividades

## 4. 🧰 Materiales y recursos caseros
- Materiales que se pueden hacer con cosas de la casa
- Apps o recursos digitales gratuitos recomendados
- Juegos y actividades que trabajen las áreas indicadas
- Al menos un recurso listo para usar

## 5. 💬 Comunicación y vínculo
- Cómo hablarle y comunicarse efectivamente
- Qué palabras y tono usar
- Cómo manejar los momentos de frustración (del hijo/a Y del adulto)
- Cómo celebrar los logros sin presionar

## 6. ⚠️ Qué evitar
- Errores comunes que cometen las familias (sin culpar)
- Mitos sobre esta discapacidad
- Consejos bienintencionados de otros que pueden ser contraproducentes
- Señales de que algo no está funcionando y hay que pedir ayuda

## 7. 📋 Coordinación con profesionales y escuela
- Qué pedirle a los terapeutas sobre las áreas indicadas
- Cómo comunicar a la escuela lo que se está trabajando en casa
- Trámites o gestiones que podría hacer (CUD, prestaciones, etc.)
- Cuándo consultar al médico

${form.areas_ayuda.length > 2 ? `\n## 8. 🔑 Las 3 prioridades para esta semana\nDe todo lo anterior, elegí las 3 acciones más importantes para arrancar ESTA SEMANA. Que sean simples, concretas y alcanzables.` : ''}

IMPORTANTE: Escribí como si hablaras con un padre/madre agotado/a que necesita ayuda HOY. Sin jerga técnica, sin juicio, con mucho cariño y ejemplos reales.`
}

// ============================================
// BUILDER — PROFESIONALES
// ============================================

export function buildPromptProfesionales(form: FormularioProfesional): string {
  const discapacidades = getDiscapacidadesByIds(form.discapacidades)
  const bloqueDisc = discapacidades
    .map(
      (d) =>
        `- **${d.label}**: ${d.descripcion}\n  Consideraciones clave: ${d.estrategias_clave.join(', ')}`
    )
    .join('\n')
  const objetivosLabels = form.objetivos
    .map((id) => getObjetivoProfesionalById(id)?.label ?? id)
    .join(', ')
  const esp = getEspecialidadById(form.especialidad)
  const contextoTexto: Record<string, string> = {
    primera_consulta: 'primera consulta',
    seguimiento: 'control de seguimiento',
    evaluacion: 'evaluación',
    intervencion: 'sesión de intervención',
    interconsulta: 'interconsulta',
    domiciliaria: 'atención domiciliaria',
  }

  return `Necesito una GUÍA DE ATENCIÓN PROFESIONAL ADAPTADA para esta situación:

## Profesional que consulta:
- **Especialidad**: ${esp?.label || form.especialidad_otra || form.especialidad}
- **Contexto de atención**: ${contextoTexto[form.contexto_atencion] ?? form.contexto_atencion}
- **Lugar**: ${form.lugar_atencion}

## Sobre el paciente:
- **Edad**: ${form.edad_paciente} años
- **Discapacidad/es**:
${bloqueDisc}
${form.diagnostico_detalle ? `- **Detalle diagnóstico**: ${form.diagnostico_detalle}` : ''}
- **Nivel de comunicación**: ${form.comunicacion_paciente}

## ¿Qué necesita el profesional?
- **Objetivos**: ${objetivosLabels}
- **Situación**: ${form.situacion_especifica}
${form.contexto_adicional ? `- **Contexto adicional**: ${form.contexto_adicional}` : ''}

---

Generá la guía con estas secciones, adaptadas específicamente a un/a ${esp?.label || form.especialidad}:

## 1. 🏥 Preparación del espacio y la sesión
- Cómo adaptar el consultorio/espacio ANTES de que llegue el paciente
- Qué materiales preparar
- Disposición del espacio físico
- Consideraciones sensoriales

## 2. 💬 Estrategias de comunicación
- Cómo comunicarse efectivamente con un paciente con ${discapacidades[0]?.label || 'esta discapacidad'}
- Nivel de comunicación: ${form.comunicacion_paciente}
- Apoyos visuales, verbales o gestuales recomendados
- Cómo dar instrucciones durante procedimientos
- Qué lenguaje usar y cuál evitar

## 3. 🎯 Abordaje clínico adaptado
- Protocolo paso a paso para la sesión de ${contextoTexto[form.contexto_atencion] ?? form.contexto_atencion}
- Adaptaciones específicas de la técnica estándar de ${esp?.label || 'su especialidad'}
- Tiempos recomendados (sesiones más cortas, pausas, desensibilización)
- Alternativas si el paciente no tolera el procedimiento estándar

## 4. 🌊 Manejo de conductas durante la atención
- Conductas esperables en pacientes con ${discapacidades[0]?.label || 'esta discapacidad'}
- Protocolo de desescalada paso a paso
- Técnicas de regulación durante la sesión
- Cuándo pausar y cuándo continuar
- Cuándo re-programar la sesión

## 5. 📝 Evaluación y registro
- Cómo evaluar de forma adaptada
- Instrumentos de evaluación recomendados para esta población
- Qué registrar en la historia clínica
- Cómo documentar avances con criterios adaptados

## 6. 👨‍👩‍👧 Orientación a la familia
- Qué explicar a la familia después de la sesión
- Indicaciones para continuar en casa
- Material imprimible o visual para entregar
- Cómo manejar las expectativas familiares

## 7. 🤝 Coordinación interdisciplinaria
- Con qué otros profesionales coordinar
- Qué información compartir en reunión de equipo
- Cómo escribir un informe útil para otros profesionales
- Derivaciones sugeridas si se detectan necesidades adicionales

IMPORTANTE: Respondé con nivel profesional pero accesible. Cada recomendación debe ser ESPECÍFICA para un/a ${esp?.label || 'profesional de esta especialidad'} atendiendo a un paciente con ${discapacidades[0]?.label || 'esta discapacidad'}.`
}

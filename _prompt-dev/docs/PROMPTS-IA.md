# PROMPTS-IA.md — IncluIA
## System prompt, builder de prompts y lógica de generación
## Claude Code: copiar lib/prompts.ts TEXTUALMENTE desde este archivo

---

## INSTRUCCIÓN PARA CLAUDE CODE

Este archivo contiene el CORAZÓN del producto. El prompt es lo que determina si la guía generada es útil o no. Copiá el código a `lib/prompts.ts` sin modificaciones. Si en el futuro se necesita ajustar el prompt, se hace SOLO en este archivo y se actualiza prompts.ts.

---

## Archivo: `lib/prompts.ts`

```typescript
// ============================================
// IncluIA — Constructor de Prompts para Claude
// CORAZÓN DEL SISTEMA — Modificar con cuidado
// ============================================

import { FormularioConsulta } from '@/lib/types'
import { getDiscapacidadesByIds } from '@/data/discapacidades'

/**
 * SYSTEM PROMPT
 * Define el rol y las reglas de Claude como asistente pedagógico inclusivo.
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
9. Usás el término "alumno/a" o "estudiante", nunca "niño especial" ni terminología despectiva
10. Si el docente indica que no tiene apoyo profesional, reconocés la dificultad y proponés estrategias realistas

FORMATO DE RESPUESTA:
Organizá tu respuesta en las secciones indicadas, usando encabezados con ## para cada sección.
Dentro de cada sección, usá listas con viñetas para las estrategias.
Cada estrategia debe tener: la acción + un ejemplo concreto con el contenido indicado.
Usá negrita para resaltar las acciones principales.
Al final de cada sección, incluí un tip práctico marcado con 💡.`

/**
 * buildPrompt()
 * Construye el prompt del usuario con toda la información del formulario.
 */
export function buildPrompt(form: FormularioConsulta): string {
  const discapacidades = getDiscapacidadesByIds(form.discapacidades)

  const bloqueDiscapacidades = discapacidades
    .map(d => {
      return `- **${d.label}**: ${d.descripcion}
  Estrategias clave a considerar: ${d.estrategias_clave.join(', ')}`
    })
    .join('\n')

  const otraDiscapacidad = form.discapacidad_otra
    ? `\n- **Otra condición especificada por el docente**: ${form.discapacidad_otra}`
    : ''

  const apoyoTexto: Record<string, string> = {
    maestra_integradora: 'Cuenta con Maestra de Apoyo a la Inclusión (MAI) / Maestra Integradora',
    acompanante_terapeutico: 'Cuenta con Acompañante Terapéutico (AT) en el aula',
    sin_apoyo: 'NO cuenta con ningún apoyo profesional adicional en el aula',
    en_diagnostico: 'El alumno está en proceso de diagnóstico (aún sin certificado de discapacidad)',
    otro: 'Otra situación de apoyo',
  }

  const bloqueContexto = form.contexto_aula
    ? `\n## Contexto del aula descrito por el docente:\n${form.contexto_aula}`
    : ''

  const bloqueObjetivo = form.objetivo_clase
    ? `\n## Objetivo de la clase:\n${form.objetivo_clase}`
    : ''

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
 * Estimación de tokens para control de costos
 */
export function estimarTokens(texto: string): number {
  return Math.ceil(texto.length / 4)
}
```

---

## Notas sobre el prompt

### Por qué funciona bien este prompt:

1. **System prompt separado:** Define el rol permanente. No cambia con cada consulta.
2. **User prompt dinámico:** Se construye con los datos reales del formulario.
3. **Estrategias clave inyectadas:** Cada discapacidad lleva sus estrategias como "semillas" para que Claude las use como punto de partida.
4. **Contenido repetido intencionalmente:** El contenido que el docente quiere enseñar aparece múltiples veces en el prompt para forzar a Claude a usarlo en cada ejemplo.
5. **Secciones fijas:** Las 7 secciones garantizan consistencia en todas las guías.
6. **Sección 8 condicional:** Solo aparece si hay múltiples discapacidades.
7. **Instrucción final reforzada:** "No respondas con teoría" como cierre.

### Para iterar el prompt en el futuro:

1. Probar con casos reales y anotar qué falla
2. Agregar/modificar instrucciones en el SYSTEM_PROMPT
3. Ajustar las secciones solicitadas en buildPrompt
4. NUNCA cambiar la estructura sin probar con al menos 5 combinaciones diferentes
5. Los mejores casos de prueba:
   - Primario rural + TEA + sin apoyo (caso más exigente)
   - Secundario + dislexia + Matemática
   - Inicial + discapacidad intelectual + Formación Personal
   - Especial + multidiscapacidad + Área comunicacional
   - EPJA + TDAH + Alfabetización

export type Tip = { texto: string; fuente: string };

export const TIPS: Tip[] = [
  { texto: 'El DUA no es solo para alumnos con discapacidad — beneficia a TODOS los estudiantes del aula.', fuente: 'CAST, 2018' },
  { texto: 'Las adecuaciones curriculares significativas requieren consentimiento familiar documentado.', fuente: 'Res. CFE 311/16' },
  { texto: 'La inclusión no es ubicar al alumno en el aula: es garantizar que aprenda y participe.', fuente: 'Convención sobre los Derechos de las Personas con Discapacidad, Art. 24' },
  { texto: 'Usar imágenes y pictogramas beneficia a todos, no solo a alumnos con TEA o hipoacusia.', fuente: 'DUA — múltiples formas de representación' },
  { texto: 'Dar 2 segundos extra después de una pregunta aumenta la participación del 30% al 80%.', fuente: 'Rowe, 1986 — Wait time studies' },
  { texto: 'Las rutinas visuales reducen la ansiedad en todos los alumnos, especialmente con TEA.', fuente: 'TEACCH Structured Teaching' },
  { texto: 'Evaluar el proceso, no solo el resultado, permite ver avances que una prueba no muestra.', fuente: 'Res. CFE 311/16, art. 23' },
  { texto: 'Un alumno con TDAH no es "distraído": su cerebro regula atención y motivación de forma distinta.', fuente: 'DSM-5, TR — APA' },
  { texto: 'La Ley 26.206 garantiza el derecho a la educación inclusiva desde el Nivel Inicial.', fuente: 'Ley de Educación Nacional 26.206, art. 11' },
  { texto: 'Leer el contexto en voz alta antes de una prueba beneficia a dislexia y a quienes no terminaron de desayunar.', fuente: 'DUA — principio 2' },
  { texto: 'La maestra integradora (MAI) es tu aliada, no tu reemplazo — coordinen estrategias en reunión semanal.', fuente: 'Res. CFE 155/11' },
  { texto: 'Fragmentar una tarea larga en 3 pasos visibles aumenta la autonomía de todos.', fuente: 'Task analysis — Applied Behavior Analysis' },
  { texto: 'No todos los alumnos con discapacidad intelectual tienen retraso del lenguaje.', fuente: 'AAIDD — American Association on Intellectual and Developmental Disabilities' },
  { texto: 'Dar feedback específico ("usaste el conector correctamente") enseña más que "muy bien".', fuente: 'Hattie, 2012 — Visible Learning' },
  { texto: 'El CUD habilita prestaciones por la Ley 24.901: transporte, rehabilitación, apoyo escolar.', fuente: 'Ley 24.901 — Sistema de Prestaciones Básicas' },
  { texto: 'Sordera no es sinónimo de dificultad cognitiva — la barrera es comunicativa, no intelectual.', fuente: 'Ley 27.710 — LSA como lengua natural' },
  { texto: 'Pictogramas gratis en español: arasaac.org — más de 13.000 símbolos para el aula.', fuente: 'ARASAAC — Aragón, España' },
  { texto: 'La autoregulación emocional se enseña como cualquier otra habilidad: con práctica y ejemplos.', fuente: 'CASEL — Social and Emotional Learning' },
  { texto: 'Un niño con discapacidad motriz puede necesitar más tiempo, no "menos complejidad".', fuente: 'DUA — principio de acción y expresión' },
  { texto: 'Las instrucciones escritas + orales + visuales = triple posibilidad de que la tarea se entienda.', fuente: 'DUA — redundancia sensorial' },
  { texto: 'No hay evidencia científica de que los videojuegos causen TDAH. Sí hay que regular pantallas.', fuente: 'AAP — American Academy of Pediatrics' },
  { texto: 'Los berrinches en TEA suelen ser desregulación sensorial, no mala crianza.', fuente: 'Dunn — Sensory Profile' },
  { texto: 'El acompañante terapéutico (AT) trabaja para la inclusión, no para aislar al alumno.', fuente: 'Ley 24.901 — AT como prestación' },
  { texto: 'Involucrar a los pares en el plan de inclusión multiplica su efectividad.', fuente: 'Peer tutoring — Topping, 2005' },
  { texto: 'Adaptar un texto no es "simplificar": es conservar la idea central con lenguaje claro.', fuente: 'Lectura fácil — IFLA guidelines' },
  { texto: 'La dislexia afecta entre 5% y 15% de la población — es la "discapacidad" más invisibilizada.', fuente: 'International Dyslexia Association' },
  { texto: 'Un buen informe pedagógico describe qué SÍ puede hacer el alumno, no solo qué no.', fuente: 'Res. CFE 311/16 — informe de trayectoria' },
  { texto: 'La frustración es una emoción válida: enseñar a tolerarla es enseñar a aprender.', fuente: 'Dweck — Mindset' },
  { texto: 'El "ajuste razonable" no es opcional: la ley 26.378 lo exige en toda institución educativa.', fuente: 'Ley 26.378, art. 24' },
  { texto: 'Repetir contenido no es lo mismo que consolidar. Variar el contexto profundiza el aprendizaje.', fuente: 'Spaced retrieval — Bjork' },
];

export function getTipDelDia(): Tip {
  // Determinístico por día del año
  const d = new Date();
  const start = new Date(d.getUTCFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  const day = Math.floor(diff / (1000 * 60 * 60 * 24));
  return TIPS[day % TIPS.length];
}

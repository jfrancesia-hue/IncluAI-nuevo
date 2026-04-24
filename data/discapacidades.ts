// ============================================
// IncluAI — Catálogo de Discapacidades
// Con descripciones y estrategias clave para el prompt de IA
// ============================================

import { Discapacidad } from '@/lib/types'

export const DISCAPACIDADES: Discapacidad[] = [
  {
    id: 'intelectual',
    label: 'Discapacidad Intelectual',
    icon: '🧠',
    descripcion:
      'Limitaciones significativas en el funcionamiento intelectual y en la conducta adaptativa. Requiere simplificación de consignas, tiempos extendidos y apoyos concretos.',
    estrategias_clave: [
      'simplificar consignas',
      'usar material concreto',
      'fragmentar tareas',
      'repetición y rutinas',
      'apoyos visuales',
      'tiempos extendidos',
      'evaluación por proceso',
    ],
  },
  {
    id: 'tea',
    label: 'Trastorno del Espectro Autista (TEA)',
    icon: '🧩',
    descripcion:
      'Dificultades en la comunicación social, interacción y patrones de conducta restringidos o repetitivos. Necesita anticipación, estructura y respeto por sus intereses.',
    estrategias_clave: [
      'anticipar cambios',
      'agendas visuales',
      'instrucciones claras y literales',
      'respetar intereses especiales',
      'reducir estímulos sensoriales',
      'rutinas predecibles',
      'espacios de regulación',
      'comunicación aumentativa si es necesario',
    ],
  },
  {
    id: 'hipoacusia',
    label: 'Hipoacusia / Sordera',
    icon: '👂',
    descripcion:
      'Pérdida parcial o total de la audición. Puede comunicarse con lengua de señas, lectura labial o audífonos/implante coclear. Necesita apoyos visuales y buena iluminación.',
    estrategias_clave: [
      'Lengua de Señas Argentina (LSA)',
      'apoyos visuales y escritos',
      'ubicación preferencial',
      'hablar de frente al alumno',
      'buena iluminación',
      'intérprete de LSA',
      'subtítulos en videos',
      'evitar hablar de espaldas',
    ],
  },
  {
    id: 'visual',
    label: 'Discapacidad Visual / Baja Visión / Ceguera',
    icon: '👁️',
    descripcion:
      'Pérdida parcial (baja visión) o total (ceguera) de la visión. Necesita materiales en formatos accesibles: braille, macrotipo, audio, relieve.',
    estrategias_clave: [
      'materiales en braille o macrotipo',
      'descripción verbal de imágenes',
      'textos en formato accesible',
      'material en relieve y tactil',
      'tecnología asistiva (lector de pantalla)',
      'buena iluminación y contraste',
      'ubicación preferencial',
      'audiodescripción',
    ],
  },
  {
    id: 'motriz',
    label: 'Discapacidad Motriz',
    icon: '♿',
    descripcion:
      'Limitaciones en la movilidad o el control motor fino/grueso. Puede afectar escritura, desplazamiento o manipulación de objetos. Requiere adaptación de espacios y materiales.',
    estrategias_clave: [
      'adaptar mobiliario y espacios',
      'tecnología asistiva para escritura',
      'tiempos extendidos',
      'evaluación oral si hay dificultad motriz fina',
      'accesibilidad física del aula',
      'materiales manipulables adaptados',
      'asistente si es necesario',
    ],
  },
  {
    id: 'lenguaje',
    label: 'Trastornos del Lenguaje',
    icon: '💬',
    descripcion:
      'Dificultades en la comprensión o producción del lenguaje oral. Incluye trastornos fonológicos, expresivos, mixtos. Puede requerir comunicación aumentativa alternativa (CAA).',
    estrategias_clave: [
      'comunicación aumentativa alternativa',
      'dar tiempo para responder',
      'no completar frases por el alumno',
      'apoyos visuales',
      'instrucciones simples y cortas',
      'modelar el lenguaje correcto',
      'evitar presión social para hablar',
    ],
  },
  {
    id: 'dislexia',
    label: 'Dislexia',
    icon: '📖',
    descripcion:
      'Dificultad específica en la lectura que afecta decodificación, fluidez y comprensión lectora. No se relaciona con inteligencia. Requiere adaptaciones en la presentación de textos.',
    estrategias_clave: [
      'tipografía grande y clara (sans-serif)',
      'textos con interlineado amplio',
      'no pedir lectura en voz alta sin aviso',
      'evaluación oral como alternativa',
      'marcar palabras clave',
      'usar color para organizar información',
      'tiempos extendidos para lectura',
      'audiolibros como apoyo',
    ],
  },
  {
    id: 'tdah',
    label: 'TDAH (Trastorno por Déficit de Atención e Hiperactividad)',
    icon: '⚡',
    descripcion:
      'Dificultades en atención sostenida, control de impulsos y/o hiperactividad. Necesita estructura, actividades cortas variadas y estrategias de autorregulación.',
    estrategias_clave: [
      'actividades cortas y variadas',
      'descansos frecuentes',
      'ubicación cerca del docente',
      'instrucciones paso a paso',
      'refuerzo positivo inmediato',
      'permitir movimiento controlado',
      'usar temporizadores visuales',
      'reducir distracciones del entorno',
    ],
  },
  {
    id: 'discalculia',
    label: 'Discalculia',
    icon: '🔢',
    descripcion:
      'Dificultad específica en el aprendizaje de las matemáticas: cálculo, sentido numérico, resolución de problemas. No se relaciona con inteligencia.',
    estrategias_clave: [
      'material concreto y manipulable',
      'representaciones visuales de cantidades',
      'permitir uso de calculadora',
      'tablas de multiplicar como apoyo',
      'problemas con contexto real',
      'pasos explícitos en procedimientos',
      'no penalizar errores de cálculo en otras materias',
    ],
  },
  {
    id: 'disgrafia',
    label: 'Disgrafía',
    icon: '✏️',
    descripcion:
      'Dificultad en la escritura: trazado, organización del espacio gráfico, ortografía. Puede afectar la legibilidad y la velocidad de escritura.',
    estrategias_clave: [
      'permitir uso de computadora/tablet',
      'no evaluar caligrafía',
      'hojas con renglones amplios',
      'tiempos extendidos para escritura',
      'evaluación oral como alternativa',
      'reducir cantidad de copia',
      'proporcionar apuntes impresos',
    ],
  },
  {
    id: 'emocional_conductual',
    label: 'Trastorno Emocional / Conductual',
    icon: '💛',
    descripcion:
      'Dificultades en la regulación emocional y/o conductual que afectan el aprendizaje y la convivencia. Incluye ansiedad, depresión, conductas desafiantes.',
    estrategias_clave: [
      'vínculo de confianza con el docente',
      'normas claras y consistentes',
      'espacio de regulación emocional',
      'refuerzo positivo',
      'anticipar situaciones estresantes',
      'trabajo con familia',
      'flexibilidad ante crisis',
      'no exponer ante el grupo',
    ],
  },
  {
    id: 'multidiscapacidad',
    label: 'Multidiscapacidad',
    icon: '🤝',
    descripcion:
      'Combinación de dos o más discapacidades que interactúan entre sí generando necesidades complejas. Requiere abordaje interdisciplinario y planificación altamente individualizada.',
    estrategias_clave: [
      'planificación personalizada',
      'equipo interdisciplinario',
      'comunicación aumentativa alternativa',
      'objetivos funcionales',
      'materiales multisensoriales',
      'evaluación individual por proceso',
      'coordinación con terapeutas',
      'priorizar autonomía y participación',
    ],
  },
  {
    id: 'otra',
    label: 'Otra (especificar)',
    icon: '📋',
    descripcion:
      'Otra condición no listada. Se pedirá especificar para generar una guía lo más precisa posible.',
    estrategias_clave: [
      'evaluar barreras específicas',
      'consultar con equipo de apoyo',
      'adaptar según necesidad identificada',
    ],
  },
]

// Helper: obtener discapacidad por ID
export function getDiscapacidadById(id: string): Discapacidad | undefined {
  return DISCAPACIDADES.find(d => d.id === id)
}

// Helper: obtener múltiples discapacidades por IDs
export function getDiscapacidadesByIds(ids: string[]): Discapacidad[] {
  return ids.map(id => DISCAPACIDADES.find(d => d.id === id)).filter(Boolean) as Discapacidad[]
}

// Helper: obtener estrategias combinadas para múltiples discapacidades
export function getEstrategiasCombinadas(ids: string[]): string[] {
  const discapacidades = getDiscapacidadesByIds(ids)
  const todas = discapacidades.flatMap(d => d.estrategias_clave)
  return [...new Set(todas)] // eliminar duplicados
}

# DATOS-MAESTROS.md — IncluIA
## Archivos de datos del sistema educativo argentino
## Claude Code: copiar estos archivos TEXTUALMENTE a /data/ y /lib/

---

## INSTRUCCIÓN PARA CLAUDE CODE

Los siguientes bloques de código son archivos completos y probados. Copialos tal cual a las rutas indicadas. NO los modifiques, NO les agregues nada, NO les saques nada. Están basados en el sistema educativo argentino vigente (Ley 26.206) y fueron validados.

---

## Archivo: `lib/types.ts`

```typescript
// ============================================
// IncluIA — Tipos TypeScript principales
// ============================================

// --- Niveles y Modalidades ---

export type NivelEducativo = {
  id: string
  label: string
  modalidad?: string
  subniveles?: {
    id: string
    label: string
    anios: string[]
  }[]
}

// --- Materias ---

export type MateriasPorNivel = {
  [nivelId: string]: string[]
}

// --- Discapacidades ---

export type Discapacidad = {
  id: string
  label: string
  icon: string
  descripcion: string
  estrategias_clave: string[]
}

// --- Formulario ---

export type FormStep = 1 | 2 | 3

export type SituacionApoyo =
  | 'maestra_integradora'
  | 'acompanante_terapeutico'
  | 'sin_apoyo'
  | 'en_diagnostico'
  | 'otro'

export type FormularioConsulta = {
  // Paso 1: Contexto docente
  nivel_id: string
  subnivel_id?: string
  anio_grado: string
  materia: string
  contenido: string

  // Paso 2: Discapacidad/es
  discapacidades: string[]
  discapacidad_otra?: string
  cantidad_alumnos: number
  situacion_apoyo: SituacionApoyo
  situacion_apoyo_otra?: string

  // Paso 3: Contexto adicional
  contexto_aula?: string
  objetivo_clase?: string
}

// --- Usuario / Perfil ---

export type RolUsuario = 'docente' | 'admin'

export type PlanUsuario = 'free' | 'pro' | 'institucional'

export type Perfil = {
  id: string
  nombre: string
  apellido: string
  email: string
  nivel_educativo?: string
  institucion?: string
  localidad?: string
  provincia?: string
  rol: RolUsuario
  plan: PlanUsuario
  plan_activo_hasta?: string
  consultas_mes: number
  created_at: string
}

// --- Consultas ---

export type Consulta = {
  id: string
  user_id: string
  nivel: string
  anio_grado?: string
  materia: string
  contenido: string
  discapacidades: string[]
  cantidad_alumnos: number
  situacion_apoyo: SituacionApoyo
  contexto_aula?: string
  objetivo_clase?: string
  respuesta_ia: string
  tokens_usados?: number
  feedback_estrellas?: number
  created_at: string
}

// --- Guías guardadas ---

export type GuiaGuardada = {
  id: string
  consulta_id: string
  user_id: string
  titulo: string
  es_favorita: boolean
  created_at: string
  consulta?: Consulta
}

// --- Límites por plan ---

export const LIMITES_PLAN: Record<PlanUsuario, {
  guias_por_mes: number
  historial: boolean
  exportar_pdf: boolean
  precio_ars: number
}> = {
  free: {
    guias_por_mes: 2,
    historial: false,
    exportar_pdf: false,
    precio_ars: 0,
  },
  pro: {
    guias_por_mes: 40,
    historial: true,
    exportar_pdf: true,
    precio_ars: 9900,
  },
  institucional: {
    guias_por_mes: 999,
    historial: true,
    exportar_pdf: true,
    precio_ars: 29900,
  },
}

// --- API Types ---

export type GenerarGuiaRequest = FormularioConsulta

export type GenerarGuiaResponse = {
  success: boolean
  error?: string
  consulta_id?: string
}

export type FeedbackRequest = {
  consulta_id: string
  estrellas: number
}

// --- Provincias argentinas ---

export const PROVINCIAS_ARGENTINA = [
  'Buenos Aires',
  'CABA',
  'Catamarca',
  'Chaco',
  'Chubut',
  'Córdoba',
  'Corrientes',
  'Entre Ríos',
  'Formosa',
  'Jujuy',
  'La Pampa',
  'La Rioja',
  'Mendoza',
  'Misiones',
  'Neuquén',
  'Río Negro',
  'Salta',
  'San Juan',
  'San Luis',
  'Santa Cruz',
  'Santa Fe',
  'Santiago del Estero',
  'Tierra del Fuego',
  'Tucumán',
] as const
```

---

## Archivo: `data/niveles.ts`

```typescript
// ============================================
// IncluIA — Niveles y Modalidades del Sistema Educativo Argentino
// Ley de Educación Nacional N° 26.206
// ============================================

import { NivelEducativo } from '@/lib/types'

export const NIVELES: NivelEducativo[] = [
  {
    id: 'inicial',
    label: 'Nivel Inicial',
    subniveles: [
      { id: 'jardin_maternal', label: 'Jardín Maternal', anios: ['Sala de 45 días a 1 año', 'Sala de 1 año', 'Sala de 2 años'] },
      { id: 'jardin_infantes', label: 'Jardín de Infantes', anios: ['Sala de 3 años', 'Sala de 4 años', 'Sala de 5 años'] },
    ],
  },
  {
    id: 'primario',
    label: 'Nivel Primario',
    subniveles: [
      { id: 'primer_ciclo', label: '1er Ciclo', anios: ['1° grado', '2° grado', '3° grado'] },
      { id: 'segundo_ciclo', label: '2do Ciclo', anios: ['4° grado', '5° grado', '6° grado'] },
    ],
  },
  {
    id: 'secundario',
    label: 'Nivel Secundario',
    subniveles: [
      { id: 'ciclo_basico', label: 'Ciclo Básico', anios: ['1° año', '2° año', '3° año'] },
      { id: 'ciclo_orientado', label: 'Ciclo Orientado', anios: ['4° año', '5° año', '6° año'] },
    ],
  },
  {
    id: 'superior',
    label: 'Educación Superior Terciaria',
    subniveles: [
      { id: 'superior_general', label: 'General', anios: ['1° año', '2° año', '3° año', '4° año'] },
    ],
  },
  {
    id: 'especial',
    label: 'Educación Especial',
    modalidad: 'especial',
    subniveles: [
      { id: 'especial_inicial', label: 'Nivel Inicial Especial', anios: ['Estimulación temprana', 'Sala de 3', 'Sala de 4', 'Sala de 5'] },
      { id: 'especial_primario', label: 'Nivel Primario Especial', anios: ['1° ciclo', '2° ciclo', '3° ciclo'] },
      { id: 'especial_formacion_laboral', label: 'Formación Laboral', anios: ['Taller 1', 'Taller 2', 'Taller 3'] },
    ],
  },
  {
    id: 'epja',
    label: 'Jóvenes y Adultos (EPJA)',
    modalidad: 'epja',
    subniveles: [
      { id: 'epja_primario', label: 'Primario Adultos', anios: ['1° ciclo', '2° ciclo', '3° ciclo'] },
      { id: 'epja_secundario', label: 'Secundario Adultos', anios: ['1° año', '2° año', '3° año'] },
    ],
  },
  {
    id: 'tecnica',
    label: 'Técnico Profesional (ETP)',
    modalidad: 'tecnica',
    subniveles: [
      { id: 'tecnica_ciclo_basico', label: 'Ciclo Básico Técnico', anios: ['1° año', '2° año', '3° año'] },
      { id: 'tecnica_ciclo_superior', label: 'Ciclo Superior Técnico', anios: ['4° año', '5° año', '6° año', '7° año'] },
    ],
  },
  {
    id: 'rural',
    label: 'Educación Rural',
    modalidad: 'rural',
    subniveles: [
      { id: 'rural_plurigrado', label: 'Plurigrado', anios: ['Grupo 1 (1°-2°-3°)', 'Grupo 2 (4°-5°-6°)'] },
      { id: 'rural_secundario', label: 'Secundario Rural', anios: ['1° año', '2° año', '3° año', '4° año', '5° año'] },
    ],
  },
  {
    id: 'artistica',
    label: 'Educación Artística',
    modalidad: 'artistica',
    subniveles: [
      { id: 'artistica_general', label: 'General', anios: ['1° año', '2° año', '3° año', '4° año'] },
    ],
  },
  {
    id: 'intercultural',
    label: 'Educación Intercultural Bilingüe',
    modalidad: 'intercultural',
    subniveles: [
      { id: 'intercultural_primario', label: 'Primario', anios: ['1° grado', '2° grado', '3° grado', '4° grado', '5° grado', '6° grado'] },
      { id: 'intercultural_secundario', label: 'Secundario', anios: ['1° año', '2° año', '3° año', '4° año', '5° año'] },
    ],
  },
  {
    id: 'domiciliaria',
    label: 'Educación Domiciliaria y Hospitalaria',
    modalidad: 'domiciliaria',
    subniveles: [
      { id: 'domiciliaria_general', label: 'General', anios: ['Según nivel del alumno'] },
    ],
  },
  {
    id: 'contexto_encierro',
    label: 'Educación en Contextos de Privación de Libertad',
    modalidad: 'contexto_encierro',
    subniveles: [
      { id: 'encierro_primario', label: 'Primario', anios: ['1° ciclo', '2° ciclo'] },
      { id: 'encierro_secundario', label: 'Secundario', anios: ['1° año', '2° año', '3° año'] },
    ],
  },
]

export function getNivelById(id: string): NivelEducativo | undefined {
  return NIVELES.find(n => n.id === id)
}

export function getAniosDisponibles(nivelId: string, subnivelId?: string): string[] {
  const nivel = getNivelById(nivelId)
  if (!nivel?.subniveles) return []
  if (subnivelId) {
    const sub = nivel.subniveles.find(s => s.id === subnivelId)
    return sub?.anios || []
  }
  return nivel.subniveles.flatMap(s => s.anios)
}
```

---

## Archivo: `data/materias.ts`

```typescript
// ============================================
// IncluIA — Materias por Nivel Educativo
// ============================================

import { MateriasPorNivel } from '@/lib/types'

export const MATERIAS: MateriasPorNivel = {
  inicial: [
    'Prácticas del Lenguaje', 'Matemática', 'Indagación del Ambiente Natural y Social',
    'Educación Física', 'Educación Artística - Plástica', 'Educación Artística - Música',
    'Educación Artística - Expresión Corporal', 'Formación Personal y Social', 'Juego',
  ],
  primario: [
    'Lengua y Literatura', 'Matemática', 'Ciencias Naturales', 'Ciencias Sociales',
    'Educación Física', 'Educación Artística - Plástica', 'Educación Artística - Música',
    'Educación Tecnológica', 'Formación Ética y Ciudadana', 'Lengua Extranjera - Inglés',
  ],
  secundario: [
    'Lengua y Literatura', 'Matemática', 'Biología', 'Física', 'Química', 'Historia',
    'Geografía', 'Educación Física', 'Educación Artística', 'Educación Tecnológica',
    'Formación Ética y Ciudadana', 'Lengua Extranjera - Inglés', 'Filosofía', 'Psicología',
    'Economía', 'Informática / TIC', 'Comunicación', 'Sociología', 'Derecho',
    'Agro y Ambiente', 'Turismo',
  ],
  superior: [
    'Pedagogía', 'Didáctica General', 'Didáctica Específica', 'Psicología Educacional',
    'Práctica Docente', 'Investigación Educativa', 'Filosofía de la Educación',
    'Sociología de la Educación', 'TIC en Educación', 'Sujetos de la Educación', 'Otra (especificar)',
  ],
  especial: [
    'Área Comunicacional / Lengua', 'Área Matemática', 'Área de Ciencias Naturales',
    'Área de Ciencias Sociales', 'Área Práctica-Laboral / Pre-taller', 'Área de Autonomía Personal',
    'Área Artística', 'Área de Educación Física', 'Estimulación Temprana',
    'Habilidades Sociales', 'Comunicación Aumentativa y Alternativa',
  ],
  epja: [
    'Lengua', 'Matemática', 'Ciencias Naturales', 'Ciencias Sociales',
    'Formación para el Trabajo', 'Educación Tecnológica', 'Alfabetización', 'Proyecto de vida y ciudadanía',
  ],
  tecnica: [
    'Lengua y Literatura', 'Matemática', 'Física', 'Química', 'Biología', 'Historia',
    'Geografía', 'Educación Física', 'Inglés Técnico', 'Dibujo Técnico',
    'Taller / Práctica de Taller', 'Tecnología de los Materiales', 'Electrotecnia',
    'Informática / Programación', 'Proyecto Tecnológico', 'Seguridad e Higiene',
    'Organización Industrial', 'Emprendedurismo',
  ],
  rural: [
    'Lengua y Literatura', 'Matemática', 'Ciencias Naturales', 'Ciencias Sociales',
    'Educación Física', 'Educación Artística', 'Educación Tecnológica',
    'Formación Ética y Ciudadana', 'Agro y Ambiente', 'Plurigrado (áreas integradas)',
  ],
  artistica: [
    'Música', 'Artes Visuales / Plástica', 'Teatro', 'Danza',
    'Artes Audiovisuales', 'Diseño', 'Lenguajes Artísticos Combinados', 'Historia del Arte',
  ],
  intercultural: [
    'Lengua y Literatura', 'Lengua Originaria', 'Matemática', 'Ciencias Naturales',
    'Ciencias Sociales', 'Cosmovisión y Cultura', 'Educación Física', 'Educación Artística',
  ],
  domiciliaria: [
    'Lengua y Literatura', 'Matemática', 'Ciencias Naturales', 'Ciencias Sociales',
    'Área según nivel del alumno', 'Apoyo pedagógico general',
  ],
  contexto_encierro: [
    'Lengua y Literatura', 'Matemática', 'Ciencias Naturales', 'Ciencias Sociales',
    'Formación para el Trabajo', 'Educación Física', 'Educación Artística', 'Proyecto de vida',
  ],
}

export function getMateriasPorNivel(nivelId: string): string[] {
  return MATERIAS[nivelId] || []
}
```

---

## Archivo: `data/discapacidades.ts`

```typescript
// ============================================
// IncluIA — Catálogo de Discapacidades
// ============================================

import { Discapacidad } from '@/lib/types'

export const DISCAPACIDADES: Discapacidad[] = [
  {
    id: 'intelectual',
    label: 'Discapacidad Intelectual',
    icon: '🧠',
    descripcion: 'Limitaciones significativas en el funcionamiento intelectual y en la conducta adaptativa. Requiere simplificación de consignas, tiempos extendidos y apoyos concretos.',
    estrategias_clave: ['simplificar consignas', 'usar material concreto', 'fragmentar tareas', 'repetición y rutinas', 'apoyos visuales', 'tiempos extendidos', 'evaluación por proceso'],
  },
  {
    id: 'tea',
    label: 'Trastorno del Espectro Autista (TEA)',
    icon: '🧩',
    descripcion: 'Dificultades en la comunicación social, interacción y patrones de conducta restringidos o repetitivos. Necesita anticipación, estructura y respeto por sus intereses.',
    estrategias_clave: ['anticipar cambios', 'agendas visuales', 'instrucciones claras y literales', 'respetar intereses especiales', 'reducir estímulos sensoriales', 'rutinas predecibles', 'espacios de regulación', 'comunicación aumentativa si es necesario'],
  },
  {
    id: 'hipoacusia',
    label: 'Hipoacusia / Sordera',
    icon: '👂',
    descripcion: 'Pérdida parcial o total de la audición. Puede comunicarse con lengua de señas, lectura labial o audífonos/implante coclear.',
    estrategias_clave: ['Lengua de Señas Argentina (LSA)', 'apoyos visuales y escritos', 'ubicación preferencial', 'hablar de frente al alumno', 'buena iluminación', 'intérprete de LSA', 'subtítulos en videos', 'evitar hablar de espaldas'],
  },
  {
    id: 'visual',
    label: 'Discapacidad Visual / Baja Visión / Ceguera',
    icon: '👁️',
    descripcion: 'Pérdida parcial (baja visión) o total (ceguera) de la visión. Necesita materiales en formatos accesibles.',
    estrategias_clave: ['materiales en braille o macrotipo', 'descripción verbal de imágenes', 'textos en formato accesible', 'material en relieve y tactil', 'tecnología asistiva (lector de pantalla)', 'buena iluminación y contraste', 'ubicación preferencial', 'audiodescripción'],
  },
  {
    id: 'motriz',
    label: 'Discapacidad Motriz',
    icon: '♿',
    descripcion: 'Limitaciones en la movilidad o el control motor fino/grueso. Puede afectar escritura, desplazamiento o manipulación de objetos.',
    estrategias_clave: ['adaptar mobiliario y espacios', 'tecnología asistiva para escritura', 'tiempos extendidos', 'evaluación oral si hay dificultad motriz fina', 'accesibilidad física del aula', 'materiales manipulables adaptados', 'asistente si es necesario'],
  },
  {
    id: 'lenguaje',
    label: 'Trastornos del Lenguaje',
    icon: '💬',
    descripcion: 'Dificultades en la comprensión o producción del lenguaje oral. Incluye trastornos fonológicos, expresivos, mixtos.',
    estrategias_clave: ['comunicación aumentativa alternativa', 'dar tiempo para responder', 'no completar frases por el alumno', 'apoyos visuales', 'instrucciones simples y cortas', 'modelar el lenguaje correcto', 'evitar presión social para hablar'],
  },
  {
    id: 'dislexia',
    label: 'Dislexia',
    icon: '📖',
    descripcion: 'Dificultad específica en la lectura que afecta decodificación, fluidez y comprensión lectora. No se relaciona con inteligencia.',
    estrategias_clave: ['tipografía grande y clara (sans-serif)', 'textos con interlineado amplio', 'no pedir lectura en voz alta sin aviso', 'evaluación oral como alternativa', 'marcar palabras clave', 'usar color para organizar información', 'tiempos extendidos para lectura', 'audiolibros como apoyo'],
  },
  {
    id: 'tdah',
    label: 'TDAH',
    icon: '⚡',
    descripcion: 'Dificultades en atención sostenida, control de impulsos y/o hiperactividad.',
    estrategias_clave: ['actividades cortas y variadas', 'descansos frecuentes', 'ubicación cerca del docente', 'instrucciones paso a paso', 'refuerzo positivo inmediato', 'permitir movimiento controlado', 'usar temporizadores visuales', 'reducir distracciones del entorno'],
  },
  {
    id: 'discalculia',
    label: 'Discalculia',
    icon: '🔢',
    descripcion: 'Dificultad específica en el aprendizaje de las matemáticas.',
    estrategias_clave: ['material concreto y manipulable', 'representaciones visuales de cantidades', 'permitir uso de calculadora', 'tablas de multiplicar como apoyo', 'problemas con contexto real', 'pasos explícitos en procedimientos', 'no penalizar errores de cálculo en otras materias'],
  },
  {
    id: 'disgrafia',
    label: 'Disgrafía',
    icon: '✏️',
    descripcion: 'Dificultad en la escritura: trazado, organización del espacio gráfico, ortografía.',
    estrategias_clave: ['permitir uso de computadora/tablet', 'no evaluar caligrafía', 'hojas con renglones amplios', 'tiempos extendidos para escritura', 'evaluación oral como alternativa', 'reducir cantidad de copia', 'proporcionar apuntes impresos'],
  },
  {
    id: 'emocional_conductual',
    label: 'Trastorno Emocional / Conductual',
    icon: '💛',
    descripcion: 'Dificultades en la regulación emocional y/o conductual que afectan el aprendizaje y la convivencia.',
    estrategias_clave: ['vínculo de confianza con el docente', 'normas claras y consistentes', 'espacio de regulación emocional', 'refuerzo positivo', 'anticipar situaciones estresantes', 'trabajo con familia', 'flexibilidad ante crisis', 'no exponer ante el grupo'],
  },
  {
    id: 'multidiscapacidad',
    label: 'Multidiscapacidad',
    icon: '🤝',
    descripcion: 'Combinación de dos o más discapacidades que interactúan entre sí generando necesidades complejas.',
    estrategias_clave: ['planificación personalizada', 'equipo interdisciplinario', 'comunicación aumentativa alternativa', 'objetivos funcionales', 'materiales multisensoriales', 'evaluación individual por proceso', 'coordinación con terapeutas', 'priorizar autonomía y participación'],
  },
  {
    id: 'otra',
    label: 'Otra (especificar)',
    icon: '📋',
    descripcion: 'Otra condición no listada. Se pedirá especificar para generar una guía lo más precisa posible.',
    estrategias_clave: ['evaluar barreras específicas', 'consultar con equipo de apoyo', 'adaptar según necesidad identificada'],
  },
]

export function getDiscapacidadById(id: string): Discapacidad | undefined {
  return DISCAPACIDADES.find(d => d.id === id)
}

export function getDiscapacidadesByIds(ids: string[]): Discapacidad[] {
  return ids.map(id => DISCAPACIDADES.find(d => d.id === id)).filter(Boolean) as Discapacidad[]
}

export function getEstrategiasCombinadas(ids: string[]): string[] {
  const discapacidades = getDiscapacidadesByIds(ids)
  const todas = discapacidades.flatMap(d => d.estrategias_clave)
  return [...new Set(todas)]
}
```

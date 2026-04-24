// ============================================
// IncluAI — Niveles y Modalidades del Sistema Educativo Argentino
// Basado en la Ley de Educación Nacional N° 26.206
// ============================================

import { NivelEducativo } from '@/lib/types'

export const NIVELES: NivelEducativo[] = [
  {
    id: 'inicial',
    label: 'Nivel Inicial',
    subniveles: [
      {
        id: 'jardin_maternal',
        label: 'Jardín Maternal',
        anios: ['Sala de 45 días a 1 año', 'Sala de 1 año', 'Sala de 2 años'],
      },
      {
        id: 'jardin_infantes',
        label: 'Jardín de Infantes',
        anios: ['Sala de 3 años', 'Sala de 4 años', 'Sala de 5 años'],
      },
    ],
  },
  {
    id: 'primario',
    label: 'Nivel Primario',
    subniveles: [
      {
        id: 'primer_ciclo',
        label: '1er Ciclo',
        anios: ['1° grado', '2° grado', '3° grado'],
      },
      {
        id: 'segundo_ciclo',
        label: '2do Ciclo',
        anios: ['4° grado', '5° grado', '6° grado'],
      },
    ],
  },
  {
    id: 'secundario',
    label: 'Nivel Secundario',
    subniveles: [
      {
        id: 'ciclo_basico',
        label: 'Ciclo Básico',
        anios: ['1° año', '2° año', '3° año'],
      },
      {
        id: 'ciclo_orientado',
        label: 'Ciclo Orientado',
        anios: ['4° año', '5° año', '6° año'],
      },
    ],
  },
  {
    id: 'superior',
    label: 'Educación Superior Terciaria',
    subniveles: [
      {
        id: 'superior_general',
        label: 'General',
        anios: ['1° año', '2° año', '3° año', '4° año'],
      },
    ],
  },
  {
    id: 'especial',
    label: 'Educación Especial',
    modalidad: 'especial',
    subniveles: [
      {
        id: 'especial_inicial',
        label: 'Nivel Inicial Especial',
        anios: ['Estimulación temprana', 'Sala de 3', 'Sala de 4', 'Sala de 5'],
      },
      {
        id: 'especial_primario',
        label: 'Nivel Primario Especial',
        anios: ['1° ciclo', '2° ciclo', '3° ciclo'],
      },
      {
        id: 'especial_formacion_laboral',
        label: 'Formación Laboral',
        anios: ['Taller 1', 'Taller 2', 'Taller 3'],
      },
    ],
  },
  {
    id: 'epja',
    label: 'Educación de Jóvenes y Adultos (EPJA)',
    modalidad: 'epja',
    subniveles: [
      {
        id: 'epja_primario',
        label: 'Primario Adultos',
        anios: ['1° ciclo', '2° ciclo', '3° ciclo'],
      },
      {
        id: 'epja_secundario',
        label: 'Secundario Adultos',
        anios: ['1° año', '2° año', '3° año'],
      },
    ],
  },
  {
    id: 'tecnica',
    label: 'Educación Técnico Profesional (ETP)',
    modalidad: 'tecnica',
    subniveles: [
      {
        id: 'tecnica_ciclo_basico',
        label: 'Ciclo Básico Técnico',
        anios: ['1° año', '2° año', '3° año'],
      },
      {
        id: 'tecnica_ciclo_superior',
        label: 'Ciclo Superior Técnico',
        anios: ['4° año', '5° año', '6° año', '7° año'],
      },
    ],
  },
  {
    id: 'rural',
    label: 'Educación Rural',
    modalidad: 'rural',
    subniveles: [
      {
        id: 'rural_plurigrado',
        label: 'Plurigrado',
        anios: ['Grupo 1 (1°-2°-3°)', 'Grupo 2 (4°-5°-6°)'],
      },
      {
        id: 'rural_secundario',
        label: 'Secundario Rural',
        anios: ['1° año', '2° año', '3° año', '4° año', '5° año'],
      },
    ],
  },
  {
    id: 'artistica',
    label: 'Educación Artística',
    modalidad: 'artistica',
    subniveles: [
      {
        id: 'artistica_general',
        label: 'General',
        anios: ['1° año', '2° año', '3° año', '4° año'],
      },
    ],
  },
  {
    id: 'intercultural',
    label: 'Educación Intercultural Bilingüe',
    modalidad: 'intercultural',
    subniveles: [
      {
        id: 'intercultural_primario',
        label: 'Primario',
        anios: ['1° grado', '2° grado', '3° grado', '4° grado', '5° grado', '6° grado'],
      },
      {
        id: 'intercultural_secundario',
        label: 'Secundario',
        anios: ['1° año', '2° año', '3° año', '4° año', '5° año'],
      },
    ],
  },
  {
    id: 'domiciliaria',
    label: 'Educación Domiciliaria y Hospitalaria',
    modalidad: 'domiciliaria',
    subniveles: [
      {
        id: 'domiciliaria_general',
        label: 'General',
        anios: ['Según nivel del alumno'],
      },
    ],
  },
  {
    id: 'contexto_encierro',
    label: 'Educación en Contextos de Privación de Libertad',
    modalidad: 'contexto_encierro',
    subniveles: [
      {
        id: 'encierro_primario',
        label: 'Primario',
        anios: ['1° ciclo', '2° ciclo'],
      },
      {
        id: 'encierro_secundario',
        label: 'Secundario',
        anios: ['1° año', '2° año', '3° año'],
      },
    ],
  },
]

// Helper: obtener un nivel por ID
export function getNivelById(id: string): NivelEducativo | undefined {
  return NIVELES.find(n => n.id === id)
}

// Helper: obtener años disponibles para un nivel + subnivel
export function getAniosDisponibles(nivelId: string, subnivelId?: string): string[] {
  const nivel = getNivelById(nivelId)
  if (!nivel?.subniveles) return []

  if (subnivelId) {
    const sub = nivel.subniveles.find(s => s.id === subnivelId)
    return sub?.anios || []
  }

  return nivel.subniveles.flatMap(s => s.anios)
}

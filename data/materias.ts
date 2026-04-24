// ============================================
// IncluAI — Materias por Nivel Educativo
// Sistema Educativo Argentino
// ============================================

import { MateriasPorNivel } from '@/lib/types'

export const MATERIAS: MateriasPorNivel = {
  // --- Nivel Inicial ---
  inicial: [
    'Prácticas del Lenguaje',
    'Matemática',
    'Indagación del Ambiente Natural y Social',
    'Educación Física',
    'Educación Artística - Plástica',
    'Educación Artística - Música',
    'Educación Artística - Expresión Corporal',
    'Formación Personal y Social',
    'Juego',
  ],

  // --- Nivel Primario ---
  primario: [
    'Lengua y Literatura',
    'Matemática',
    'Ciencias Naturales',
    'Ciencias Sociales',
    'Educación Física',
    'Educación Artística - Plástica',
    'Educación Artística - Música',
    'Educación Tecnológica',
    'Formación Ética y Ciudadana',
    'Lengua Extranjera - Inglés',
  ],

  // --- Nivel Secundario - Ciclo Básico ---
  secundario: [
    'Lengua y Literatura',
    'Matemática',
    'Biología',
    'Física',
    'Química',
    'Historia',
    'Geografía',
    'Educación Física',
    'Educación Artística',
    'Educación Tecnológica',
    'Formación Ética y Ciudadana',
    'Lengua Extranjera - Inglés',
    'Filosofía',
    'Psicología',
    'Economía',
    'Informática / TIC',
    'Comunicación',
    'Sociología',
    'Derecho',
    'Agro y Ambiente',
    'Turismo',
  ],

  // --- Educación Superior Terciaria ---
  superior: [
    'Pedagogía',
    'Didáctica General',
    'Didáctica Específica',
    'Psicología Educacional',
    'Práctica Docente',
    'Investigación Educativa',
    'Filosofía de la Educación',
    'Sociología de la Educación',
    'TIC en Educación',
    'Sujetos de la Educación',
    'Otra (especificar)',
  ],

  // --- Educación Especial ---
  especial: [
    'Área Comunicacional / Lengua',
    'Área Matemática',
    'Área de Ciencias Naturales',
    'Área de Ciencias Sociales',
    'Área Práctica-Laboral / Pre-taller',
    'Área de Autonomía Personal',
    'Área Artística',
    'Área de Educación Física',
    'Estimulación Temprana',
    'Habilidades Sociales',
    'Comunicación Aumentativa y Alternativa',
  ],

  // --- EPJA ---
  epja: [
    'Lengua',
    'Matemática',
    'Ciencias Naturales',
    'Ciencias Sociales',
    'Formación para el Trabajo',
    'Educación Tecnológica',
    'Alfabetización',
    'Proyecto de vida y ciudadanía',
  ],

  // --- Educación Técnico Profesional ---
  tecnica: [
    'Lengua y Literatura',
    'Matemática',
    'Física',
    'Química',
    'Biología',
    'Historia',
    'Geografía',
    'Educación Física',
    'Inglés Técnico',
    'Dibujo Técnico',
    'Taller / Práctica de Taller',
    'Tecnología de los Materiales',
    'Electrotecnia',
    'Informática / Programación',
    'Proyecto Tecnológico',
    'Seguridad e Higiene',
    'Organización Industrial',
    'Emprendedurismo',
  ],

  // --- Educación Rural ---
  rural: [
    'Lengua y Literatura',
    'Matemática',
    'Ciencias Naturales',
    'Ciencias Sociales',
    'Educación Física',
    'Educación Artística',
    'Educación Tecnológica',
    'Formación Ética y Ciudadana',
    'Agro y Ambiente',
    'Plurigrado (áreas integradas)',
  ],

  // --- Educación Artística ---
  artistica: [
    'Música',
    'Artes Visuales / Plástica',
    'Teatro',
    'Danza',
    'Artes Audiovisuales',
    'Diseño',
    'Lenguajes Artísticos Combinados',
    'Historia del Arte',
  ],

  // --- Educación Intercultural Bilingüe ---
  intercultural: [
    'Lengua y Literatura',
    'Lengua Originaria',
    'Matemática',
    'Ciencias Naturales',
    'Ciencias Sociales',
    'Cosmovisión y Cultura',
    'Educación Física',
    'Educación Artística',
  ],

  // --- Domiciliaria y Hospitalaria ---
  domiciliaria: [
    'Lengua y Literatura',
    'Matemática',
    'Ciencias Naturales',
    'Ciencias Sociales',
    'Área según nivel del alumno',
    'Apoyo pedagógico general',
  ],

  // --- Contextos de Privación de Libertad ---
  contexto_encierro: [
    'Lengua y Literatura',
    'Matemática',
    'Ciencias Naturales',
    'Ciencias Sociales',
    'Formación para el Trabajo',
    'Educación Física',
    'Educación Artística',
    'Proyecto de vida',
  ],
}

// Helper: obtener materias por nivel ID
export function getMateriasPorNivel(nivelId: string): string[] {
  return MATERIAS[nivelId] || []
}

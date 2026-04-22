// ============================================
// IncluIA — Jurisdicciones argentinas + normativa provincial PPI
// Fuente: Res. CFE 311/16 (nacional) + reglamentos provinciales.
// ============================================

export interface JurisdiccionPPI {
  id: string
  nombre: string
  /** Nombre con el que la jurisdicción se refiere al PPI. */
  alias_ppi: string
  /** Norma provincial específica (si existe), citable al pie del documento. */
  norma_provincial?: string
  /** Vínculo oficial si se conoce. */
  norma_url?: string
}

export const JURISDICCIONES_PPI: JurisdiccionPPI[] = [
  {
    id: 'caba',
    nombre: 'Ciudad Autónoma de Buenos Aires',
    alias_ppi: 'Proyecto Pedagógico Individual (PPI)',
    norma_provincial: 'Res. 3816/2022 GCABA-MEDGC',
    norma_url: 'https://buenosaires.gob.ar/orientaciones-para-apoyar-la-educacion-inclusiva/orientaciones-proyecto-pedagogico-individual-ppi',
  },
  {
    id: 'bsas',
    nombre: 'Provincia de Buenos Aires',
    alias_ppi: 'Propuesta Pedagógica de Inclusión (PPI)',
    norma_provincial: 'Res. 1664/2017 DGCyE',
  },
  {
    id: 'catamarca',
    nombre: 'Catamarca',
    alias_ppi: 'Proyecto Pedagógico Individual (PPI)',
  },
  {
    id: 'chaco',
    nombre: 'Chaco',
    alias_ppi: 'Proyecto Pedagógico Individual (PPI)',
  },
  {
    id: 'chubut',
    nombre: 'Chubut',
    alias_ppi: 'Proyecto Pedagógico Individual (PPI)',
  },
  {
    id: 'cordoba',
    nombre: 'Córdoba',
    alias_ppi: 'Proyecto Pedagógico Individual (PPI)',
    norma_provincial: 'Ministerio de Educación de Córdoba — Igualdad y Calidad',
  },
  {
    id: 'corrientes',
    nombre: 'Corrientes',
    alias_ppi: 'Proyecto Pedagógico Individual (PPI)',
  },
  {
    id: 'entre-rios',
    nombre: 'Entre Ríos',
    alias_ppi: 'Proyecto Pedagógico Individual (PPI)',
  },
  {
    id: 'formosa',
    nombre: 'Formosa',
    alias_ppi: 'Proyecto Pedagógico Individual (PPI)',
  },
  {
    id: 'jujuy',
    nombre: 'Jujuy',
    alias_ppi: 'Proyecto Pedagógico Individual (PPI)',
  },
  {
    id: 'la-pampa',
    nombre: 'La Pampa',
    alias_ppi: 'Proyecto Pedagógico Individual (PPI)',
  },
  {
    id: 'la-rioja',
    nombre: 'La Rioja',
    alias_ppi: 'Proyecto Pedagógico Individual (PPI)',
  },
  {
    id: 'mendoza',
    nombre: 'Mendoza',
    alias_ppi: 'Proyecto Pedagógico Individual (PPI)',
  },
  {
    id: 'misiones',
    nombre: 'Misiones',
    alias_ppi: 'Proyecto Pedagógico Individual (PPI)',
  },
  {
    id: 'neuquen',
    nombre: 'Neuquén',
    alias_ppi: 'Proyecto Pedagógico Individual (PPI)',
  },
  {
    id: 'rio-negro',
    nombre: 'Río Negro',
    alias_ppi: 'Proyecto Pedagógico Individual (PPI)',
  },
  {
    id: 'salta',
    nombre: 'Salta',
    alias_ppi: 'Proyecto Pedagógico Individual (PPI)',
  },
  {
    id: 'san-juan',
    nombre: 'San Juan',
    alias_ppi: 'Proyecto Pedagógico Individual (PPI)',
  },
  {
    id: 'san-luis',
    nombre: 'San Luis',
    alias_ppi: 'Proyecto Pedagógico Individual (PPI)',
  },
  {
    id: 'santa-cruz',
    nombre: 'Santa Cruz',
    alias_ppi: 'Proyecto Pedagógico Individual (PPI)',
  },
  {
    id: 'santa-fe',
    nombre: 'Santa Fe',
    alias_ppi: 'Proyecto Pedagógico Individual (PPI)',
  },
  {
    id: 'santiago-del-estero',
    nombre: 'Santiago del Estero',
    alias_ppi: 'Proyecto Pedagógico Individual (PPI)',
  },
  {
    id: 'tierra-del-fuego',
    nombre: 'Tierra del Fuego',
    alias_ppi: 'Proyecto Pedagógico Individual (PPI)',
  },
  {
    id: 'tucuman',
    nombre: 'Tucumán',
    alias_ppi: 'Proyecto Pedagógico Individual (PPI)',
  },
]

export function findJurisdiccion(id: string | null | undefined): JurisdiccionPPI | null {
  if (!id) return null
  return JURISDICCIONES_PPI.find((j) => j.id === id) ?? null
}

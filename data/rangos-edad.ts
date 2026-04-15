import type { RangoEdad } from '@/lib/types';

export const RANGOS_EDAD: { id: RangoEdad; label: string; descripcion: string }[] = [
  { id: '0-2', label: '0 a 2 años', descripcion: 'Bebé / primera infancia' },
  { id: '3-5', label: '3 a 5 años', descripcion: 'Preescolar' },
  { id: '6-8', label: '6 a 8 años', descripcion: 'Primaria temprana' },
  { id: '9-12', label: '9 a 12 años', descripcion: 'Primaria tardía' },
  { id: '13-15', label: '13 a 15 años', descripcion: 'Adolescencia temprana' },
  { id: '16-18', label: '16 a 18 años', descripcion: 'Adolescencia' },
  { id: '18+', label: '18 años o más', descripcion: 'Adulto joven / adulto' },
];

import type { FormularioConsulta } from '@/lib/types';

export type PlantillaDocente = {
  id: string;
  icon: string;
  titulo: string;
  descripcion: string;
  form: Partial<FormularioConsulta>;
};

export const PLANTILLAS_DOCENTE: PlantillaDocente[] = [
  {
    id: 'fracciones-tea',
    icon: '🧮',
    titulo: 'Fracciones para alumno con TEA',
    descripcion: 'Matemática 5° grado · Fracciones equivalentes · Discapacidad: TEA',
    form: {
      nivel_id: 'primario',
      subnivel_id: 'segundo_ciclo',
      anio_grado: '5° grado',
      materia: 'Matemática',
      contenido: 'Fracciones equivalentes',
      discapacidades: ['tea'],
      cantidad_alumnos: 1,
      situacion_apoyo: 'maestra_integradora',
    },
  },
  {
    id: 'lectoescritura-dislexia',
    icon: '📖',
    titulo: 'Lectoescritura con dislexia',
    descripcion: 'Prácticas del Lenguaje 2° grado · Dislexia',
    form: {
      nivel_id: 'primario',
      subnivel_id: 'primer_ciclo',
      anio_grado: '2° grado',
      materia: 'Prácticas del Lenguaje',
      contenido: 'Comprensión lectora de textos narrativos cortos',
      discapacidades: ['dislexia'],
      cantidad_alumnos: 1,
      situacion_apoyo: 'sin_apoyo',
    },
  },
  {
    id: 'fotosintesis-motriz',
    icon: '🌱',
    titulo: 'Ciencias con discapacidad motriz',
    descripcion: 'Ciencias Naturales 6° · Fotosíntesis · Motriz',
    form: {
      nivel_id: 'primario',
      subnivel_id: 'segundo_ciclo',
      anio_grado: '6° grado',
      materia: 'Ciencias Naturales',
      contenido: 'La fotosíntesis y la función de las plantas',
      discapacidades: ['motriz'],
      cantidad_alumnos: 1,
      situacion_apoyo: 'acompanante_terapeutico',
    },
  },
  {
    id: 'historia-hipoacusia',
    icon: '👂',
    titulo: 'Ciencias Sociales con hipoacusia',
    descripcion: 'Ciencias Sociales 4° · Revolución de Mayo · Hipoacusia',
    form: {
      nivel_id: 'primario',
      subnivel_id: 'segundo_ciclo',
      anio_grado: '4° grado',
      materia: 'Ciencias Sociales',
      contenido: 'La Revolución de Mayo de 1810',
      discapacidades: ['hipoacusia'],
      cantidad_alumnos: 1,
      situacion_apoyo: 'maestra_integradora',
    },
  },
  {
    id: 'primer-dia-tdah',
    icon: '⚡',
    titulo: 'Primer día de clases con TDAH',
    descripcion: 'Primaria · Orientación general · TDAH',
    form: {
      nivel_id: 'primario',
      subnivel_id: 'primer_ciclo',
      anio_grado: '3° grado',
      materia: 'Prácticas del Lenguaje',
      contenido: 'Presentación del grupo y acuerdos de convivencia',
      discapacidades: ['tdah'],
      cantidad_alumnos: 1,
      situacion_apoyo: 'sin_apoyo',
    },
  },
  {
    id: 'inicial-down',
    icon: '🌈',
    titulo: 'Sala de 4 con Síndrome de Down',
    descripcion: 'Nivel Inicial · Expresión · Intelectual',
    form: {
      nivel_id: 'inicial',
      subnivel_id: 'jardin_infantes',
      anio_grado: 'Sala de 4 años',
      materia: 'Formación Personal y Social',
      contenido: 'Desarrollo de autonomía y hábitos',
      discapacidades: ['intelectual'],
      cantidad_alumnos: 1,
      situacion_apoyo: 'maestra_integradora',
    },
  },
];

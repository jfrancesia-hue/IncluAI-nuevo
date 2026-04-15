import type { EspecialidadProfesional } from '@/lib/types';

export type Especialidad = {
  id: EspecialidadProfesional;
  label: string;
  icon: string;
  descripcion: string;
  areas_comunes: string[];
};

export const ESPECIALIDADES: Especialidad[] = [
  {
    id: 'psicologo',
    label: 'Psicólogo/a',
    icon: '🧠',
    descripcion: 'Psicología clínica, evaluación, intervención conductual y emocional',
    areas_comunes: ['evaluación cognitiva', 'intervención conductual', 'regulación emocional', 'habilidades sociales', 'orientación familiar'],
  },
  {
    id: 'fonoaudiologo',
    label: 'Fonoaudiólogo/a',
    icon: '🗣️',
    descripcion: 'Lenguaje, habla, comunicación, deglución, audición',
    areas_comunes: ['estimulación del lenguaje', 'comunicación aumentativa', 'articulación', 'comprensión verbal', 'lectoescritura'],
  },
  {
    id: 'terapeuta_ocupacional',
    label: 'Terapeuta Ocupacional',
    icon: '🖐️',
    descripcion: 'Autonomía, motricidad fina, integración sensorial, actividades de vida diaria',
    areas_comunes: ['integración sensorial', 'motricidad fina', 'autonomía en AVD', 'adaptación de entornos', 'juego funcional'],
  },
  {
    id: 'kinesiologo',
    label: 'Kinesiólogo/a',
    icon: '🏃',
    descripcion: 'Rehabilitación motora, postura, movilidad, desarrollo motor',
    areas_comunes: ['desarrollo motor grueso', 'rehabilitación', 'postura y alineación', 'marcha', 'fortalecimiento muscular'],
  },
  {
    id: 'medico_pediatra',
    label: 'Médico/a Pediatra',
    icon: '👨‍⚕️',
    descripcion: 'Atención pediátrica general, seguimiento del desarrollo, derivaciones',
    areas_comunes: ['control de desarrollo', 'detección temprana', 'derivación a especialistas', 'manejo de comorbilidades', 'orientación a familias'],
  },
  {
    id: 'medico_familia',
    label: 'Médico/a de Familia',
    icon: '🏥',
    descripcion: 'Atención primaria integral, seguimiento longitudinal',
    areas_comunes: ['atención integral', 'seguimiento longitudinal', 'coordinación con especialistas', 'orientación familiar', 'salud preventiva'],
  },
  {
    id: 'medico_neurologo',
    label: 'Neurólogo/a',
    icon: '⚡',
    descripcion: 'Epilepsia, trastornos del neurodesarrollo, evaluación neurológica',
    areas_comunes: ['evaluación neurológica', 'manejo de epilepsia', 'neurodesarrollo', 'medicación', 'estudios complementarios'],
  },
  {
    id: 'medico_psiquiatra',
    label: 'Psiquiatra',
    icon: '💊',
    descripcion: 'Salud mental, medicación psicofarmacológica, trastornos graves',
    areas_comunes: ['evaluación psiquiátrica', 'medicación', 'comorbilidades psiquiátricas', 'intervención en crisis', 'seguimiento farmacológico'],
  },
  {
    id: 'odontologo',
    label: 'Odontólogo/a',
    icon: '🦷',
    descripcion: 'Atención odontológica adaptada, manejo de ansiedad, sedación consciente',
    areas_comunes: ['desensibilización al consultorio', 'adaptación de la atención', 'manejo de ansiedad', 'comunicación con el paciente', 'trabajo con familias'],
  },
  {
    id: 'nutricionista',
    label: 'Nutricionista',
    icon: '🥗',
    descripcion: 'Alimentación, selectividad alimentaria, planes nutricionales adaptados',
    areas_comunes: ['selectividad alimentaria', 'texturas y consistencias', 'planes nutricionales', 'suplementación', 'hábitos alimentarios'],
  },
  {
    id: 'trabajador_social',
    label: 'Trabajador/a Social',
    icon: '🤝',
    descripcion: 'Acceso a derechos, prestaciones, articulación con instituciones',
    areas_comunes: ['CUD y prestaciones', 'articulación institucional', 'acceso a derechos', 'orientación a familias', 'redes de apoyo'],
  },
  {
    id: 'psicopedagogo',
    label: 'Psicopedagogo/a',
    icon: '📚',
    descripcion: 'Evaluación y abordaje de dificultades de aprendizaje, orientación escolar',
    areas_comunes: ['evaluación de aprendizaje', 'estrategias pedagógicas', 'orientación escolar', 'adaptaciones curriculares', 'alfabetización'],
  },
  {
    id: 'musicoterapeuta',
    label: 'Musicoterapeuta',
    icon: '🎵',
    descripcion: 'Intervención terapéutica a través de la música, comunicación, expresión',
    areas_comunes: ['estimulación multisensorial', 'comunicación no verbal', 'regulación emocional', 'interacción social', 'expresión creativa'],
  },
  {
    id: 'acompanante_terapeutico',
    label: 'Acompañante Terapéutico',
    icon: '🫂',
    descripcion: 'Acompañamiento en vida cotidiana, inclusión escolar y social',
    areas_comunes: ['inclusión escolar', 'autonomía', 'habilidades sociales', 'regulación conductual', 'coordinación con equipo'],
  },
  {
    id: 'otro',
    label: 'Otra especialidad',
    icon: '📋',
    descripcion: 'Otra especialidad no listada',
    areas_comunes: ['adaptar según especialidad'],
  },
];

export function getEspecialidadById(id: string): Especialidad | undefined {
  return ESPECIALIDADES.find((e) => e.id === id);
}

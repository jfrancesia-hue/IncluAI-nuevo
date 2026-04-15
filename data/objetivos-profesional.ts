import type { ObjetivoConsultaProfesional } from '@/lib/types';

export type ObjetivoProfesional = {
  id: ObjetivoConsultaProfesional;
  label: string;
  icon: string;
  descripcion: string;
};

export const OBJETIVOS_PROFESIONAL: ObjetivoProfesional[] = [
  { id: 'comunicacion', label: 'Comunicación con el paciente', icon: '💬', descripcion: 'Cómo comunicarme de forma efectiva y respetuosa durante la atención' },
  { id: 'adaptacion_espacio', label: 'Adaptación del espacio', icon: '🏥', descripcion: 'Cómo preparar mi consultorio/espacio para recibir a este paciente' },
  { id: 'manejo_conducta', label: 'Manejo de conductas', icon: '🌊', descripcion: 'Cómo manejar conductas difíciles durante la consulta o sesión' },
  { id: 'evaluacion_adaptada', label: 'Evaluación adaptada', icon: '📋', descripcion: 'Cómo evaluar de forma adaptada a las necesidades del paciente' },
  { id: 'plan_tratamiento', label: 'Plan de tratamiento', icon: '📝', descripcion: 'Diseño de plan de tratamiento accesible y efectivo' },
  { id: 'orientacion_familia', label: 'Orientación a la familia', icon: '👨‍👩‍👧', descripcion: 'Qué recomendaciones dar a la familia del paciente' },
  { id: 'coordinacion_equipo', label: 'Coordinación con equipo', icon: '🤝', descripcion: 'Cómo coordinar con otros profesionales del equipo interdisciplinario' },
  { id: 'material_adaptado', label: 'Materiales adaptados', icon: '🧰', descripcion: 'Materiales y recursos adaptados para usar en la sesión' },
];

export function getObjetivoProfesionalById(id: string): ObjetivoProfesional | undefined {
  return OBJETIVOS_PROFESIONAL.find((o) => o.id === id);
}

export const CONTEXTOS_ATENCION: {
  id:
    | 'primera_consulta'
    | 'seguimiento'
    | 'evaluacion'
    | 'intervencion'
    | 'interconsulta'
    | 'domiciliaria';
  label: string;
}[] = [
  { id: 'primera_consulta', label: 'Primera consulta' },
  { id: 'seguimiento', label: 'Seguimiento' },
  { id: 'evaluacion', label: 'Evaluación' },
  { id: 'intervencion', label: 'Intervención / sesión' },
  { id: 'interconsulta', label: 'Interconsulta' },
  { id: 'domiciliaria', label: 'Atención domiciliaria' },
];

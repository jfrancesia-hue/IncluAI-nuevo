import { z } from 'zod';

export const situacionApoyoSchema = z.enum([
  'maestra_integradora',
  'acompanante_terapeutico',
  'sin_apoyo',
  'en_diagnostico',
  'otro',
]);

export const formularioConsultaSchema = z.object({
  nivel_id: z.string().min(1, 'Elegí un nivel educativo'),
  subnivel_id: z.string().optional(),
  anio_grado: z.string().min(1, 'Elegí año / grado / sala'),
  materia: z.string().min(1, 'Elegí una materia'),
  contenido: z
    .string()
    .trim()
    .min(5, 'Describí el contenido con más detalle')
    .max(800),

  discapacidades: z
    .array(z.string())
    .min(1, 'Seleccioná al menos una discapacidad'),
  discapacidad_otra: z.string().trim().max(300).optional(),
  cantidad_alumnos: z.number().int().min(1).max(50).default(1),
  situacion_apoyo: situacionApoyoSchema,
  situacion_apoyo_otra: z.string().trim().max(200).optional(),

  contexto_aula: z.string().trim().max(1500).optional(),
  objetivo_clase: z.string().trim().max(500).optional(),
});

export type FormularioConsultaInput = z.infer<typeof formularioConsultaSchema>;

// ============================================
// Familias
// ============================================

export const rangoEdadSchema = z.enum([
  '0-2',
  '3-5',
  '6-8',
  '9-12',
  '13-15',
  '16-18',
  '18+',
]);

export const areaAyudaFamiliaSchema = z.enum([
  'rutinas',
  'comunicacion',
  'conducta',
  'autonomia',
  'socializacion',
  'estimulacion',
  'escolaridad',
  'emociones',
  'sueno',
  'alimentacion',
  'transiciones',
  'hermanos',
  'tramites',
]);

export const situacionFamiliarSchema = z.enum([
  'ambos_padres',
  'monoparental',
  'familia_ampliada',
  'otro',
]);

export const formularioFamiliaSchema = z.object({
  nombre_hijo: z.string().trim().max(80).optional().or(z.literal('')),
  edad_rango: rangoEdadSchema,
  discapacidades: z.array(z.string()).min(1, 'Seleccioná al menos una discapacidad'),
  discapacidad_otra: z.string().trim().max(300).optional(),
  diagnostico_detalle: z.string().trim().max(500).optional().or(z.literal('')),

  areas_ayuda: z.array(areaAyudaFamiliaSchema).min(1, 'Elegí al menos un área'),
  situacion_especifica: z
    .string()
    .trim()
    .min(10, 'Contanos un poco más sobre la situación (mín. 10 caracteres)')
    .max(1500),

  situacion_familiar: situacionFamiliarSchema,
  tiene_terapias: z.boolean().default(false),
  terapias_detalle: z.string().trim().max(400).optional().or(z.literal('')),
  contexto_adicional: z.string().trim().max(1500).optional().or(z.literal('')),
});

export type FormularioFamiliaInput = z.infer<typeof formularioFamiliaSchema>;

// ============================================
// Profesionales
// ============================================

export const especialidadSchema = z.enum([
  'psicologo',
  'fonoaudiologo',
  'terapeuta_ocupacional',
  'kinesiologo',
  'medico_pediatra',
  'medico_familia',
  'medico_neurologo',
  'medico_psiquiatra',
  'odontologo',
  'nutricionista',
  'trabajador_social',
  'psicopedagogo',
  'musicoterapeuta',
  'acompanante_terapeutico',
  'otro',
]);

export const contextoAtencionSchema = z.enum([
  'primera_consulta',
  'seguimiento',
  'evaluacion',
  'intervencion',
  'interconsulta',
  'domiciliaria',
]);

export const objetivoProfesionalSchema = z.enum([
  'comunicacion',
  'adaptacion_espacio',
  'manejo_conducta',
  'evaluacion_adaptada',
  'plan_tratamiento',
  'orientacion_familia',
  'coordinacion_equipo',
  'material_adaptado',
]);

export const formularioProfesionalSchema = z.object({
  especialidad: especialidadSchema,
  especialidad_otra: z.string().trim().max(200).optional().or(z.literal('')),
  contexto_atencion: contextoAtencionSchema,
  lugar_atencion: z.string().trim().min(1, 'Indicá el lugar de atención').max(200),

  edad_paciente: rangoEdadSchema,
  discapacidades: z.array(z.string()).min(1, 'Seleccioná al menos una discapacidad'),
  discapacidad_otra: z.string().trim().max(300).optional().or(z.literal('')),
  diagnostico_detalle: z.string().trim().max(500).optional().or(z.literal('')),
  comunicacion_paciente: z.string().trim().min(1).max(200),

  objetivos: z.array(objetivoProfesionalSchema).min(1, 'Elegí al menos un objetivo'),
  situacion_especifica: z
    .string()
    .trim()
    .min(10, 'Contanos un poco más de la situación')
    .max(1500),
  contexto_adicional: z.string().trim().max(1500).optional().or(z.literal('')),
});

export type FormularioProfesionalInput = z.infer<typeof formularioProfesionalSchema>;

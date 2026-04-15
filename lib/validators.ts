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

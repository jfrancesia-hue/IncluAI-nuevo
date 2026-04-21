// ============================================
// IncluIA — Schema de guía estructurada (v2)
// Salida tipada que Claude devuelve vía tool use
// después de generar la guía en markdown.
// ============================================
import { z } from 'zod';

// ---- Chips de metadata del header ----
const chipSchema = z.object({
  label: z.string().max(40),
  tone: z.enum(['neutral', 'info', 'success', 'warn', 'danger']).default('neutral'),
});

// ---- Timeline: prioridades, pasos ordenados ----
const timelineItemSchema = z.object({
  title: z.string().max(120),
  body: z.string().max(500),
  prioridad: z.number().int().min(1).max(6),
  note: z.string().max(200).optional(),
  legalRef: z.string().max(120).optional(),
});

// ---- Estrategias (trading cards) ----
const strategyDuaSchema = z.enum([
  'representacion',
  'accion',
  'motivacion',
  'colaboracion',
]);

const strategyIllustrationSchema = z.enum([
  'agenda-pictografica',
  'tiras-fracciones',
  'reloj-pausa',
  'pareja-roles',
  'rutina-visual',
  'material-manipulativo',
  'trabajo-grupal',
  'recurso-digital',
  'generic',
]);

const strategySchema = z.object({
  title: z.string().max(120),
  body: z.string().max(500),
  dua: strategyDuaSchema.default('representacion'),
  illustration: strategyIllustrationSchema.default('generic'),
  disabilityTag: z.string().max(40).optional(),
  prepTime: z.string().max(40).optional(),
  externalLink: z
    .object({
      label: z.string().max(60),
      href: z.string().url().optional(),
    })
    .optional(),
});

// ---- Recursos (grid 3 columnas) ----
const resourceKindSchema = z.enum(['imprimible', 'digital', 'casa']);

const resourceSchema = z.object({
  title: z.string().max(120),
  description: z.string().max(300),
  kind: resourceKindSchema,
  extraTag: z.string().max(30).optional(),
  ctaLabel: z.string().max(40).default('Ver recurso'),
  href: z.string().url().optional(),
});

// ---- Evaluación ----
const rubricItemSchema = z.object({
  criterion: z.string().max(200),
  score: z.number().min(0).max(4),
  scoreLabel: z.string().max(30).optional(), // p.ej. "3/4" o "En progreso"
  tone: z.enum(['success', 'warn', 'neutral']).default('neutral'),
});

const evaluationSectionSchema = z.object({
  kind: z.literal('evaluation'),
  title: z.string().default('Evaluación justa y diferenciada'),
  intro: z.string().max(400).optional(),
  traditional: z.array(z.string().max(200)).min(1).max(6),
  adapted: z.array(z.string().max(400)).min(1).max(6),
  adaptedRibbon: z.string().max(60).optional(),
  rubric: z
    .object({
      subjectName: z.string().max(60).optional(),
      scaleNote: z.string().max(60).optional(),
      items: z.array(rubricItemSchema).min(1).max(8),
    })
    .optional(),
});

// ---- Comunicación (sí decí / evitá) ----
const quoteSchema = z.object({
  text: z.string().max(300),
  tag: z.string().max(80).optional(),
});

const communicationSectionSchema = z.object({
  kind: z.literal('communication'),
  title: z.string().default('Comunicación y vínculo en el aula'),
  intro: z.string().max(400).optional(),
  sayThis: z.array(quoteSchema).min(1).max(6),
  avoid: z.array(quoteSchema).min(1).max(6),
});

// ---- Qué evitar ----
const warningSchema = z.object({
  title: z.string().max(120),
  body: z.string().max(400),
});

const avoidSectionSchema = z.object({
  kind: z.literal('avoid'),
  title: z.string().default('Qué evitar'),
  intro: z.string().max(400).optional(),
  warnings: z.array(warningSchema).min(1).max(6),
});

// ---- Coordinación (stakeholder map) ----
const stakeholderColorSchema = z.enum(['amber', 'blue', 'pink', 'green']);

const stakeholderSchema = z.object({
  id: z.enum(['familia', 'eoe', 'equipo-docente', 'especialistas', 'otro']),
  label: z.string().max(40),
  sublabel: z.string().max(80).optional(),
  color: stakeholderColorSchema,
  actions: z.array(z.string().max(200)).min(1).max(5),
});

const coordinationSectionSchema = z.object({
  kind: z.literal('coordination'),
  title: z.string().default('Coordinación con otros actores'),
  intro: z.string().max(400).optional(),
  centerLabel: z.string().max(40).default('ALUMNO/A'),
  centerSublabel: z.string().max(80).optional(),
  stakeholders: z.array(stakeholderSchema).min(2).max(5),
});

// ---- Section variants ----
const timelineSectionSchema = z.object({
  kind: z.literal('timeline'),
  title: z.string().default('Contenidos prioritarios'),
  intro: z.string().max(400).optional(),
  items: z.array(timelineItemSchema).min(2).max(6),
});

const strategiesSectionSchema = z.object({
  kind: z.literal('strategies'),
  title: z.string().default('Estrategias de enseñanza'),
  intro: z.string().max(400).optional(),
  strategies: z.array(strategySchema).min(2).max(6),
  tip: z.string().max(400).optional(),
});

const resourcesSectionSchema = z.object({
  kind: z.literal('resources'),
  title: z.string().default('Materiales y recursos'),
  intro: z.string().max(400).optional(),
  resources: z.array(resourceSchema).min(1).max(6),
});

// Discriminated union
export const guideSectionSchema = z.discriminatedUnion('kind', [
  timelineSectionSchema,
  strategiesSectionSchema,
  resourcesSectionSchema,
  evaluationSectionSchema,
  communicationSectionSchema,
  avoidSectionSchema,
  coordinationSectionSchema,
]);

// ---- Guide completa ----
export const structuredGuideSchema = z.object({
  version: z.literal('v2'),
  header: z.object({
    topic: z.string().max(120),
    subtitle: z.string().max(400).optional(),
    chips: z.array(chipSchema).max(8).default([]),
    readTimeMin: z.number().int().min(1).max(30).default(8),
  }),
  sections: z.array(guideSectionSchema).min(3).max(9),
  legalFooter: z.string().max(300).optional(),
});

// ---- Types inferidos ----
export type StructuredGuide = z.infer<typeof structuredGuideSchema>;
export type GuideSection = z.infer<typeof guideSectionSchema>;
export type GuideChip = z.infer<typeof chipSchema>;
export type Strategy = z.infer<typeof strategySchema>;
export type Resource = z.infer<typeof resourceSchema>;
export type TimelineItem = z.infer<typeof timelineItemSchema>;
export type Warning = z.infer<typeof warningSchema>;
export type Quote = z.infer<typeof quoteSchema>;
export type Stakeholder = z.infer<typeof stakeholderSchema>;
export type RubricItem = z.infer<typeof rubricItemSchema>;
export type StrategyIllustrationId = z.infer<typeof strategyIllustrationSchema>;

// ---- JSON Schema (para tool use de Claude) ----
// Versión minificada manualmente — mapea 1:1 al Zod de arriba.
export const STRUCTURED_GUIDE_TOOL_SCHEMA = {
  type: 'object',
  required: ['version', 'header', 'sections'],
  properties: {
    version: { type: 'string', enum: ['v2'] },
    header: {
      type: 'object',
      required: ['topic'],
      properties: {
        topic: { type: 'string', maxLength: 120 },
        subtitle: { type: 'string', maxLength: 400 },
        chips: {
          type: 'array',
          maxItems: 8,
          items: {
            type: 'object',
            required: ['label'],
            properties: {
              label: { type: 'string', maxLength: 40 },
              tone: {
                type: 'string',
                enum: ['neutral', 'info', 'success', 'warn', 'danger'],
              },
            },
          },
        },
        readTimeMin: { type: 'integer', minimum: 1, maximum: 30 },
      },
    },
    sections: {
      type: 'array',
      minItems: 3,
      maxItems: 9,
      items: {
        oneOf: [
          {
            type: 'object',
            required: ['kind', 'items'],
            properties: {
              kind: { const: 'timeline' },
              title: { type: 'string' },
              intro: { type: 'string' },
              items: {
                type: 'array',
                minItems: 2,
                maxItems: 6,
                items: {
                  type: 'object',
                  required: ['title', 'body', 'prioridad'],
                  properties: {
                    title: { type: 'string', maxLength: 120 },
                    body: { type: 'string', maxLength: 500 },
                    prioridad: { type: 'integer', minimum: 1, maximum: 6 },
                    note: { type: 'string', maxLength: 200 },
                    legalRef: { type: 'string', maxLength: 120 },
                  },
                },
              },
            },
          },
          {
            type: 'object',
            required: ['kind', 'strategies'],
            properties: {
              kind: { const: 'strategies' },
              title: { type: 'string' },
              intro: { type: 'string' },
              strategies: {
                type: 'array',
                minItems: 2,
                maxItems: 6,
                items: {
                  type: 'object',
                  required: ['title', 'body'],
                  properties: {
                    title: { type: 'string', maxLength: 120 },
                    body: { type: 'string', maxLength: 500 },
                    dua: {
                      type: 'string',
                      enum: ['representacion', 'accion', 'motivacion', 'colaboracion'],
                    },
                    illustration: {
                      type: 'string',
                      enum: [
                        'agenda-pictografica',
                        'tiras-fracciones',
                        'reloj-pausa',
                        'pareja-roles',
                        'rutina-visual',
                        'material-manipulativo',
                        'trabajo-grupal',
                        'recurso-digital',
                        'generic',
                      ],
                    },
                    disabilityTag: { type: 'string', maxLength: 40 },
                    prepTime: { type: 'string', maxLength: 40 },
                    externalLink: {
                      type: 'object',
                      properties: {
                        label: { type: 'string', maxLength: 60 },
                        href: { type: 'string' },
                      },
                    },
                  },
                },
              },
              tip: { type: 'string', maxLength: 400 },
            },
          },
          {
            type: 'object',
            required: ['kind', 'resources'],
            properties: {
              kind: { const: 'resources' },
              title: { type: 'string' },
              intro: { type: 'string' },
              resources: {
                type: 'array',
                minItems: 1,
                maxItems: 6,
                items: {
                  type: 'object',
                  required: ['title', 'description', 'kind'],
                  properties: {
                    title: { type: 'string', maxLength: 120 },
                    description: { type: 'string', maxLength: 300 },
                    kind: { type: 'string', enum: ['imprimible', 'digital', 'casa'] },
                    extraTag: { type: 'string', maxLength: 30 },
                    ctaLabel: { type: 'string', maxLength: 40 },
                    href: { type: 'string' },
                  },
                },
              },
            },
          },
          {
            type: 'object',
            required: ['kind', 'traditional', 'adapted'],
            properties: {
              kind: { const: 'evaluation' },
              title: { type: 'string' },
              intro: { type: 'string' },
              traditional: {
                type: 'array',
                minItems: 1,
                maxItems: 6,
                items: { type: 'string', maxLength: 200 },
              },
              adapted: {
                type: 'array',
                minItems: 1,
                maxItems: 6,
                items: { type: 'string', maxLength: 400 },
              },
              adaptedRibbon: { type: 'string', maxLength: 60 },
              rubric: {
                type: 'object',
                required: ['items'],
                properties: {
                  subjectName: { type: 'string', maxLength: 60 },
                  scaleNote: { type: 'string', maxLength: 60 },
                  items: {
                    type: 'array',
                    minItems: 1,
                    maxItems: 8,
                    items: {
                      type: 'object',
                      required: ['criterion', 'score'],
                      properties: {
                        criterion: { type: 'string', maxLength: 200 },
                        score: { type: 'number', minimum: 0, maximum: 4 },
                        scoreLabel: { type: 'string', maxLength: 30 },
                        tone: { type: 'string', enum: ['success', 'warn', 'neutral'] },
                      },
                    },
                  },
                },
              },
            },
          },
          {
            type: 'object',
            required: ['kind', 'sayThis', 'avoid'],
            properties: {
              kind: { const: 'communication' },
              title: { type: 'string' },
              intro: { type: 'string' },
              sayThis: {
                type: 'array',
                minItems: 1,
                maxItems: 6,
                items: {
                  type: 'object',
                  required: ['text'],
                  properties: {
                    text: { type: 'string', maxLength: 300 },
                    tag: { type: 'string', maxLength: 80 },
                  },
                },
              },
              avoid: {
                type: 'array',
                minItems: 1,
                maxItems: 6,
                items: {
                  type: 'object',
                  required: ['text'],
                  properties: {
                    text: { type: 'string', maxLength: 300 },
                    tag: { type: 'string', maxLength: 80 },
                  },
                },
              },
            },
          },
          {
            type: 'object',
            required: ['kind', 'warnings'],
            properties: {
              kind: { const: 'avoid' },
              title: { type: 'string' },
              intro: { type: 'string' },
              warnings: {
                type: 'array',
                minItems: 1,
                maxItems: 6,
                items: {
                  type: 'object',
                  required: ['title', 'body'],
                  properties: {
                    title: { type: 'string', maxLength: 120 },
                    body: { type: 'string', maxLength: 400 },
                  },
                },
              },
            },
          },
          {
            type: 'object',
            required: ['kind', 'stakeholders'],
            properties: {
              kind: { const: 'coordination' },
              title: { type: 'string' },
              intro: { type: 'string' },
              centerLabel: { type: 'string', maxLength: 40 },
              centerSublabel: { type: 'string', maxLength: 80 },
              stakeholders: {
                type: 'array',
                minItems: 2,
                maxItems: 5,
                items: {
                  type: 'object',
                  required: ['id', 'label', 'color', 'actions'],
                  properties: {
                    id: {
                      type: 'string',
                      enum: ['familia', 'eoe', 'equipo-docente', 'especialistas', 'otro'],
                    },
                    label: { type: 'string', maxLength: 40 },
                    sublabel: { type: 'string', maxLength: 80 },
                    color: { type: 'string', enum: ['amber', 'blue', 'pink', 'green'] },
                    actions: {
                      type: 'array',
                      minItems: 1,
                      maxItems: 5,
                      items: { type: 'string', maxLength: 200 },
                    },
                  },
                },
              },
            },
          },
        ],
      },
    },
    legalFooter: { type: 'string', maxLength: 300 },
  },
} as const;

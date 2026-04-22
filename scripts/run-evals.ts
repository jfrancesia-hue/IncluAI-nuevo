/**
 * IncluIA — Runner de Evals automáticos.
 *
 * - Lee evals/dataset.jsonl (60 casos de test).
 * - Para cada caso:
 *     1) llama a Claude con el prompt real de lib/prompts.ts (modelo bajo evaluación)
 *     2) llama a un Claude "judge" con la rúbrica cacheada como system prompt
 *     3) guarda scores, evidencia y metadata del caso
 * - Escribe results/run-{ts}.json con el reporte completo.
 * - Imprime resumen coloreado en consola.
 * - Exit code 1 si el score promedio está por debajo de EVALS_THRESHOLD (85 default).
 *
 * IMPORTANTE: este runner no consulta Supabase ni la DB. Corre contra el modelo
 * puro, sin el pipeline de streaming ni el enrichment estructurado. El objetivo
 * es medir la *calidad del prompt*, no del pipeline completo.
 */

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';

// ---------- Config ----------

// Raíz del proyecto. `npm run evals` siempre se ejecuta desde el root del repo
// (tanto en CI como localmente), así que process.cwd() es confiable.
// Validamos que estemos en la raíz correcta mirando por package.json.
const ROOT = resolve(process.cwd());
if (!existsSync(join(ROOT, 'package.json'))) {
  console.error(`[evals] ERROR: corré el script desde la raíz del proyecto (${ROOT} no tiene package.json).`);
  process.exit(2);
}
const DATASET_PATH = join(ROOT, 'evals', 'dataset.jsonl');
const RESULTS_DIR = join(ROOT, 'evals', 'results');
const RUBRICA_PATH = join(ROOT, 'evals', 'rubrica.md');

const MODEL = process.env.EVALS_MODEL ?? 'claude-sonnet-4-6';
const JUDGE_MODEL = process.env.EVALS_JUDGE_MODEL ?? 'claude-sonnet-4-6';
const CONCURRENCY = Number(process.env.EVALS_CONCURRENCY ?? 4);
const LIMIT = process.env.EVALS_LIMIT ? Number(process.env.EVALS_LIMIT) : undefined;
const FILTER_ID = process.env.EVALS_FILTER_ID;
const THRESHOLD = Number(process.env.EVALS_THRESHOLD ?? 85);

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('[evals] ERROR: ANTHROPIC_API_KEY no está definida en el entorno.');
  process.exit(2);
}

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ---------- ANSI colors (sin dependencias) ----------

const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// ---------- Types ----------

type EvalCase = {
  id: string;
  nivel: string;
  discapacidad: string;
  materia: string;
  input: {
    nivel_id: string;
    subnivel_id?: string;
    anio_grado: string;
    materia: string;
    contenido: string;
    discapacidades: string[];
    cantidad_alumnos: number;
    situacion_apoyo: string;
    contexto_aula?: string;
    objetivo_clase?: string;
  };
  expected_topics: string[];
  forbidden_stereotypes: string[];
  deprecated?: boolean;
};

type DimensionScore = {
  puntos: number;
  max: number;
  criterios: Array<{ id: string; puntos: number; max: number; evidencia: string }>;
  fallo_automatico?: string;
};

type JudgeResult = {
  relevancia: DimensionScore;
  accesibilidad: DimensionScore;
  adecuacion: DimensionScore;
  diversidad: DimensionScore;
  estructura: DimensionScore;
  score_total: number;
  stereotype_violation: boolean;
  comentario_general: string;
};

type CaseResult = {
  id: string;
  nivel: string;
  discapacidad: string;
  materia: string;
  model: string;
  judge_model: string;
  generated_at: string;
  generation_ms: number;
  judge_ms: number;
  prompt_sent: string;
  generated_guide: string;
  judge_raw: string;
  judge_parsed: JudgeResult | null;
  score_total: number;
  case_fail: boolean;
  stereotype_violation: boolean;
  error?: string;
};

// ---------- Load dataset ----------

function loadDataset(): EvalCase[] {
  if (!existsSync(DATASET_PATH)) {
    throw new Error(`No se encontró ${DATASET_PATH}`);
  }
  const raw = readFileSync(DATASET_PATH, 'utf-8');
  const lines = raw.split('\n').filter((l) => l.trim().length > 0);
  const cases = lines.map((line, idx) => {
    try {
      return JSON.parse(line) as EvalCase;
    } catch (err) {
      throw new Error(`[evals] JSON inválido en línea ${idx + 1}: ${(err as Error).message}`);
    }
  });
  return cases.filter((ct) => !ct.deprecated);
}

function hashDataset(): string {
  const raw = readFileSync(DATASET_PATH);
  return createHash('sha256').update(raw).digest('hex').slice(0, 16);
}

function gitCommit(): string {
  try {
    return execSync('git rev-parse HEAD', { cwd: ROOT }).toString().trim();
  } catch {
    return 'no-git';
  }
}

// ---------- Prompt del modelo bajo evaluación ----------
// Replicamos la lógica de lib/prompts.ts pero SIN importar el builder real
// (que depende de datos y tipos que requieren runtime de la app). Esta copia
// debe mantenerse sincronizada manualmente con lib/prompts.ts::buildPrompt.

function buildSystemPromptDocentes(): string {
  return `Sos un especialista en educación inclusiva con más de 20 años de experiencia en el sistema educativo argentino. Tenés profundo conocimiento en:

- Diseño Universal para el Aprendizaje (DUA)
- Adecuaciones curriculares de acceso y significativas (Resolución CFE N° 311/16)
- Configuraciones de apoyo según las necesidades del alumno
- Diseños curriculares jurisdiccionales de las provincias argentinas
- Normativa vigente: Ley 26.206, Convención sobre los Derechos de las Personas con Discapacidad, Ley 26.378

REGLAS DE RESPUESTA:
1. Siempre respondés de forma CONCRETA y PRÁCTICA — con ejemplos reales aplicables al contenido específico que te dan
2. NUNCA respondés con teoría genérica ni definiciones de manual
3. Cada estrategia que proponés incluye un ejemplo concreto usando el contenido que el docente va a enseñar
4. Usás lenguaje claro, profesional y respetuoso — sin jerga técnica innecesaria
5. Reconocés la realidad de las aulas argentinas: falta de recursos, aulas numerosas, falta de acompañamiento
6. Siempre proponés alternativas de bajo costo y fáciles de implementar
7. Cuando es pertinente, sugerís recursos digitales gratuitos disponibles en Argentina
8. Respondés en español rioplatense argentino
9. Cuando corresponde, citás la normativa específica entre paréntesis — ej: "(Res. CFE 311/16, art. 23)" o "(Ley 26.206, art. 11)"

FORMATO DE RESPUESTA:
Organizá tu respuesta en las secciones indicadas, usando encabezados con ## para cada sección.
Dentro de cada sección, usá listas con viñetas para las estrategias.
Cada estrategia debe tener: la acción + un ejemplo concreto con el contenido indicado.`;
}

function buildUserPromptDocentes(input: EvalCase['input']): string {
  const discapLabels: Record<string, string> = {
    visual: 'Discapacidad Visual / Baja Visión / Ceguera',
    hipoacusia: 'Hipoacusia / Sordera',
    motriz: 'Discapacidad Motriz',
    intelectual: 'Discapacidad Intelectual',
    tea: 'Trastorno del Espectro Autista (TEA)',
  };

  const apoyoTexto: Record<string, string> = {
    maestra_integradora: 'Cuenta con Maestra de Apoyo a la Inclusión (MAI) / Maestra Integradora',
    acompanante_terapeutico: 'Cuenta con Acompañante Terapéutico (AT) en el aula',
    sin_apoyo: 'NO cuenta con ningún apoyo profesional adicional en el aula',
    en_diagnostico: 'El alumno está en proceso de diagnóstico (aún sin certificado de discapacidad)',
    otro: 'Otra situación de apoyo',
  };

  const bloqueDisc = input.discapacidades
    .map((id) => `- **${discapLabels[id] ?? id}**`)
    .join('\n');

  const contenido = input.contenido;
  const materia = input.materia;

  const bloqueContexto = input.contexto_aula
    ? `\n## Contexto del aula descrito por el docente:\n${input.contexto_aula}`
    : '';
  const bloqueObjetivo = input.objetivo_clase
    ? `\n## Objetivo de la clase:\n${input.objetivo_clase}`
    : '';

  return `Necesito que generes una GUÍA PEDAGÓGICA CONCRETA E INCLUSIVA para la siguiente situación real de aula:

## Datos del contexto:
- **Nivel educativo**: ${input.nivel_id}${input.subnivel_id ? ` — ${input.subnivel_id}` : ''}
- **Año/Grado/Sala**: ${input.anio_grado}
- **Materia/Área**: ${materia}
- **Contenido a trabajar**: ${contenido}
- **Cantidad de alumnos con discapacidad en el aula**: ${input.cantidad_alumnos}
- **Situación de apoyo**: ${apoyoTexto[input.situacion_apoyo] ?? input.situacion_apoyo}

## Discapacidad/es del alumno/s:
${bloqueDisc}
${bloqueContexto}
${bloqueObjetivo}

---

Generá la guía con las siguientes 7 secciones. En CADA sección, las estrategias deben ser concretas y usar como ejemplo el contenido "${contenido}" de la materia ${materia}:

## 1. 📚 Contenidos prioritarios y adecuación curricular
## 2. 🎯 Estrategias de enseñanza concretas
## 3. 🧰 Materiales y recursos adaptados
## 4. 📝 Evaluación justa y diferenciada
## 5. 💬 Comunicación y vínculo en el aula
## 6. ⚠️ Qué evitar
## 7. 🤝 Coordinación con otros actores

IMPORTANTE: No respondas con teoría. Cada punto debe tener un EJEMPLO CONCRETO usando "${contenido}".`;
}

// ---------- Generación (modelo bajo evaluación) ----------

async function generateGuide(ec: EvalCase): Promise<{ text: string; ms: number; prompt: string }> {
  const system = buildSystemPromptDocentes();
  const user = buildUserPromptDocentes(ec.input);
  const t0 = Date.now();

  const msg = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 4000,
    system: [
      {
        type: 'text',
        text: system,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [{ role: 'user', content: user }],
  });

  const text = msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('\n');

  return { text, ms: Date.now() - t0, prompt: user };
}

// ---------- Judge ----------

function buildJudgeSystemPrompt(): string {
  const rubrica = existsSync(RUBRICA_PATH) ? readFileSync(RUBRICA_PATH, 'utf-8') : '';
  return `Sos un auditor externo de calidad de IA para IncluIA (plataforma argentina de educación inclusiva).

Tu trabajo es puntuar guías pedagógicas generadas por IA contra una rúbrica pública y auditable. Sos estricto, basás cada puntaje en evidencia textual citada desde la guía, y nunca inferís lo que no está escrito.

# REGLAS FUNDAMENTALES

1. Para cada criterio, citás textualmente (entre comillas) la frase de la guía que justifica el puntaje. Si no hay frase que lo justifique, el puntaje es 0.
2. Nunca asignás puntaje "promedio" por piedad; si falta algo, falta.
3. Detectás estereotipos y prácticas capacitistas incluso cuando están sutilmente redactados.
4. Conocés la normativa argentina de educación inclusiva: Res. CFE 311/16, Ley 26.206, Ley 26.378 (Convención), Ley 24.901 (prestaciones).
5. Conocés WCAG 2.1 nivel AA.
6. Respondés SIEMPRE con un JSON válido con el esquema exacto que se te pide. Nada de markdown, nada de texto antes o después.

# RÚBRICA (referencia obligatoria)

${rubrica}

# ESQUEMA JSON DE SALIDA

Devolvés SOLO este JSON (sin bloque markdown, sin texto extra):

{
  "relevancia":    { "puntos": number, "max": 25, "criterios": [{"id":"1.1","puntos":number,"max":6,"evidencia":string}, ...], "fallo_automatico": string|null },
  "accesibilidad": { "puntos": number, "max": 20, "criterios": [...], "fallo_automatico": string|null },
  "adecuacion":    { "puntos": number, "max": 25, "criterios": [...], "fallo_automatico": string|null },
  "diversidad":    { "puntos": number, "max": 15, "criterios": [...], "fallo_automatico": string|null },
  "estructura":    { "puntos": number, "max": 15, "criterios": [...], "fallo_automatico": string|null },
  "score_total":   number,
  "stereotype_violation": boolean,
  "comentario_general": string
}

donde "score_total" = relevancia.puntos + accesibilidad.puntos + adecuacion.puntos + diversidad.puntos + estructura.puntos (nunca superior a 100).

Si detectás ALGÚN estereotipo listado como prohibido en el caso, seteás "stereotype_violation": true Y dejás la dimensión "diversidad" en 0.`;
}

function buildJudgeUserPrompt(ec: EvalCase, guide: string): string {
  return `# Caso a evaluar

**ID:** ${ec.id}
**Nivel:** ${ec.nivel}
**Discapacidad:** ${ec.discapacidad}
**Materia:** ${ec.materia}

## Input original
\`\`\`json
${JSON.stringify(ec.input, null, 2)}
\`\`\`

## Topics esperados (no obligatorios pero orientadores)
${ec.expected_topics.map((t) => `- ${t}`).join('\n')}

## Estereotipos prohibidos (deben estar AUSENTES en la guía)
${ec.forbidden_stereotypes.map((t) => `- ${t}`).join('\n')}

## Guía generada por IncluIA (a evaluar)

${guide}

---

Puntúa la guía siguiendo la rúbrica. Respondé SOLO con el JSON del esquema indicado.`;
}

async function judgeGuide(
  ec: EvalCase,
  guide: string,
): Promise<{ parsed: JudgeResult | null; raw: string; ms: number }> {
  const system = buildJudgeSystemPrompt();
  const user = buildJudgeUserPrompt(ec, guide);
  const t0 = Date.now();

  const msg = await anthropic.messages.create({
    model: JUDGE_MODEL,
    max_tokens: 3000,
    system: [
      {
        type: 'text',
        text: system,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [{ role: 'user', content: user }],
  });

  const raw = msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
    .trim();

  // El modelo a veces envuelve en ```json``` a pesar del pedido. Intentamos parsear defensivamente.
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/i, '')
    .trim();

  let parsed: JudgeResult | null = null;
  try {
    parsed = JSON.parse(cleaned) as JudgeResult;
  } catch (err) {
    console.error(`[evals] ${ec.id} — judge devolvió JSON inválido: ${(err as Error).message}`);
  }

  return { parsed, raw, ms: Date.now() - t0 };
}

// ---------- Concurrencia sencilla ----------

async function mapLimit<T, R>(
  items: T[],
  limit: number,
  worker: (item: T, idx: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let nextIndex = 0;

  async function runner() {
    while (true) {
      const i = nextIndex++;
      if (i >= items.length) return;
      results[i] = await worker(items[i], i);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => runner()));
  return results;
}

// ---------- Main ----------

async function main() {
  const tStart = Date.now();
  console.log(`${c.bold}${c.cyan}IncluIA — Evals runner${c.reset}`);
  console.log(`${c.dim}model=${MODEL} judge=${JUDGE_MODEL} concurrency=${CONCURRENCY} threshold=${THRESHOLD}${c.reset}\n`);

  let dataset = loadDataset();
  if (FILTER_ID) dataset = dataset.filter((c) => c.id === FILTER_ID);
  if (LIMIT) dataset = dataset.slice(0, LIMIT);
  if (dataset.length === 0) {
    console.error(`${c.red}[evals] Dataset vacío después de filtros.${c.reset}`);
    process.exit(2);
  }

  console.log(`${c.dim}Casos a evaluar: ${dataset.length}${c.reset}\n`);

  const results: CaseResult[] = await mapLimit(dataset, CONCURRENCY, async (ec) => {
    const base: CaseResult = {
      id: ec.id,
      nivel: ec.nivel,
      discapacidad: ec.discapacidad,
      materia: ec.materia,
      model: MODEL,
      judge_model: JUDGE_MODEL,
      generated_at: new Date().toISOString(),
      generation_ms: 0,
      judge_ms: 0,
      prompt_sent: '',
      generated_guide: '',
      judge_raw: '',
      judge_parsed: null,
      score_total: 0,
      case_fail: true,
      stereotype_violation: false,
    };

    try {
      const gen = await generateGuide(ec);
      base.generated_guide = gen.text;
      base.generation_ms = gen.ms;
      base.prompt_sent = gen.prompt;

      const { parsed, raw, ms } = await judgeGuide(ec, gen.text);
      base.judge_raw = raw;
      base.judge_parsed = parsed;
      base.judge_ms = ms;

      if (parsed) {
        base.score_total = Math.max(0, Math.min(100, parsed.score_total));
        base.case_fail = base.score_total < 50;
        base.stereotype_violation = Boolean(parsed.stereotype_violation);
      }

      const color =
        base.score_total >= THRESHOLD
          ? c.green
          : base.score_total >= 75
            ? c.yellow
            : c.red;
      const stereoWarn = base.stereotype_violation ? ` ${c.magenta}[STEREO]${c.reset}` : '';
      console.log(
        `${color}${base.id}${c.reset} ${c.dim}${ec.nivel}/${ec.discapacidad}/${ec.materia}${c.reset}  score=${color}${base.score_total.toFixed(1)}${c.reset}  gen=${base.generation_ms}ms judge=${base.judge_ms}ms${stereoWarn}`,
      );
    } catch (err) {
      base.error = (err as Error).message;
      console.log(`${c.red}${base.id} FAILED: ${base.error}${c.reset}`);
    }

    return base;
  });

  // ---------- Reporte ----------

  const valid = results.filter((r) => !r.error && r.judge_parsed);
  const avg =
    valid.length === 0
      ? 0
      : valid.reduce((acc, r) => acc + r.score_total, 0) / valid.length;

  const fails = results.filter((r) => r.case_fail || r.error);
  const stereoFlags = results.filter((r) => r.stereotype_violation);

  const byDim = (sel: (p: JudgeResult) => DimensionScore) =>
    valid.length === 0
      ? 0
      : valid.reduce((acc, r) => acc + sel(r.judge_parsed as JudgeResult).puntos, 0) / valid.length;

  const dimAvgs = {
    relevancia: byDim((p) => p.relevancia),
    accesibilidad: byDim((p) => p.accesibilidad),
    adecuacion: byDim((p) => p.adecuacion),
    diversidad: byDim((p) => p.diversidad),
    estructura: byDim((p) => p.estructura),
  };

  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  if (!existsSync(RESULTS_DIR)) mkdirSync(RESULTS_DIR, { recursive: true });

  const report = {
    meta: {
      timestamp: new Date().toISOString(),
      elapsed_ms: Date.now() - tStart,
      git_commit: gitCommit(),
      dataset_sha256_16: hashDataset(),
      model: MODEL,
      judge_model: JUDGE_MODEL,
      concurrency: CONCURRENCY,
      threshold: THRESHOLD,
      cases_total: results.length,
      cases_valid: valid.length,
      cases_fail: fails.length,
      stereotype_violations: stereoFlags.length,
    },
    summary: {
      score_avg: Number(avg.toFixed(2)),
      dim_avgs: Object.fromEntries(
        Object.entries(dimAvgs).map(([k, v]) => [k, Number(v.toFixed(2))]),
      ),
      passed: avg >= THRESHOLD,
    },
    results,
  };

  const jsonPath = join(RESULTS_DIR, `run-${ts}.json`);
  writeFileSync(jsonPath, JSON.stringify(report, null, 2));

  // Summary markdown (corto, para humanos)
  const mdLines: string[] = [];
  mdLines.push(`# IncluIA Evals — Run ${ts}`);
  mdLines.push('');
  mdLines.push(`- **Score promedio:** ${avg.toFixed(2)} / 100 ${avg >= THRESHOLD ? 'PASS' : 'FAIL'}`);
  mdLines.push(`- **Modelo:** ${MODEL}`);
  mdLines.push(`- **Judge:** ${JUDGE_MODEL}`);
  mdLines.push(`- **Commit:** ${report.meta.git_commit}`);
  mdLines.push(`- **Dataset hash:** ${report.meta.dataset_sha256_16}`);
  mdLines.push(`- **Casos totales:** ${results.length} (válidos: ${valid.length}, fallos: ${fails.length})`);
  mdLines.push(`- **Violaciones de estereotipo:** ${stereoFlags.length}`);
  mdLines.push('');
  mdLines.push('## Promedios por dimensión');
  mdLines.push('');
  mdLines.push(`- Relevancia pedagógica: ${dimAvgs.relevancia.toFixed(2)} / 25`);
  mdLines.push(`- Accesibilidad WCAG AA: ${dimAvgs.accesibilidad.toFixed(2)} / 20`);
  mdLines.push(`- Adecuación a la discapacidad: ${dimAvgs.adecuacion.toFixed(2)} / 25`);
  mdLines.push(`- Diversidad y no estereotipos: ${dimAvgs.diversidad.toFixed(2)} / 15`);
  mdLines.push(`- Estructura completa: ${dimAvgs.estructura.toFixed(2)} / 15`);
  mdLines.push('');
  if (fails.length > 0) {
    mdLines.push('## Casos fallados');
    mdLines.push('');
    for (const f of fails) {
      mdLines.push(`- **${f.id}** (${f.nivel}/${f.discapacidad}/${f.materia}) — score=${f.score_total.toFixed(1)} ${f.error ? `ERROR: ${f.error}` : ''}`);
    }
    mdLines.push('');
  }
  if (stereoFlags.length > 0) {
    mdLines.push('## Violaciones de estereotipo detectadas');
    mdLines.push('');
    for (const s of stereoFlags) {
      mdLines.push(`- **${s.id}** — ${s.judge_parsed?.comentario_general ?? 'sin comentario'}`);
    }
  }
  const mdPath = join(RESULTS_DIR, `run-${ts}.summary.md`);
  writeFileSync(mdPath, mdLines.join('\n'));

  // ---------- Consola final ----------

  console.log('');
  console.log(`${c.bold}Resumen:${c.reset}`);
  console.log(`  casos: ${results.length} (válidos ${valid.length}, fallos ${fails.length})`);
  console.log(`  relevancia:    ${dimAvgs.relevancia.toFixed(2)} / 25`);
  console.log(`  accesibilidad: ${dimAvgs.accesibilidad.toFixed(2)} / 20`);
  console.log(`  adecuacion:    ${dimAvgs.adecuacion.toFixed(2)} / 25`);
  console.log(`  diversidad:    ${dimAvgs.diversidad.toFixed(2)} / 15`);
  console.log(`  estructura:    ${dimAvgs.estructura.toFixed(2)} / 15`);
  const scoreColor = avg >= THRESHOLD ? c.green : avg >= 75 ? c.yellow : c.red;
  console.log(`  ${c.bold}score promedio: ${scoreColor}${avg.toFixed(2)}${c.reset} / 100 (umbral ${THRESHOLD})`);
  if (stereoFlags.length > 0) {
    console.log(`  ${c.magenta}violaciones de estereotipo: ${stereoFlags.length}${c.reset}`);
  }
  console.log(`  ${c.dim}resultados: ${jsonPath}${c.reset}`);
  console.log(`  ${c.dim}summary:    ${mdPath}${c.reset}`);

  if (avg < THRESHOLD) {
    console.log(`\n${c.red}FAIL — score por debajo de ${THRESHOLD}.${c.reset}`);
    process.exit(1);
  } else {
    console.log(`\n${c.green}PASS.${c.reset}`);
  }
}

main().catch((err) => {
  console.error(`${c.red}[evals] crashed:${c.reset}`, err);
  process.exit(2);
});

/**
 * Tests del agente v2.1 con multimedia
 *
 * Requiere vitest (no está instalado por default). Para correr:
 *   npm install -D vitest
 *   npx vitest run tests/agente-multimedia.test.ts
 *
 * Los tests marcados con `.skip` requieren ANTHROPIC_API_KEY y UNSPLASH_ACCESS_KEY
 * en el entorno, ya que llaman a APIs reales. Para correrlos:
 *   ANTHROPIC_API_KEY=sk-... UNSPLASH_ACCESS_KEY=... npx vitest run tests/agente-multimedia.test.ts -t 'integration'
 */

import { describe, it, expect } from 'vitest';
import {
  GuiaPedagogicaSchema,
  type GuiaPedagogica,
} from '@/lib/schemas/guia-schema';
import { enriquecerImagen } from '@/lib/servicios/unsplash';
import { enriquecerVideo } from '@/lib/servicios/videos';
import { anthropic, CLAUDE_MODEL_V2 } from '@/lib/anthropic';
import { buildPromptDocentesV2 } from '@/lib/prompts';
import type { FormularioConsulta } from '@/lib/types';

// Caso de prueba fijo — biomas de América Latina en primaria especial
const casoBiomas: FormularioConsulta = {
  nivel_id: 'especial',
  subnivel_id: 'especial_primario',
  anio_grado: '2° ciclo',
  materia: 'Área de Ciencias Naturales',
  contenido:
    'Conocer biomas de America Latina, con ilustraciones y recomendaciones de videos',
  discapacidades: ['intelectual'],
  cantidad_alumnos: 1,
  situacion_apoyo: 'sin_apoyo',
  contexto_aula: 'un alumno',
  objetivo_clase: 'que se pueda concentrar',
};

// Helper para generar guía real (integration — requiere ANTHROPIC_API_KEY)
async function generarGuiaTest(
  form: FormularioConsulta
): Promise<GuiaPedagogica> {
  const response = await anthropic.messages.create({
    model: CLAUDE_MODEL_V2,
    max_tokens: 8000,
    messages: [{ role: 'user', content: buildPromptDocentesV2(form) }],
  });
  const raw =
    response.content[0]?.type === 'text' ? response.content[0].text : '';
  const first = raw.indexOf('{');
  const last = raw.lastIndexOf('}');
  const json = JSON.parse(raw.slice(first, last + 1));
  return GuiaPedagogicaSchema.parse(json);
}

describe('Agente v2.1 con multimedia', () => {
  describe('schema', () => {
    it('acepta una guía mínima válida', () => {
      const minimal = {
        version: '2.1',
        generadaEn: new Date().toISOString(),
        vistaRapida: { titulo: 'Test', resumen: 'Resumen breve.' },
        conceptosClave: [
          {
            nombre: 'Selva',
            descripcionCorta: 'Bioma húmedo y cálido',
            imagen: {
              tipo: 'unsplash',
              query: 'amazon rainforest',
              alt: 'Selva amazónica',
            },
            color: 'selva',
          },
          {
            nombre: 'Desierto',
            descripcionCorta: 'Bioma árido',
            imagen: {
              tipo: 'unsplash',
              query: 'atacama desert',
              alt: 'Desierto de Atacama',
            },
            color: 'desierto',
          },
        ],
        estrategias: [
          {
            numero: 1,
            tipo: 'manipulativa',
            titulo: 'Carpeta de biomas',
            subtitulo: 'Material concreto · 30 min',
            pasos: [
              { texto: 'Paso uno' },
              { texto: 'Paso dos' },
              { texto: 'Paso tres' },
            ],
            porQueFunciona: 'Ancla por repetición visual',
          },
          {
            numero: 2,
            tipo: 'visual',
            titulo: 'Mapa coloreado',
            subtitulo: 'Individual · 20 min',
            pasos: [
              { texto: 'Imprimir mapa' },
              { texto: 'Pintar zonas' },
              { texto: 'Pegar fotos' },
            ],
            porQueFunciona: 'Acción motora sostiene atención',
          },
          {
            numero: 3,
            tipo: 'audiovisual',
            titulo: 'Video con pausas',
            subtitulo: 'Individual · 5 min',
            pasos: [
              { texto: 'Buscar video' },
              { texto: 'Pausar' },
              { texto: 'Preguntar' },
            ],
            porQueFunciona: 'Mantiene atención activa',
          },
        ],
        videos: [
          {
            titulo: 'La Amazonia en 3 minutos',
            duracion: '3 min',
            fuente: 'youtube',
            queryBusqueda: 'Amazonia Nat Geo Español',
            descripcion: 'Recorrido visual por la selva',
            thumbnailHint: 'selva',
          },
          {
            titulo: 'Desierto de Atacama',
            duracion: '2 min',
            fuente: 'youtube',
            queryBusqueda: 'Atacama desert drone',
            descripcion: 'Vuelo aéreo sobre el desierto',
            thumbnailHint: 'desierto',
          },
        ],
        materiales: [
          {
            nombre: 'Carpeta de biomas',
            descripcion: '3 hojas A4 con foto + nombre + frase',
            tiempoPreparacion: '30 minutos',
          },
          {
            nombre: 'Tarjetas de emparejamiento',
            descripcion: '9 tarjetas de cartón',
            tiempoPreparacion: '20 minutos',
          },
        ],
        criteriosEvaluacion: [
          { criterio: 'Reconoce 3 biomas', nivelEsperado: 'consolidado' },
          { criterio: 'Asocia bioma con animal', nivelEsperado: 'en_proceso' },
          { criterio: 'Participa en actividades', nivelEsperado: 'consolidado' },
          { criterio: 'Completa carpeta', nivelEsperado: 'inicial' },
        ],
        tipsComunicacion: [
          { usar: 'Foto + nombre', evitar: 'Definiciones abstractas' },
          { usar: 'Pregunta cerrada', evitar: 'Pregunta abierta larga' },
          { usar: 'Señalar', evitar: 'Exigir oración completa' },
        ],
        erroresComunes: [
          {
            titulo: 'Reemplazar contenido',
            descripcion: 'No se debe cambiar el tema por otro más fácil',
          },
          {
            titulo: 'Video largo',
            descripcion: 'No usar videos de más de 5 minutos sin pausa',
          },
        ],
      };
      expect(() => GuiaPedagogicaSchema.parse(minimal)).not.toThrow();
    });

    it('rechaza guía con <2 conceptos clave', () => {
      const invalid = {
        version: '2.1',
        generadaEn: new Date().toISOString(),
        vistaRapida: { titulo: 'T', resumen: 'R' },
        conceptosClave: [],
        estrategias: [],
        videos: [],
        materiales: [],
        criteriosEvaluacion: [],
        tipsComunicacion: [],
        erroresComunes: [],
      };
      expect(() => GuiaPedagogicaSchema.parse(invalid)).toThrow();
    });
  });

  describe('servicios', () => {
    it('enriquecerVideo arma urlBusqueda desde queryBusqueda', async () => {
      const out = await enriquecerVideo({
        titulo: 'X',
        duracion: '3 min',
        fuente: 'youtube',
        queryBusqueda: 'biomas latinoamerica',
        descripcion: 'd',
        thumbnailHint: 'selva',
      });
      expect(out.urlBusqueda).toBe(
        'https://www.youtube.com/results?search_query=biomas%20latinoamerica'
      );
      expect(out.verificado).toBe(false);
    });

    it('enriquecerVideo con embedId marca verificado y arma embed', async () => {
      const out = await enriquecerVideo({
        titulo: 'X',
        duracion: '3 min',
        fuente: 'youtube',
        queryBusqueda: 'q',
        embedId: 'dQw4w9WgXcQ',
        descripcion: 'd',
        thumbnailHint: 'selva',
      });
      expect(out.verificado).toBe(true);
      expect(out.urlEmbed).toBe(
        'https://www.youtube.com/embed/dQw4w9WgXcQ'
      );
      expect(out.thumbnail).toBe(
        'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg'
      );
    });

    it('enriquecerImagen sin UNSPLASH_ACCESS_KEY devuelve ref tal cual', async () => {
      const originalKey = process.env.UNSPLASH_ACCESS_KEY;
      delete process.env.UNSPLASH_ACCESS_KEY;
      try {
        const out = await enriquecerImagen({
          tipo: 'unsplash',
          query: 'x',
          alt: 'y',
        });
        expect(out.urls).toBeUndefined();
      } finally {
        if (originalKey) process.env.UNSPLASH_ACCESS_KEY = originalKey;
      }
    });
  });

  // ========================================================
  // Integration tests — requieren ANTHROPIC_API_KEY real
  // Por defecto se saltean; correr explícitamente con:
  //   npx vitest run -t 'integration'
  // ========================================================
  describe.skip('integration (requiere API keys)', () => {
    it('debe devolver JSON válido según schema', async () => {
      const guia = await generarGuiaTest(casoBiomas);
      expect(() => GuiaPedagogicaSchema.parse(guia)).not.toThrow();
    });

    it('todas las imágenes deben tener query en inglés', async () => {
      const guia = await generarGuiaTest(casoBiomas);
      guia.conceptosClave.forEach((c) => {
        expect(c.imagen.query).toMatch(/^[a-zA-Z0-9\s-]+$/);
      });
    });

    it('todos los videos deben durar menos de 5 minutos', async () => {
      const guia = await generarGuiaTest(casoBiomas);
      guia.videos.forEach((v) => {
        const minutos = parseInt(v.duracion, 10);
        expect(minutos).toBeLessThanOrEqual(5);
      });
    });

    it('no debe inventar URLs de YouTube sin embedId', async () => {
      const guia = await generarGuiaTest(casoBiomas);
      guia.videos.forEach((v) => {
        if (v.url) {
          expect(v.embedId).toBeDefined();
        }
      });
    });

    it('las imágenes se enriquecen con URLs de Unsplash', async () => {
      const guia = await generarGuiaTest(casoBiomas);
      const concepto = guia.conceptosClave[0];
      const enriquecida = await enriquecerImagen(concepto.imagen);
      expect(enriquecida.urls?.regular).toMatch(
        /^https:\/\/images\.unsplash\.com/
      );
    });
  });
});

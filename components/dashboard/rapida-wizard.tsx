'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { GuideView } from './guide-view';
import { consumirSSE } from './sse';

export function RapidaWizard() {
  const router = useRouter();
  const [pregunta, setPregunta] = useState('');
  const [generating, setGenerating] = useState(false);
  const [streamText, setStreamText] = useState('');
  const [consultaId, setConsultaId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (pregunta.trim().length < 10) {
      setError('Contanos un poco más (mín. 10 caracteres).');
      return;
    }
    setError(null);
    setGenerating(true);
    setStreamText('');
    setConsultaId(null);

    let acumulado = '';
    let streamError: string | null = null;
    try {
      const res = await fetch('/api/generar-guia-rapida', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pregunta }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Error generando la respuesta');
      }
      await consumirSSE(res, {
        onDelta: (t) => {
          acumulado += t;
          setStreamText(acumulado);
        },
        onDone: (id) => setConsultaId(id),
        onError: (msg) => {
          streamError = msg;
        },
      });
      if (streamError) setError(streamError);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error inesperado');
    }
  }

  if (generating) {
    return (
      <div className="flex flex-col gap-6">
        {error && <Alert variant="error">{error}</Alert>}
        {streamText ? (
          <GuideView markdown={streamText} />
        ) : (
          <Card>
            <CardContent className="flex items-center gap-3 p-8 text-muted">
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
              <p>Pensando tu respuesta…</p>
            </CardContent>
          </Card>
        )}
        {consultaId && (
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => router.push('/inicio')}>
              Ir al inicio
            </Button>
            <Button onClick={() => router.push(`/resultado?id=${consultaId}`)}>
              Ver completa →
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {error && <Alert variant="error">{error}</Alert>}
      <Card>
        <CardContent className="flex flex-col gap-3 p-6">
          <label htmlFor="q" className="text-sm font-medium text-primary">
            Tu situación en una oración
          </label>
          <textarea
            id="q"
            value={pregunta}
            onChange={(e) => setPregunta(e.target.value)}
            rows={4}
            placeholder="Ej: Odontólogo, paciente TEA 6 años, primera consulta, padre refiere que no tolera jeringas. ¿Cómo empiezo?"
            className="min-h-[140px] w-full rounded-[10px] border border-border bg-card p-3 text-base"
            maxLength={500}
            autoFocus
          />
          <p className="text-right text-xs text-muted">
            {pregunta.length} / 500
          </p>
        </CardContent>
      </Card>
      <Button onClick={submit} size="lg" variant="cta" className="w-full">
        ⚡ Responder ahora
      </Button>
    </div>
  );
}

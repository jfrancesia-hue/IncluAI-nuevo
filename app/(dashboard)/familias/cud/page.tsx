import Link from 'next/link';
import { PASOS_CUD } from '@/data/cud-pasos';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata = { title: 'Trámite CUD · IncluIA' };

export default function CUDPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <span className="inline-flex items-center gap-2 rounded-full bg-accent-light px-3 py-1 text-xs font-medium text-accent">
          📋 Guía paso a paso
        </span>
        <h1 className="mt-2 text-3xl text-primary">Tramitar el CUD</h1>
        <p className="text-muted">
          El <strong>Certificado Único de Discapacidad</strong> es la puerta de entrada a las
          prestaciones de la Ley 24.901. Es gratuito y se tramita en tu provincia.
        </p>
      </header>

      <aside className="rounded-[14px] border border-accent-light bg-accent-light/50 p-5 text-sm">
        <p className="font-semibold text-accent">💡 En resumen</p>
        <p className="mt-1 text-primary/80">
          Necesitás un <strong>informe médico reciente</strong>, pedir turno con la{' '}
          <strong>junta evaluadora</strong> de tu provincia, asistir a la evaluación y recibir el
          certificado. Todo el trámite es <strong>gratuito</strong>.
        </p>
      </aside>

      <ol className="flex flex-col gap-3">
        {PASOS_CUD.map((paso) => (
          <li key={paso.numero}>
            <Card>
              <CardContent className="flex gap-4 p-5">
                <div
                  aria-hidden
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-serif text-lg font-bold text-white"
                >
                  {paso.numero}
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <h2 className="font-serif text-lg font-bold text-primary">{paso.titulo}</h2>
                  <p className="text-sm text-foreground">{paso.descripcion}</p>
                  {paso.docs && (
                    <div className="rounded-[10px] border border-border bg-background p-3 text-xs">
                      <p className="mb-1 font-semibold text-muted uppercase tracking-wide">
                        Documentación
                      </p>
                      <ul className="flex flex-col gap-0.5 text-foreground">
                        {paso.docs.map((d) => (
                          <li key={d}>• {d}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {paso.tip && (
                    <p className="rounded-[10px] bg-primary-bg p-3 text-xs text-primary">
                      💡 <strong>Tip:</strong> {paso.tip}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ol>

      <Card>
        <CardContent className="flex flex-col gap-3 p-6">
          <h3 className="font-serif text-lg font-bold text-primary">Enlaces oficiales</h3>
          <ul className="flex flex-col gap-1 text-sm">
            <li>
              <a
                href="https://www.argentina.gob.ar/andis/cud"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                ANDIS — Cómo tramitar el CUD →
              </a>
            </li>
            <li>
              <a
                href="https://www.argentina.gob.ar/servicios/juntas-evaluadoras-del-cud"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Buscar junta evaluadora por provincia →
              </a>
            </li>
            <li>
              <a
                href="https://www.argentina.gob.ar/normativa/nacional/ley-24901-47677"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Ley 24.901 — Prestaciones básicas →
              </a>
            </li>
          </ul>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button asChild variant="outline">
          <Link href="/recursos?publico=familia">Ver más recursos</Link>
        </Button>
        <Button asChild>
          <Link href="/familias/nueva-consulta">+ Generar guía familiar</Link>
        </Button>
      </div>
    </div>
  );
}

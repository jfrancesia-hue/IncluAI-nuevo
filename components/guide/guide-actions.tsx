'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

type Props = {
  markdown: string;
  titulo: string;
};

export function GuideActions({ markdown, titulo }: Props) {
  const [copied, setCopied] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // noop
    }
  }

  function compartirWhatsApp() {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = encodeURIComponent(
      `${titulo}\n\nGuía inclusiva generada con IncluAI 🧩\n${url}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  }

  async function compartirNativo() {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: titulo,
          text: 'Guía inclusiva de IncluAI',
          url: window.location.href,
        });
      } catch {
        // usuario canceló — ignorar
      }
    } else {
      await copiar();
    }
  }

  return (
    <div className="flex flex-wrap gap-2" data-no-print>
      <Button variant="outline" onClick={copiar}>
        {copied ? '✓ Copiado' : '📋 Copiar texto'}
      </Button>
      <Button variant="outline" onClick={() => window.print()}>
        🖨️ Imprimir / Guardar PDF
      </Button>
      <Button variant="outline" onClick={compartirWhatsApp}>
        💬 WhatsApp
      </Button>
      {typeof navigator !== 'undefined' && 'share' in navigator && (
        <Button variant="outline" onClick={compartirNativo}>
          🔗 Compartir
        </Button>
      )}
    </div>
  );
}

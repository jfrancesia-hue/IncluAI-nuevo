import 'server-only';
import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'IncluIA <noreply@inclua.com.ar>';

const resend = apiKey ? new Resend(apiKey) : null;

export function emailHabilitado(): boolean {
  return resend !== null;
}

type BienvenidaInput = {
  to: string;
  nombre: string;
};

export async function enviarBienvenida({ to, nombre }: BienvenidaInput) {
  if (!resend) {
    console.warn('[email] RESEND_API_KEY no definida — se omite bienvenida');
    return { ok: false, skipped: true as const };
  }

  const { error } = await resend.emails.send({
    from: fromEmail,
    to,
    subject: '¡Bienvenida a IncluIA! 🧩',
    html: `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 560px; margin: 0 auto; color: #1a2332;">
        <h1 style="color: #1e3a5f; font-family: Georgia, serif;">¡Hola, ${escapeHtml(nombre)}!</h1>
        <p>Gracias por sumarte a <strong>IncluIA</strong>.</p>
        <p>Con tu cuenta Gratuita podés generar <strong>2 guías inclusivas por mes</strong>, cubriendo todos los niveles educativos y discapacidades del sistema argentino.</p>
        <p style="margin-top: 24px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL ?? 'https://inclua.com.ar'}/inicio"
             style="display: inline-block; background: #16a34a; color: white; padding: 12px 20px; border-radius: 10px; text-decoration: none; font-weight: 600;">
            Crear mi primera guía →
          </a>
        </p>
        <p style="margin-top: 32px; color: #64748b; font-size: 13px;">
          IncluIA — Hecho en Argentina 🇦🇷
        </p>
      </div>
    `,
  });

  if (error) {
    console.error('[email] error enviando bienvenida', error);
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    c === '&'
      ? '&amp;'
      : c === '<'
        ? '&lt;'
        : c === '>'
          ? '&gt;'
          : c === '"'
            ? '&quot;'
            : '&#39;'
  );
}

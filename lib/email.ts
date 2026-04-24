import 'server-only';
import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'IncluAI <noreply@incluai.com.ar>';
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://incluai.com.ar';

const resend = apiKey ? new Resend(apiKey) : null;

export function emailHabilitado(): boolean {
  return resend !== null;
}

type TipoUsuario = 'docente' | 'familia' | 'profesional';

type BienvenidaInput = {
  to: string;
  nombre: string;
  tipoUsuario?: TipoUsuario;
};

type Perfilado = {
  saludo: string;
  intro: string;
  ctaLabel: string;
  ctaPath: string;
  siguientes: Array<{ titulo: string; descripcion: string }>;
};

const PERFILADO: Record<TipoUsuario, Perfilado> = {
  docente: {
    saludo: '¡Bienvenida/o al equipo, profe!',
    intro:
      'Vas a poder generar guías pedagógicas inclusivas adaptadas a tu aula: DUA, ajustes razonables y recursos listos para usar en clase.',
    ctaLabel: 'Crear mi primera guía',
    ctaPath: '/nueva-consulta',
    siguientes: [
      {
        titulo: 'Planificá una clase inclusiva',
        descripcion:
          'Cargá nivel, materia, contenido y discapacidades presentes. En menos de 1 minuto tenés la guía lista.',
      },
      {
        titulo: 'Generá un PPI estructurado',
        descripcion:
          'Plan Pedagógico Individual con formato oficial, listo para imprimir o compartir con el equipo.',
      },
      {
        titulo: 'Descargá tus guías en PDF',
        descripcion:
          'Guardá tus favoritas y exportalas para compartir con colegas o el equipo directivo.',
      },
    ],
  },
  familia: {
    saludo: '¡Bienvenida/o a IncluAI!',
    intro:
      'Acá vas a encontrar guías prácticas para acompañar a tu hijo o hija en casa, con un tono cálido y acciones concretas para cada día.',
    ctaLabel: 'Pedir mi primera guía',
    ctaPath: '/familias',
    siguientes: [
      {
        titulo: 'Resolvé una situación puntual',
        descripcion:
          'Contanos la situación específica y te damos estrategias ejecutables, incluso cuando están agotados.',
      },
      {
        titulo: 'Entendé el marco normativo',
        descripcion:
          'Referencias a la Ley 24.901 y 26.378, con lenguaje claro y aplicable.',
      },
      {
        titulo: 'Guardá tus recursos',
        descripcion:
          'Podés marcar guías como favoritas para volver a consultarlas cuando las necesites.',
      },
    ],
  },
  profesional: {
    saludo: '¡Bienvenido/a, colega!',
    intro:
      'IncluAI te ayuda a adaptar consultas, evaluaciones y protocolos a pacientes con discapacidad, con marco normativo argentino y recursos validados.',
    ctaLabel: 'Generar mi primera consulta',
    ctaPath: '/profesionales/nueva-consulta',
    siguientes: [
      {
        titulo: 'Adaptá evaluaciones y abordajes',
        descripcion:
          'Consultas estructuradas según especialidad, contexto de atención y edad del paciente.',
      },
      {
        titulo: 'Protocolos paso a paso',
        descripcion:
          'Guías con referencias clínicas, estrategias diferenciales y marco normativo aplicable.',
      },
      {
        titulo: 'Guías rápidas para consulta express',
        descripcion:
          'Cuando tenés poco tiempo, accedé a guías sintéticas de 2-3 minutos de lectura.',
      },
    ],
  },
};

export async function enviarBienvenida({
  to,
  nombre,
  tipoUsuario = 'docente',
}: BienvenidaInput) {
  if (!resend) {
    console.warn('[email] RESEND_API_KEY no definida — se omite bienvenida');
    return { ok: false, skipped: true as const };
  }

  const p = PERFILADO[tipoUsuario];
  const nombreSafe = escapeHtml(nombre);
  const ctaHref = `${appUrl}${p.ctaPath}`;
  const subjectBase = p.saludo.replace(/[¡!]/g, '').trim();

  const siguientesHtml = p.siguientes
    .map(
      (s) => `
        <li style="margin-bottom: 14px; padding-left: 0;">
          <strong style="color: #1F2E3D; font-size: 15px;">${escapeHtml(s.titulo)}</strong><br>
          <span style="color: #4A5968; font-size: 14px; line-height: 1.5;">${escapeHtml(s.descripcion)}</span>
        </li>`
    )
    .join('');

  const { error } = await resend.emails.send({
    from: fromEmail,
    to,
    subject: `${subjectBase} — empezá con IncluAI`,
    html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenida a IncluAI</title>
</head>
<body style="margin: 0; padding: 0; background: #FBF8F2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #1F2E3D;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #FBF8F2; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width: 560px; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(31,46,61,0.06);">
          <tr>
            <td style="padding: 40px 40px 8px;">
              <div style="font-size: 13px; font-weight: 600; letter-spacing: 0.04em; color: #2E86C1; text-transform: uppercase;">IncluAI</div>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 40px 0;">
              <h1 style="margin: 0; font-size: 26px; line-height: 1.2; font-weight: 600; color: #1F2E3D;">
                ${escapeHtml(p.saludo)} ${nombreSafe === '' ? '' : nombreSafe + ','}
              </h1>
              <p style="margin: 16px 0 0; font-size: 16px; line-height: 1.6; color: #1F2E3D;">
                ${escapeHtml(p.intro)}
              </p>
              <p style="margin: 16px 0 0; font-size: 15px; line-height: 1.6; color: #4A5968;">
                Con tu cuenta <strong>Gratuita</strong> podés generar guías mensuales sin costo, con acceso a todos los niveles y discapacidades del sistema argentino.
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 32px 40px 8px;">
              <a href="${ctaHref}" style="display: inline-block; background: #2E86C1; color: #ffffff; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 15px;">
                ${escapeHtml(p.ctaLabel)} →
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px 8px;">
              <h2 style="margin: 0 0 16px; font-size: 17px; font-weight: 600; color: #1F2E3D;">Qué podés hacer ahora</h2>
              <ul style="margin: 0; padding: 0; list-style: none;">
                ${siguientesHtml}
              </ul>
            </td>
          </tr>
          <tr>
            <td style="padding: 16px 40px 32px;">
              <div style="background: #F2ECE0; border-radius: 12px; padding: 18px 20px;">
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #4A5968;">
                  <strong style="color: #1F2E3D;">Importante:</strong> las guías son orientativas y acompañan tu criterio profesional. No reemplazan diagnóstico ni prescripción. Más detalles en nuestros <a href="${appUrl}/terminos" style="color: #2E86C1;">términos</a>.
                </p>
              </div>
            </td>
          </tr>
        </table>

        <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width: 560px; margin-top: 20px;">
          <tr>
            <td align="center" style="padding: 16px; font-size: 12px; color: #4A5968; line-height: 1.6;">
              IncluAI — Nativos Consultora Digital · Catamarca, Argentina 🇦🇷<br>
              <a href="${appUrl}/privacidad" style="color: #4A5968; text-decoration: underline;">Privacidad</a>
              &nbsp;·&nbsp;
              <a href="${appUrl}/terminos" style="color: #4A5968; text-decoration: underline;">Términos</a>
              &nbsp;·&nbsp;
              <a href="mailto:soporte@nativosconsultora.com" style="color: #4A5968; text-decoration: underline;">Soporte</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
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

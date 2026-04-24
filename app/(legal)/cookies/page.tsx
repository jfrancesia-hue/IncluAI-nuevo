import type { Metadata } from 'next';
import { Section } from '../_components/section';

export const metadata: Metadata = {
  title: 'Política de cookies · IncluAI',
  description:
    'Qué cookies usa IncluAI, para qué sirven y cómo gestionarlas desde tu navegador.',
};

export default function CookiesPage() {
  return (
    <article className="prose prose-neutral max-w-none">
      <h1 className="mb-2 text-3xl font-semibold sm:text-4xl">
        Política de cookies
      </h1>
      <p className="mb-10 text-sm text-[#4A5968]">
        Última actualización: 24 de abril de 2026
      </p>

      <Section title="1. ¿Qué son las cookies?">
        <p>
          Las cookies son pequeños archivos que un sitio web guarda en tu
          navegador para recordar información entre visitas. Se usan para
          mantenerte autenticado, recordar preferencias y medir el uso del
          sitio.
        </p>
      </Section>

      <Section title="2. Qué cookies usamos">
        <p>
          IncluAI utiliza un conjunto reducido de cookies, agrupadas en las
          siguientes categorías:
        </p>

        <h3 className="mt-6 text-lg font-semibold">Cookies estrictamente necesarias</h3>
        <p>
          Son imprescindibles para que puedas iniciar sesión y usar el
          Servicio. Sin ellas la aplicación no funciona.
        </p>
        <ul>
          <li>
            <strong>Sesión de Supabase</strong> (
            <code>sb-*-auth-token</code>): autentica tu sesión. Expira al cerrar
            sesión o tras un período de inactividad.
          </li>
          <li>
            <strong>CSRF y estado de formularios</strong>: protege contra
            peticiones cruzadas no autorizadas.
          </li>
        </ul>

        <h3 className="mt-6 text-lg font-semibold">Cookies de rendimiento y analítica</h3>
        <p>
          Nos permiten medir cómo se usa el Servicio de forma agregada y
          anónima, para mejorarlo.
        </p>
        <ul>
          <li>
            <strong>Vercel Analytics</strong> y <strong>Speed Insights</strong>:
            registran latencias, páginas vistas y eventos de rendimiento sin
            identificarte personalmente.
          </li>
        </ul>

        <h3 className="mt-6 text-lg font-semibold">Cookies de terceros</h3>
        <p>
          Durante el proceso de pago, Mercado Pago puede instalar cookies
          propias para prevenir fraude y procesar tu transacción. Estas cookies
          están sujetas a la{' '}
          <a
            href="https://www.mercadopago.com.ar/ayuda/cookies_2485"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            política de cookies de Mercado Pago
          </a>
          .
        </p>
      </Section>

      <Section title="3. Cómo gestionar las cookies">
        <p>
          Podés aceptar, rechazar o borrar cookies desde la configuración de tu
          navegador:
        </p>
        <ul>
          <li>
            <a
              href="https://support.google.com/chrome/answer/95647"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Chrome
            </a>
          </li>
          <li>
            <a
              href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Firefox
            </a>
          </li>
          <li>
            <a
              href="https://support.apple.com/es-ar/guide/safari/sfri11471/mac"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Safari
            </a>
          </li>
          <li>
            <a
              href="https://support.microsoft.com/es-ar/microsoft-edge"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Edge
            </a>
          </li>
        </ul>
        <p className="mt-4">
          <strong>Importante:</strong> si desactivás las cookies estrictamente
          necesarias no vas a poder iniciar sesión ni usar el Servicio.
        </p>
      </Section>

      <Section title="4. Cambios en esta política">
        <p>
          Esta política puede actualizarse cuando cambie la infraestructura o
          los proveedores que utilizamos. Publicaremos la versión vigente en
          esta página, con la fecha de última actualización.
        </p>
      </Section>

      <Section title="5. Contacto">
        <p>
          Para consultas sobre cookies o privacidad:{' '}
          <a
            href="mailto:privacidad@nativosconsultora.com"
            className="underline"
          >
            privacidad@nativosconsultora.com
          </a>
        </p>
      </Section>
    </article>
  );
}


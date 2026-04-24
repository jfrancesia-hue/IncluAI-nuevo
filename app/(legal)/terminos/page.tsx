import type { Metadata } from 'next';
import { Section } from '../_components/section';

export const metadata: Metadata = {
  title: 'Términos y condiciones · IncluAI',
  description:
    'Términos y condiciones de uso de IncluAI, plataforma de educación inclusiva asistida por IA para Argentina.',
};

export default function TerminosPage() {
  return (
    <article className="prose prose-neutral max-w-none">
      <h1 className="mb-2 text-3xl font-semibold sm:text-4xl">
        Términos y condiciones
      </h1>
      <p className="mb-10 text-sm text-[#4A5968]">
        Última actualización: 24 de abril de 2026
      </p>

      <Section title="1. Aceptación de los términos">
        <p>
          Al registrarte o utilizar <strong>IncluAI</strong> (en adelante, “el
          Servicio”), aceptás estos Términos y condiciones. Si no estás de
          acuerdo, no uses el Servicio. El Servicio es operado por{' '}
          <strong>Nativos Consultora Digital</strong>, con domicilio en
          Catamarca, República Argentina (en adelante, “Nativos” o “nosotros”).
        </p>
      </Section>

      <Section title="2. Descripción del Servicio">
        <p>
          IncluAI es una plataforma digital que genera guías pedagógicas
          inclusivas, planes pedagógicos individuales (PPI) y recursos
          educativos mediante inteligencia artificial, destinada a docentes,
          familias y profesionales de apoyo. Las guías son{' '}
          <strong>orientativas y de asistencia profesional</strong>: no
          reemplazan el criterio del docente, el equipo interdisciplinario ni
          al profesional de salud tratante.
        </p>
      </Section>

      <Section title="3. Registro y cuenta">
        <ul>
          <li>
            Para usar el Servicio tenés que crear una cuenta con un email
            válido y verificar tu dirección.
          </li>
          <li>
            Sos responsable de mantener la confidencialidad de tus credenciales
            y de toda actividad realizada desde tu cuenta.
          </li>
          <li>
            Nos reservamos el derecho de suspender o dar de baja cuentas por
            uso indebido, fraude o violación de estos términos.
          </li>
        </ul>
      </Section>

      <Section title="4. Planes, pagos y facturación">
        <ul>
          <li>
            Ofrecemos un plan gratuito con cupo mensual y planes pagos (Pro e
            Institucional) con cupo ampliado y funcionalidades adicionales.
          </li>
          <li>
            Los pagos se procesan a través de <strong>Mercado Pago</strong>.
            Los precios están expresados en pesos argentinos (ARS) e incluyen
            los impuestos aplicables según normativa vigente.
          </li>
          <li>
            La suscripción es mensual y se renueva automáticamente, salvo
            cancelación antes del cierre del período en curso desde tu panel de
            usuario.
          </li>
          <li>
            El cupo no utilizado durante el mes no se acumula al mes siguiente.
          </li>
          <li>
            Si ocurre un error en la generación de una guía, no se consume tu
            cupo mensual.
          </li>
        </ul>
      </Section>

      <Section title="5. Uso aceptable">
        <p>No está permitido:</p>
        <ul>
          <li>
            Utilizar el Servicio para fines ilícitos, discriminatorios o
            contrarios a la dignidad de las personas con discapacidad.
          </li>
          <li>
            Cargar datos personales sensibles de terceros (estudiantes,
            pacientes) sin la correspondiente autorización de sus padres, madres,
            tutores o responsables legales.
          </li>
          <li>
            Hacer ingeniería inversa, scraping automatizado o intentar acceder
            a áreas restringidas del sistema.
          </li>
          <li>
            Compartir tu cuenta con terceros o revender las guías generadas
            como producto propio.
          </li>
        </ul>
      </Section>

      <Section title="6. Propiedad intelectual">
        <p>
          El software, la marca, el diseño y la arquitectura del prompt de
          IncluAI son propiedad de Nativos Consultora Digital. Las guías
          generadas para tu cuenta pueden ser usadas libremente por vos en tu
          tarea pedagógica, clínica o familiar, con cita de la fuente (“Guía
          generada con IncluAI”). No se permite su comercialización como
          contenido propio ni su publicación masiva sin autorización expresa.
        </p>
      </Section>

      <Section title="7. Limitación de responsabilidad">
        <ul>
          <li>
            IncluAI utiliza modelos de inteligencia artificial de terceros
            (Anthropic). Las guías pueden contener errores, omisiones o
            información desactualizada. <strong>El profesional usuario es
            responsable</strong> de revisar, validar y adaptar el contenido
            antes de aplicarlo.
          </li>
          <li>
            IncluAI no diagnostica, no prescribe tratamientos, no certifica
            trayectorias educativas integrales ni reemplaza el acto médico ni
            pedagógico.
          </li>
          <li>
            Nativos no se responsabiliza por decisiones pedagógicas, clínicas o
            familiares tomadas exclusivamente en base al contenido generado.
          </li>
          <li>
            El Servicio se presta “tal cual está”. Nos reservamos el derecho de
            modificarlo, actualizarlo o interrumpirlo con aviso razonable.
          </li>
        </ul>
      </Section>

      <Section title="8. Protección de datos personales">
        <p>
          El tratamiento de datos se rige por la{' '}
          <strong>Ley 25.326 de Protección de Datos Personales</strong> de la
          República Argentina y por nuestra{' '}
          <a href="/privacidad" className="underline">
            Política de Privacidad
          </a>
          , que forma parte integrante de estos Términos.
        </p>
      </Section>

      <Section title="9. Modificaciones">
        <p>
          Podemos actualizar estos Términos con aviso previo al email
          registrado. El uso continuado del Servicio tras la actualización
          implica la aceptación de la nueva versión.
        </p>
      </Section>

      <Section title="10. Ley aplicable y jurisdicción">
        <p>
          Estos Términos se rigen por las leyes de la República Argentina. Ante
          cualquier controversia, las partes se someten a los tribunales
          ordinarios de la Ciudad de San Fernando del Valle de Catamarca, con
          renuncia expresa a cualquier otro fuero que pudiera corresponder.
        </p>
      </Section>

      <Section title="11. Contacto">
        <p>
          Para consultas, reclamos o ejercicio de derechos sobre estos
          términos:{' '}
          <a
            href="mailto:legales@nativosconsultora.com"
            className="underline"
          >
            legales@nativosconsultora.com
          </a>
        </p>
      </Section>
    </article>
  );
}


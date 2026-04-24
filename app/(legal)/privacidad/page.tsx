import type { Metadata } from 'next';
import { Section } from '../_components/section';

export const metadata: Metadata = {
  title: 'Política de privacidad · IncluAI',
  description:
    'Política de privacidad de IncluAI. Cómo tratamos tus datos personales bajo la Ley 25.326 de Argentina.',
};

export default function PrivacidadPage() {
  return (
    <article className="prose prose-neutral max-w-none">
      <h1 className="mb-2 text-3xl font-semibold sm:text-4xl">
        Política de privacidad
      </h1>
      <p className="mb-10 text-sm text-[#4A5968]">
        Última actualización: 24 de abril de 2026
      </p>

      <Section title="1. Responsable del tratamiento">
        <p>
          El responsable del tratamiento de los datos personales es{' '}
          <strong>Nativos Consultora Digital</strong>, con domicilio en la
          Provincia de Catamarca, República Argentina. Contacto para asuntos de
          privacidad:{' '}
          <a href="mailto:privacidad@nativosconsultora.com" className="underline">
            privacidad@nativosconsultora.com
          </a>
          .
        </p>
        <p>
          Esta política se enmarca en la{' '}
          <strong>Ley 25.326 de Protección de Datos Personales</strong> y en
          las normas complementarias dictadas por la{' '}
          <strong>Agencia de Acceso a la Información Pública (AAIP)</strong>.
        </p>
      </Section>

      <Section title="2. Qué datos recopilamos">
        <p>Cuando usás IncluAI, recopilamos los siguientes datos:</p>
        <ul>
          <li>
            <strong>Datos de cuenta:</strong> nombre, apellido, email, provincia,
            localidad, nivel educativo, institución (texto libre), especialidad
            (para profesionales), tipo de usuario (docente, familia o
            profesional).
          </li>
          <li>
            <strong>Datos de consulta:</strong> contenido pedagógico que
            ingresás en cada formulario (nivel, materia, contenido, contexto
            del aula, discapacidades, situación de apoyo, etc.).
          </li>
          <li>
            <strong>Datos de uso:</strong> guías generadas, fecha, módulo,
            feedback en estrellas, guías favoritas.
          </li>
          <li>
            <strong>Datos de pago:</strong> plan contratado, estado, fechas de
            inicio y fin del período. <em>No almacenamos datos de tarjetas
            ni credenciales financieras</em>: el procesamiento lo realiza
            directamente Mercado Pago.
          </li>
          <li>
            <strong>Datos técnicos:</strong> dirección IP, user-agent, logs de
            sesión y métricas agregadas de uso del sitio.
          </li>
        </ul>
      </Section>

      <Section title="3. Finalidades del tratamiento">
        <ul>
          <li>Prestar el Servicio (generar guías, PPI, recursos).</li>
          <li>Gestionar tu cuenta, verificar tu email y autenticarte.</li>
          <li>Procesar pagos y facturación a través de Mercado Pago.</li>
          <li>
            Mejorar la calidad pedagógica de las guías mediante análisis
            estadísticos agregados y anonimizados.
          </li>
          <li>
            Enviar comunicaciones transaccionales (confirmación de cuenta, aviso
            de pago, cambios del Servicio).
          </li>
          <li>
            Cumplir obligaciones legales, fiscales y responder a autoridades
            competentes cuando corresponda.
          </li>
        </ul>
      </Section>

      <Section title="4. Base legal">
        <p>Tratamos tus datos sobre la base de:</p>
        <ul>
          <li>
            Tu <strong>consentimiento libre, expreso e informado</strong> al
            crear la cuenta.
          </li>
          <li>La ejecución del contrato de servicio.</li>
          <li>
            El cumplimiento de obligaciones legales, fiscales y contables.
          </li>
          <li>
            Intereses legítimos para la seguridad del Servicio y la mejora del
            producto, siempre que no prevalezcan tus derechos.
          </li>
        </ul>
      </Section>

      <Section title="5. Encargados y destinatarios">
        <p>
          Para operar el Servicio trabajamos con proveedores que pueden acceder
          a datos estrictamente necesarios para prestar su función:
        </p>
        <ul>
          <li>
            <strong>Supabase</strong> (Estados Unidos) — alojamiento de base de
            datos y autenticación.
          </li>
          <li>
            <strong>Vercel</strong> (Estados Unidos) — hosting de la
            aplicación.
          </li>
          <li>
            <strong>Anthropic</strong> (Estados Unidos) — generación de
            contenido mediante modelos de inteligencia artificial (Claude). Los
            prompts enviados no incluyen tu identidad personal.
          </li>
          <li>
            <strong>Mercado Pago</strong> (Argentina) — procesamiento de pagos.
          </li>
          <li>
            <strong>Resend</strong> (Estados Unidos) — envío de emails
            transaccionales.
          </li>
          <li>
            <strong>Upstash</strong> (Estados Unidos) — rate limiting y caché de
            sesión.
          </li>
        </ul>
        <p>
          Cada proveedor opera bajo sus propios términos y medidas de
          seguridad. La transferencia internacional se realiza con los recaudos
          previstos por la Ley 25.326 y su reglamentación.
        </p>
      </Section>

      <Section title="6. Datos de terceros (estudiantes, hijos/as, pacientes)">
        <p>
          Al cargar una consulta, es posible que ingreses información sobre
          estudiantes, hijos/as o pacientes. Como usuario del Servicio:
        </p>
        <ul>
          <li>
            Sos el <strong>responsable último</strong> por la información que
            cargás sobre terceros.
          </li>
          <li>
            Te pedimos que <strong>no ingreses nombres completos, DNI ni
            otros identificadores directos</strong> de los destinatarios
            finales de la guía.
          </li>
          <li>
            Te recomendamos usar iniciales, seudónimos o descripciones genéricas
            (“un alumno de 7 años con TEA”) en lugar de datos identificatorios.
          </li>
        </ul>
      </Section>

      <Section title="7. Plazo de conservación">
        <ul>
          <li>
            Conservamos tus datos mientras mantengas una cuenta activa.
          </li>
          <li>
            Si solicitás la baja, conservamos los datos imprescindibles para
            cumplir obligaciones legales (facturación, contabilidad) durante
            los plazos que la ley exige (hasta 10 años para facturación).
          </li>
          <li>
            Los logs técnicos se conservan por un máximo de 12 meses.
          </li>
        </ul>
      </Section>

      <Section title="8. Tus derechos (derechos ARCO)">
        <p>
          Como titular de los datos, tenés derecho a{' '}
          <strong>acceder, rectificar, cancelar y oponerte</strong> al
          tratamiento de tus datos personales. Podés ejercer estos derechos
          escribiendo a{' '}
          <a
            href="mailto:privacidad@nativosconsultora.com"
            className="underline"
          >
            privacidad@nativosconsultora.com
          </a>
          , adjuntando copia de tu documento de identidad para verificar tu
          titularidad.
        </p>
        <p>
          La <strong>AAIP</strong> es el organismo de control en Argentina y
          podés presentar reclamos ante ella si considerás que no se
          respetaron tus derechos. Más información:{' '}
          <a
            href="https://www.argentina.gob.ar/aaip"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            argentina.gob.ar/aaip
          </a>
          .
        </p>
      </Section>

      <Section title="9. Seguridad">
        <p>
          Aplicamos medidas técnicas y organizativas para proteger tus datos:
          cifrado en tránsito (TLS 1.3), cifrado en reposo, autenticación
          federada, control de accesos por Row Level Security, rate limiting y
          monitoreo de incidentes. Ningún sistema es infalible; si detectamos
          una brecha de seguridad significativa, te notificaremos conforme a la
          normativa aplicable.
        </p>
      </Section>

      <Section title="10. Menores de edad">
        <p>
          El Servicio está destinado a adultos profesionales o familiares
          adultos que trabajan con personas con discapacidad. No está dirigido a
          menores de edad, quienes no deben crear cuentas por sí mismos.
        </p>
      </Section>

      <Section title="11. Cambios en esta política">
        <p>
          Podemos actualizar esta política cuando lo consideremos necesario. Te
          avisaremos al email registrado con una antelación razonable de los
          cambios sustantivos.
        </p>
      </Section>
    </article>
  );
}


import { notFound } from 'next/navigation'
import type { PPISeccionKey } from '@/lib/types/ppi'
import { SECCIONES_ORDEN, SECCION_LABELS } from '@/lib/types/ppi'

export const dynamic = 'force-dynamic'

const EJEMPLO = {
  alumno_identificador: 'M.G.',
  alumno_edad: 9,
  alumno_nivel: 'primaria',
  alumno_anio_grado: '4° grado',
  institucion: 'Escuela N° 19 Bernardino Rivadavia',
  jurisdiccion: 'Provincia de Buenos Aires',
  norma_provincial: 'Res. 1664/2017 DGCyE',
  ciclo_lectivo: '2026',
  periodo: 'anual',
  docente: 'Prof. Laura Sánchez',
  familia: 'madre (S.G.) · 11-****-5432',
  requiere_lsa: false,
  generado_at: '2026-04-22T10:30:00Z',
  secciones: {
    datos_generales: {
      titulo: 'Datos generales',
      contenido:
        'El presente Proyecto Pedagógico Individual se elabora para el/la estudiante M.G. (9 años) que cursa 4° grado en la Escuela N° 19 Bernardino Rivadavia durante el ciclo lectivo 2026. La institución, en el marco de la Ley 26.206 y conforme a la Resolución CFE 311/16, garantiza su trayectoria educativa integral dentro del sistema de educación común. Este documento establece las configuraciones de apoyo, la priorización de contenidos, las adaptaciones metodológicas y los criterios de evaluación acordados por el equipo docente junto con la familia y el equipo de orientación escolar.',
    },
    fortalezas: {
      titulo: 'Fortalezas del estudiante',
      contenido:
        'M.G. presenta un interés genuino por la lectura de textos narrativos, especialmente aquellos vinculados a animales y naturaleza. Responde positivamente a las dinámicas grupales cuando se anticipan las consignas y se usan apoyos visuales. Muestra capacidad de memoria verbal destacada para canciones, poesías y rimas, lo que habilita múltiples rutas de acceso al currículum.',
      puntos: [
        'Alta receptividad al material visual estructurado (pictogramas, secuencias gráficas).',
        'Memoria verbal sólida: recuerda con facilidad canciones, poesías y consignas rítmicas.',
        'Interés sostenido por temas de ciencias naturales, especialmente animales.',
        'Buena respuesta al trabajo en parejas con compañeros/as estables.',
        'Capacidad de autorregulación cuando se ofrecen espacios de pausa anticipados.',
      ],
    },
    barreras: {
      titulo: 'Barreras para el aprendizaje y la participación',
      contenido:
        'Las barreras identificadas no se ubican en el estudiante sino en el entorno y las metodologías tradicionales. El aula presenta un alto nivel de estímulo auditivo durante los momentos de trabajo autónomo. Las consignas múltiples y extensas dificultan el acceso a las tareas, así como los cambios abruptos de actividad sin aviso previo. Estas barreras se pueden modificar con ajustes concretos en la organización del aula y en la presentación de la información.',
      puntos: [
        'Exceso de estímulo auditivo en momentos de trabajo individual.',
        'Consignas extensas o con múltiples pasos simultáneos.',
        'Cambios de actividad sin anticipación visual.',
        'Evaluaciones tradicionales de respuesta escrita extensa.',
      ],
    },
    apoyos: {
      titulo: 'Configuraciones de apoyo',
      contenido:
        'Conforme a la Resolución CFE 311/16, se implementan configuraciones de apoyo destinadas a garantizar el acceso, la permanencia y la participación efectiva en la trayectoria educativa. Estas configuraciones serán revisadas y ajustadas trimestralmente por el equipo docente junto con el equipo de orientación.',
      puntos: [
        'Agenda visual diaria pegada en el banco, que anticipe los cambios de actividad.',
        'Espacio de regulación dentro del aula con auriculares con cancelación de ruido.',
        'Fragmentación de consignas: máximo una instrucción por paso, con apoyo visual.',
        'Acompañamiento de pareja pedagógica durante 30 min dos veces por semana (articulación con equipo de integración).',
        'Uso de material concreto para la resolución de problemas matemáticos.',
      ],
    },
    contenidos_priorizados: {
      titulo: 'Contenidos curriculares priorizados',
      contenido:
        'Se prioriza el acceso funcional a los aprendizajes fundamentales del ciclo, manteniendo la propuesta curricular del grado pero adecuando profundidad y formas de evaluación. La priorización se realiza en acuerdo con el equipo docente del área.',
      puntos: [
        'Lengua: lectura comprensiva de textos narrativos breves, escritura funcional (lista, nota, mensaje).',
        'Matemática: sistema de numeración hasta el 1000, operaciones de suma y resta con material concreto.',
        'Ciencias Naturales: seres vivos y ambientes (área de interés personal).',
        'Ciencias Sociales: el barrio, la comunidad local, efemérides significativas.',
      ],
    },
    adaptaciones_metodologicas: {
      titulo: 'Adaptaciones metodológicas',
      contenido:
        'Las adaptaciones se centran en el cómo, no solo en el qué. Se trabajan en paralelo con el resto del grupo, evitando la exclusión o la diferenciación visible. Todas las actividades tienen múltiples rutas de acceso según el principio de Diseño Universal para el Aprendizaje (DUA).',
      puntos: [
        'Presentar todas las consignas de forma oral + visual (cartelitos con imágenes).',
        'Tiempo extendido (30% adicional) en producciones escritas.',
        'Permitir respuestas orales grabadas como alternativa a las escritas.',
        'Rotación previsible de compañeros de mesa (cambio cada 2 semanas, con aviso).',
        'Descomponer proyectos largos en entregas semanales más cortas.',
      ],
    },
    evaluacion: {
      titulo: 'Criterios y modalidad de evaluación',
      contenido:
        'La evaluación se orienta a documentar el proceso de aprendizaje de M.G. en relación a sus propios avances, no a la comparación con el grupo. Se privilegia la evaluación formativa continua por sobre instancias puntuales únicas. Los resultados se integran en el informe trimestral acompañado de evidencias concretas.',
      puntos: [
        'Rúbricas con criterios explícitos, compartidas anticipadamente con el estudiante.',
        'Evaluación oral complementaria en todas las áreas.',
        'Portfolio trimestral con producciones seleccionadas por el estudiante.',
        'Registro de observación sistemática del docente en grillas acordadas.',
      ],
    },
    acuerdos_familia: {
      titulo: 'Acuerdos con la familia',
      contenido:
        'La familia es parte activa del proceso. Se establecen canales de comunicación previsibles y espacios de encuentro formales para el seguimiento conjunto. La familia aporta información fundamental sobre el desempeño fuera del espacio escolar, que enriquece la mirada pedagógica.',
      puntos: [
        'Reunión mensual presencial entre docente y familia (primera semana del mes).',
        'Cuaderno de comunicaciones diario con observaciones breves.',
        'Canal de WhatsApp exclusivo para emergencias o ajustes urgentes.',
        'Entrevista con el equipo de orientación al cierre de cada trimestre.',
      ],
    },
    articulacion_equipo: {
      titulo: 'Articulación con equipo de apoyo externo',
      contenido:
        'M.G. cuenta con acompañamiento terapéutico de fonoaudiología (2 veces por semana) y terapia ocupacional (mensual). El equipo escolar se articula con los profesionales externos para garantizar coherencia entre las estrategias y compartir avances.',
      puntos: [
        'Envío trimestral de informe pedagógico a los profesionales externos.',
        'Reunión de equipo ampliado (escuela + terapeutas + familia) una vez por semestre.',
        'Protocolos compartidos de estrategias de comunicación.',
      ],
    },
    seguimiento_trimestral: {
      titulo: 'Plan de seguimiento trimestral',
      contenido:
        'El seguimiento se documenta cada trimestre mediante un informe que integra las voces del equipo docente, la familia y el estudiante. Cada trimestre se evalúan los acuerdos previos y se ajustan las estrategias.',
      puntos: [
        'Primer trimestre: evaluación diagnóstica integral + ajuste inicial del PPI.',
        'Segundo trimestre: evaluación formativa intermedia + revisión de metas curriculares.',
        'Tercer trimestre: evaluación acreditativa + proyección de pasaje a 5° grado + articulación con docente receptor.',
      ],
    },
  },
}

export default function PPIEjemploPage() {
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_ENABLE_DEMO !== '1') {
    notFound()
  }

  return (
    <>
      <style>{`
        @page { size: A4; margin: 22mm 18mm; }
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .ppi-page { box-shadow: none !important; border: none !important; }
        }
        body { background: #f4f5f7; }
        .ppi-page {
          max-width: 780px;
          margin: 24px auto;
          background: white;
          padding: 40px 48px;
          font-family: 'Inter', 'Times New Roman', serif;
          color: #111;
          line-height: 1.55;
          font-size: 12pt;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          border-radius: 8px;
        }
        .ppi-page h1 {
          font-size: 20pt;
          margin: 0 0 4px;
          letter-spacing: -0.01em;
          text-align: center;
          color: #042C53;
        }
        .ppi-page h2 {
          font-size: 13pt;
          margin: 22px 0 6px;
          border-bottom: 1px solid #042C53;
          padding-bottom: 2px;
          color: #042C53;
          page-break-after: avoid;
        }
        .ppi-header {
          text-align: center;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 2px solid #042C53;
        }
        .ppi-header .sub { font-size: 10pt; color: #5c6b7f; margin-top: 4px; }
        .ppi-datos {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 6px 24px;
          font-size: 11pt;
          margin: 12px 0 20px;
        }
        .ppi-datos dt { font-weight: 600; color: #042C53; }
        .ppi-datos dd { margin: 0; }
        .ppi-seccion ul { padding-left: 22px; margin: 6px 0; }
        .ppi-seccion li { margin-bottom: 4px; }
        .ppi-firmas {
          margin-top: 44px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
        }
        .ppi-firmas .firma {
          border-top: 1px solid #111;
          padding-top: 6px;
          font-size: 10pt;
          text-align: center;
        }
        .ppi-footer {
          margin-top: 40px;
          padding-top: 12px;
          border-top: 1px solid #ccc;
          font-size: 8.5pt;
          color: #5c6b7f;
          line-height: 1.4;
        }
        .no-print {
          position: sticky;
          top: 0;
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 12px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 10;
        }
        .no-print button, .no-print a {
          padding: 8px 16px;
          background: #042C53;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          text-decoration: none;
          font-size: 13px;
        }
      `}</style>

      <div className="no-print">
        <strong>PPI ejemplo — 4° grado, 9 años · Demo</strong>
        <a href="/ppi-demo">Volver al wizard</a>
      </div>

      <article className="ppi-page">
        <header className="ppi-header">
          <h1>Propuesta Pedagógica de Inclusión (PPI)</h1>
          <div className="sub">
            Conforme a Resolución CFE 311/16, Ley 26.206 y Ley 26.378 — {EJEMPLO.norma_provincial}
          </div>
          <div className="sub" style={{ marginTop: 8, fontWeight: 600 }}>
            {EJEMPLO.institucion} — {EJEMPLO.jurisdiccion} — Ciclo lectivo {EJEMPLO.ciclo_lectivo}
          </div>
        </header>

        <dl className="ppi-datos">
          <dt>Estudiante (identificación interna)</dt>
          <dd>
            {EJEMPLO.alumno_identificador} — <em>completar nombre a mano</em>
          </dd>
          <dt>Edad</dt>
          <dd>{EJEMPLO.alumno_edad} años</dd>
          <dt>Nivel</dt>
          <dd>{EJEMPLO.alumno_nivel}</dd>
          <dt>Año/Grado</dt>
          <dd>{EJEMPLO.alumno_anio_grado}</dd>
          <dt>Condición(es)</dt>
          <dd>Trastorno del Espectro Autista (TEA)</dd>
          <dt>Período</dt>
          <dd>{EJEMPLO.periodo}</dd>
          <dt>Docente responsable</dt>
          <dd>{EJEMPLO.docente}</dd>
          <dt>Fecha de elaboración</dt>
          <dd>{new Date(EJEMPLO.generado_at).toLocaleDateString('es-AR')}</dd>
          <dt>Familia/tutor responsable</dt>
          <dd>{EJEMPLO.familia}</dd>
        </dl>

        {SECCIONES_ORDEN.map((key: PPISeccionKey) => {
          const s = EJEMPLO.secciones[key as keyof typeof EJEMPLO.secciones]
          if (!s) return null
          return (
            <section key={key} className="ppi-seccion">
              <h2>{s.titulo || SECCION_LABELS[key]}</h2>
              {s.contenido && <p>{s.contenido}</p>}
              {'puntos' in s && s.puntos && s.puntos.length > 0 && (
                <ul>
                  {s.puntos.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              )}
            </section>
          )
        })}

        <div className="ppi-firmas">
          <div className="firma">
            {EJEMPLO.docente}
            <br />
            Docente responsable
          </div>
          <div className="firma">
            <br />
            Equipo directivo / Equipo de orientación escolar
          </div>
        </div>

        <footer className="ppi-footer">
          Documento generado con asistencia de IncluIA ({new Date().toLocaleDateString('es-AR')}).
          Requiere revisión, edición y firma del equipo docente y directivo.
          <br />
          <strong>Marco normativo nacional:</strong> Resolución CFE 311/16 (ejes prioritarios
          Anexo II), Ley 26.206 (Educación Nacional), Ley 26.378 (Convención sobre los Derechos
          de las Personas con Discapacidad), Ley 25.326 (Protección de Datos Personales).
          <br />
          <strong>Marco normativo provincial:</strong> {EJEMPLO.jurisdiccion} — {EJEMPLO.norma_provincial}.
          <br />
          <em>
            Este documento cumple los ejes prioritarios del Anexo II de la Res. CFE 311/16.
            Si tu jurisdicción exige un formulario específico adicional, podés usar este PPI
            como base para trasladar el contenido al formato requerido por tu institución.
          </em>
        </footer>
      </article>
    </>
  )
}

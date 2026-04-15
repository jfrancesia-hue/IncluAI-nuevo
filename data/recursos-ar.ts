export type Recurso = {
  titulo: string;
  url: string;
  descripcion: string;
  fuente: string;
  publico: Array<'docente' | 'familia' | 'profesional'>;
  discapacidades?: string[];
  niveles?: string[];
  tipo: 'portal' | 'guia' | 'ley' | 'herramienta' | 'tramite';
};

export const RECURSOS_AR: Recurso[] = [
  {
    titulo: 'Educ.ar — Educación Inclusiva',
    url: 'https://www.educ.ar/recursos/categorias/educacion-inclusiva',
    descripcion: 'Portal oficial del Ministerio de Educación Nacional con materiales y capacitaciones.',
    fuente: 'Ministerio de Educación de la Nación',
    publico: ['docente'],
    tipo: 'portal',
  },
  {
    titulo: 'Plataforma ABC — Cultura Inclusiva (GBA)',
    url: 'https://abc.gob.ar/secretarias/subsecretaria-de-educacion/modalidades/educacion-especial',
    descripcion: 'Dirección de Modalidad Especial, Provincia de Buenos Aires: resoluciones, diseños curriculares y acompañamiento.',
    fuente: 'Dirección General de Cultura y Educación — PBA',
    publico: ['docente'],
    tipo: 'portal',
  },
  {
    titulo: 'ARASAAC — Pictogramas gratuitos',
    url: 'https://arasaac.org/',
    descripcion: 'Más de 13.000 pictogramas en español bajo licencia libre para el aula y el hogar.',
    fuente: 'Gobierno de Aragón, España',
    publico: ['docente', 'familia', 'profesional'],
    discapacidades: ['tea', 'intelectual', 'lenguaje', 'dislexia'],
    tipo: 'herramienta',
  },
  {
    titulo: 'INADI — Discriminación y discapacidad',
    url: 'https://www.argentina.gob.ar/inadi',
    descripcion: 'Información, denuncias y asesoramiento sobre discriminación por motivos de discapacidad.',
    fuente: 'INADI',
    publico: ['docente', 'familia', 'profesional'],
    tipo: 'portal',
  },
  {
    titulo: 'ANDIS — Agencia Nacional de Discapacidad',
    url: 'https://www.argentina.gob.ar/andis',
    descripcion: 'Trámites CUD, pensiones no contributivas, prestaciones y normativa vigente.',
    fuente: 'ANDIS',
    publico: ['familia', 'profesional'],
    tipo: 'tramite',
  },
  {
    titulo: 'CUD — Cómo tramitarlo',
    url: 'https://www.argentina.gob.ar/andis/cud',
    descripcion: 'Paso a paso del Certificado Único de Discapacidad: requisitos, turnos, provincias.',
    fuente: 'ANDIS',
    publico: ['familia', 'profesional'],
    tipo: 'tramite',
  },
  {
    titulo: 'Ley 26.206 — Educación Nacional',
    url: 'https://www.argentina.gob.ar/normativa/nacional/ley-26206-123542',
    descripcion: 'Ley de Educación Nacional — garantiza inclusión desde Nivel Inicial.',
    fuente: 'InfoLEG',
    publico: ['docente'],
    tipo: 'ley',
  },
  {
    titulo: 'Resolución CFE 311/16',
    url: 'https://www.argentina.gob.ar/sites/default/files/res_cfe_311_16_0.pdf',
    descripcion: 'Promoción, acreditación, certificación y titulación de estudiantes con discapacidad.',
    fuente: 'Consejo Federal de Educación',
    publico: ['docente'],
    tipo: 'ley',
  },
  {
    titulo: 'Ley 24.901 — Sistema de Prestaciones Básicas',
    url: 'https://www.argentina.gob.ar/normativa/nacional/ley-24901-47677',
    descripcion: 'Marco de prestaciones: rehabilitación, educación, apoyo, transporte, AT, MAI.',
    fuente: 'InfoLEG',
    publico: ['familia', 'profesional'],
    tipo: 'ley',
  },
  {
    titulo: 'Ley 26.378 — Convención sobre Derechos de PCD',
    url: 'https://www.argentina.gob.ar/normativa/nacional/ley-26378-141317',
    descripcion: 'Convención internacional adoptada por Argentina (jerarquía constitucional desde 2014).',
    fuente: 'ONU / Argentina',
    publico: ['docente', 'familia', 'profesional'],
    tipo: 'ley',
  },
  {
    titulo: 'SND — Servicio Nacional de Rehabilitación',
    url: 'https://www.argentina.gob.ar/servicio-nacional-de-rehabilitacion',
    descripcion: 'Prestaciones de rehabilitación integral, apoyos técnicos, ayudas biomecánicas.',
    fuente: 'ANDIS',
    publico: ['familia', 'profesional'],
    tipo: 'portal',
  },
  {
    titulo: 'Asociación Argentina de Dislexia',
    url: 'https://disfam.org.ar/',
    descripcion: 'Información, orientación y marco legal para familias y docentes.',
    fuente: 'DISFAM Argentina',
    publico: ['docente', 'familia', 'profesional'],
    discapacidades: ['dislexia'],
    tipo: 'portal',
  },
  {
    titulo: 'TGD-Padres TEA',
    url: 'https://www.tgd-padres.com.ar/',
    descripcion: 'Red nacional de familias de niños con TEA: recursos, eventos, acompañamiento.',
    fuente: 'TGD-Padres',
    publico: ['familia'],
    discapacidades: ['tea'],
    tipo: 'portal',
  },
  {
    titulo: 'ASDRA — Síndrome de Down',
    url: 'https://www.asdra.org.ar/',
    descripcion: 'Asociación Síndrome de Down de la República Argentina: capacitaciones, grupos, derechos.',
    fuente: 'ASDRA',
    publico: ['docente', 'familia', 'profesional'],
    discapacidades: ['intelectual'],
    tipo: 'portal',
  },
  {
    titulo: 'FATEP — Lengua de Señas Argentina',
    url: 'https://www.confederaciondesordosargentina.org.ar/',
    descripcion: 'Confederación Argentina de Sordos: LSA, capacitación, intérpretes.',
    fuente: 'CAS',
    publico: ['docente', 'profesional'],
    discapacidades: ['hipoacusia'],
    tipo: 'portal',
  },
  {
    titulo: 'Tiflonexos — Textos accesibles',
    url: 'https://www.tiflonexos.org/',
    descripcion: 'Biblioteca digital accesible para personas ciegas o con baja visión.',
    fuente: 'Tiflonexos',
    publico: ['docente', 'familia'],
    discapacidades: ['visual'],
    tipo: 'herramienta',
  },
  {
    titulo: 'Fundación Par',
    url: 'https://www.fundacionpar.org.ar/',
    descripcion: 'Inclusión laboral, escolar y social de personas con discapacidad.',
    fuente: 'Fundación Par',
    publico: ['familia', 'profesional'],
    tipo: 'portal',
  },
  {
    titulo: 'REDI — Red por los Derechos PCD',
    url: 'https://www.redi.org.ar/',
    descripcion: 'Red de organizaciones que trabajan por los derechos humanos de PCD en Argentina.',
    fuente: 'REDI',
    publico: ['familia', 'profesional'],
    tipo: 'portal',
  },
  {
    titulo: 'CONADIS — Comisión Nacional (histórico)',
    url: 'https://www.argentina.gob.ar/andis',
    descripcion: 'Hoy integrada en ANDIS. Normativa y políticas públicas de discapacidad.',
    fuente: 'ANDIS',
    publico: ['docente', 'familia', 'profesional'],
    tipo: 'portal',
  },
  {
    titulo: 'JITT — Jornadas Interactivas Tecnológicas',
    url: 'https://jitt.educ.ar/',
    descripcion: 'Capacitaciones gratuitas en tecnología educativa inclusiva.',
    fuente: 'Educ.ar',
    publico: ['docente'],
    tipo: 'portal',
  },
];

export type PublicoRecurso = 'docente' | 'familia' | 'profesional';

export function filtrarRecursos(filtros: {
  publico?: PublicoRecurso;
  tipo?: Recurso['tipo'];
  discapacidad?: string;
}): Recurso[] {
  return RECURSOS_AR.filter((r) => {
    if (filtros.publico && !r.publico.includes(filtros.publico)) return false;
    if (filtros.tipo && r.tipo !== filtros.tipo) return false;
    if (filtros.discapacidad && r.discapacidades && !r.discapacidades.includes(filtros.discapacidad))
      return false;
    return true;
  });
}

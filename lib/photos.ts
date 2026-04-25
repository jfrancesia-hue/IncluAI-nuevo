/**
 * Fotos curadas para IncluAI — Pexels tiene mejor cobertura que Unsplash
 * en fotos reales de niños con discapacidad en contextos educativos,
 * terapéuticos y de inclusión. Todas con licencia Pexels (uso libre).
 *
 * Fuente: Pexels (gratis, con atribución opcional).
 * Para swap futuro: reemplazá la URL manteniendo la clave.
 */

const px = (id: string, w = 1400) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&fit=crop`;

export const PHOTOS = {
  // Hero: docente con grupo de niños en aula (no terapia 1-a-1)
  hero: px('8363102', 1600), // niños jugando con docente en aula

  // Niños en sesión de apoyo / inclusión
  action: px('8612995', 1400),

  // Pasos "cómo funciona" — más alineados al ciclo docente
  step1: px('5417659', 600), // docente preparando material/planificando
  step2: px('8363139', 600), // alumno con planificador visual (la guía generada)
  step3: px('8617553', 600), // dos alumnos colaborando (aplicar en aula)

  // Banner discapacidades / aula inclusiva
  classroom: px('8926887', 1600), // estudiantes diversos leyendo en biblioteca

  // Emocional close-up
  closeup: px('7869083', 1400), // docente y niños aprendiendo electrónica (warm + grupal)

  // Celebración / éxito de pago
  celebration: px('8364026', 1400), // niño alegre en sesión

  // Auth screens
  registro: px('6941093', 900), // niño participando activamente
  login: px('8364007', 900), // adulto ayudando con tablet

  // Wizard (3 pasos)
  wizardClase: px('5417659', 900), // docente preparando material
  wizardAlumno: px('8613090', 900), // sesión individual con niño
  wizardContexto: px('7592999', 900), // niño usando recurso adaptado

  // Header de guía generada
  guiaHeader: px('6146970', 800), // niño con material manipulativo

  // Paywall
  paywall: px('8364024', 600), // apoyo terapéutico

  // Banner planes
  planesHeader: px('8612995', 1400),

  // Loading accent
  loadingAccent: px('6146929', 600),

  // Avatar testimonio
  avatar: px('7092343', 200),

  // Wizard Familia (3 pasos)
  wizardFamilia1: px('8612931', 900),  // niño aprendiendo con ábaco (sobre tu hijo/a)
  wizardFamilia2: px('7269673', 900),  // madre e hijo jugando con juguetes educativos
  wizardFamilia3: px('7606004', 900),  // madre e hijo jugando juntos (contexto familiar)

  // Wizard Profesional (3 pasos)
  wizardProfesional1: px('8460035', 900), // consultorio pediátrico (tu práctica)
  wizardProfesional2: px('7653108', 900), // profesional con niño (sobre el paciente)
  wizardProfesional3: px('5336930', 900), // sesión de consejería (qué necesitás)

  // Dashboard inicio — CTA y decoración
  dashboardCta: px('8363102', 800),   // niños jugando con docente en aula
  dashboardEmpty: px('8613321', 600), // niños en actividad grupal

  // Módulo selector — fotos circulares por módulo
  moduloDocente: px('8422248', 400),     // docente sentada con niños en el piso
  moduloFamilia: px('8524996', 400),     // familia leyendo juntos en la cama
  moduloProfesional: px('8926900', 400), // profesional ayudando a estudiante

  // Historial — header
  historialHeader: px('8926887', 1200), // estudiantes leyendo en biblioteca

  // Recursos — header
  recursosHeader: px('7869083', 1200), // docente y niños aprendiendo electrónica

  // === Guide renderer v2 — fotos reales por sección ===
  // Header principal: escritorio docente con materiales
  guideHeroBackdrop: px('4145354', 1600), // manos trabajando con material concreto
  // Estrategias: una foto contextual por tipo
  strategyAgenda: px('8363139', 800),       // alumno con planificador visual
  strategyManipulativo: px('6256015', 800), // manos con bloques/material concreto
  strategyRitmo: px('5212339', 800),        // reloj / calma en aula
  strategyColaboracion: px('8617553', 800), // dos alumnos trabajando juntos
  strategyGenerica: px('5905927', 800),     // escena de aula inclusiva
  // Sección de recursos: fondo sutil
  recursosBackdrop: px('4144923', 1200),    // materiales sobre mesa
  // Coordinación: familia + docente
  coordinacionBackdrop: px('5905445', 1200),
} as const;

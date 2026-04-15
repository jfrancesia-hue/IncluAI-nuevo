// Pasos del trámite CUD (Certificado Único de Discapacidad) en Argentina.
// Fuente: https://www.argentina.gob.ar/andis/cud
// Nota: cada provincia tiene particularidades — link al portal provincial.

export type PasoCUD = {
  numero: number;
  titulo: string;
  descripcion: string;
  docs?: string[];
  tip?: string;
};

export const PASOS_CUD: PasoCUD[] = [
  {
    numero: 1,
    titulo: 'Reunir documentación médica',
    descripcion:
      'Obtener un informe médico reciente (≤ 1 año) firmado y sellado por el profesional tratante, describiendo el diagnóstico y sus implicancias funcionales.',
    docs: ['DNI del solicitante', 'Informe médico', 'Estudios complementarios que respalden el diagnóstico'],
    tip: 'Pedí al médico que use la CIF (Clasificación Internacional del Funcionamiento) — es lo que evalúa la junta.',
  },
  {
    numero: 2,
    titulo: 'Identificar la junta evaluadora de tu provincia',
    descripcion:
      'El CUD se tramita en la provincia donde vivís. Cada jurisdicción tiene su junta evaluadora; en algunas se llama "servicio de salud mental" o "dirección de discapacidad".',
    docs: ['Certificado de domicilio (a veces)', 'Último recibo de servicio para acreditar domicilio'],
  },
  {
    numero: 3,
    titulo: 'Solicitar turno con la junta',
    descripcion:
      'En la mayoría de las provincias se pide online. CABA y PBA tienen portales específicos; el resto vía la Dirección Provincial de Discapacidad.',
    tip: 'Si la espera es larga, pedí turno en otra jurisdicción cercana donde también podés tramitarlo.',
  },
  {
    numero: 4,
    titulo: 'Asistir a la evaluación interdisciplinaria',
    descripcion:
      'La junta evalúa con médico, psicólogo y trabajador social. Duración: 30–60 min. Llevar documentación original y copia.',
    docs: ['DNI', 'Informe médico', 'Estudios', '2 fotos carnet'],
    tip: 'Llevá a la persona con discapacidad (si es posible). Contá cómo es su día a día, no solo el diagnóstico.',
  },
  {
    numero: 5,
    titulo: 'Recibir el resultado',
    descripcion:
      'Si otorgan el CUD: el certificado se emite en el acto o a los pocos días (varía por provincia). Vigencia: suele ser de 5 a 10 años según el diagnóstico.',
    tip: 'El CUD es GRATIS. Si alguien te cobra, denunciálo en ANDIS.',
  },
  {
    numero: 6,
    titulo: 'Activar prestaciones',
    descripcion:
      'Con el CUD podés solicitar prestaciones por Ley 24.901 a tu obra social o prepaga: transporte, rehabilitación, apoyo escolar (MAI/AT), ayudas técnicas.',
    docs: ['CUD', 'Credencial obra social', 'Prescripción médica de la prestación'],
    tip: 'Las obras sociales deben cubrir el 100% de las prestaciones nomencladas. Si te niegan cobertura, hacé reclamo a la Superintendencia de Salud.',
  },
  {
    numero: 7,
    titulo: 'Otros derechos que se activan',
    descripcion:
      'ASIGNACIÓN UNIVERSAL POR HIJO CON DISCAPACIDAD (AUH-D), pensión no contributiva, pase libre en transporte público (CABA y varias provincias), exención ABL/patente, eximición de peajes.',
    tip: 'Muchos derechos no se otorgan automáticamente: hay que pedirlos. Consultá con trabajador/a social.',
  },
];

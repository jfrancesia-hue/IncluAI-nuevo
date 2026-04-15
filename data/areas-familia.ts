import type { AreaAyudaFamilia } from '@/lib/types';

export type AreaFamilia = {
  id: AreaAyudaFamilia;
  label: string;
  icon: string;
  descripcion: string;
  ejemplos: string[];
};

export const AREAS_FAMILIA: AreaFamilia[] = [
  {
    id: 'rutinas',
    label: 'Rutinas diarias',
    icon: '🌅',
    descripcion: 'Vestirse, bañarse, comer, cepillarse los dientes, prepararse para la escuela',
    ejemplos: ['No quiere vestirse solo', 'Se resiste a lavarse los dientes', 'Tarda mucho en comer'],
  },
  {
    id: 'comunicacion',
    label: 'Comunicación en casa',
    icon: '🗣️',
    descripcion: 'Cómo comunicarse mejor, entender lo que necesita, fomentar el lenguaje',
    ejemplos: ['No logra expresar lo que quiere', 'Usa pocas palabras', 'No responde cuando le hablo'],
  },
  {
    id: 'conducta',
    label: 'Conductas difíciles',
    icon: '🌊',
    descripcion: 'Berrinches, agresión, autolesión, negación, conductas repetitivas',
    ejemplos: ['Hace berrinches muy intensos', 'Se golpea cuando se frustra', 'Muerde o pega'],
  },
  {
    id: 'autonomia',
    label: 'Autonomía e independencia',
    icon: '💪',
    descripcion: 'Que pueda hacer cosas solo/a: vestirse, comer, ir al baño, moverse',
    ejemplos: ['No controla esfínteres', 'No come solo', 'No puede abotonar la ropa'],
  },
  {
    id: 'socializacion',
    label: 'Socialización',
    icon: '👫',
    descripcion: 'Relación con otros chicos, salidas, cumpleaños, plazas, actividades grupales',
    ejemplos: ['No juega con otros nenes', 'No quiere ir a cumpleaños', 'Se aísla en la plaza'],
  },
  {
    id: 'estimulacion',
    label: 'Estimulación y juego',
    icon: '🎮',
    descripcion: 'Actividades para estimular el desarrollo, juegos adaptados, tiempo de calidad',
    ejemplos: ['No sé qué juegos hacer con él/ella', 'Se aburre rápido', 'Solo quiere pantallas'],
  },
  {
    id: 'escolaridad',
    label: 'Apoyo escolar',
    icon: '📖',
    descripcion: 'Ayuda con tareas, comunicación con la escuela, adaptaciones en casa',
    ejemplos: ['No puede hacer la tarea solo', 'La escuela no lo incluye', 'No entiendo las adaptaciones'],
  },
  {
    id: 'emociones',
    label: 'Emociones y regulación',
    icon: '💛',
    descripcion: 'Ansiedad, miedos, frustración, cambios de humor, regulación emocional',
    ejemplos: ['Tiene mucha ansiedad', 'Llora por todo', 'No tolera la frustración'],
  },
  {
    id: 'sueno',
    label: 'Sueño',
    icon: '🌙',
    descripcion: 'Dificultades para dormirse, despertares nocturnos, rutina de sueño',
    ejemplos: ['No se duerme antes de las 12', 'Se despierta varias veces', 'Solo duerme en nuestra cama'],
  },
  {
    id: 'alimentacion',
    label: 'Alimentación',
    icon: '🍽️',
    descripcion: 'Selectividad alimentaria, texturas, rechazo de comidas, hábitos',
    ejemplos: ['Solo come 3 cosas', 'Rechaza texturas', 'No come en la mesa'],
  },
  {
    id: 'transiciones',
    label: 'Transiciones y cambios',
    icon: '🔄',
    descripcion: 'Pasar de una actividad a otra, cambios de rutina, imprevistos',
    ejemplos: ['Se desregula cuando cambiamos de actividad', 'No tolera cambios de plan', 'Salir de casa es un drama'],
  },
  {
    id: 'hermanos',
    label: 'Convivencia con hermanos',
    icon: '👨‍👩‍👧‍👦',
    descripcion: 'Relación con hermanos, celos, tiempo equitativo, explicar la discapacidad',
    ejemplos: ['El hermano se siente dejado de lado', 'Pelean mucho', 'No sé cómo explicarle al hermano'],
  },
  {
    id: 'tramites',
    label: 'Trámites y derechos',
    icon: '📋',
    descripcion: 'CUD, obras sociales, prestaciones, derechos, escolaridad, documentación',
    ejemplos: ['No sé cómo tramitar el CUD', 'La obra social no cubre', 'Necesito saber mis derechos'],
  },
];

export function getAreaFamiliaById(id: string): AreaFamilia | undefined {
  return AREAS_FAMILIA.find((a) => a.id === id);
}

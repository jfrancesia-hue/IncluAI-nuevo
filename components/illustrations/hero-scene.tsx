/**
 * Ilustración SVG del hero — se usa como fallback y como decoración sobre la foto.
 * Escena: grupo diverso de alumnos + docente con material manipulativo.
 */
export function HeroSceneIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 520 360"
      className={className ?? 'h-auto w-full'}
      aria-hidden
    >
      <ellipse cx="260" cy="330" rx="220" ry="14" fill="#0a1a30" opacity=".35" />
      <rect x="80" y="230" width="360" height="12" rx="6" fill="#FBF8F2" />
      <rect x="110" y="242" width="8" height="70" fill="#FBF8F2" />
      <rect x="402" y="242" width="8" height="70" fill="#FBF8F2" />

      <g transform="translate(170,192)">
        <rect width="180" height="16" rx="4" fill="#27AE60" />
        <rect y="20" width="90" height="16" rx="4" fill="#16a34a" />
        <rect x="92" y="20" width="90" height="16" rx="4" fill="#16a34a" />
        <rect width="45" height="16" y="-22" rx="4" fill="#E67E22" />
        <rect x="47" width="45" height="16" y="-22" rx="4" fill="#E67E22" />
        <rect x="94" width="45" height="16" y="-22" rx="4" fill="#E67E22" />
        <rect x="141" width="45" height="16" y="-22" rx="4" fill="#E67E22" />
      </g>

      {/* Docente */}
      <g>
        <circle cx="120" cy="140" r="22" fill="#fde68a" />
        <path d="M110 118 q10 -14 22 0 q-4 -2 -11 -1 q-6 1 -11 1 z" fill="#451a03" />
        <rect x="96" y="160" width="48" height="70" rx="12" fill="#E67E22" />
        <rect x="102" y="185" width="10" height="30" rx="4" fill="#FBF8F2" />
        <path d="M140 200 q20 -10 40 -6" stroke="#fde68a" strokeWidth="8" strokeLinecap="round" fill="none" />
      </g>

      {/* Alumna con silla de ruedas */}
      <g>
        <circle cx="230" cy="150" r="18" fill="#fca5a5" />
        <rect x="210" y="168" width="40" height="50" rx="10" fill="#27AE60" />
        <rect x="205" y="215" width="50" height="18" rx="6" fill="#2E86C1" />
        <circle cx="214" cy="244" r="14" fill="none" stroke="#2E86C1" strokeWidth="3" />
        <circle cx="246" cy="244" r="14" fill="none" stroke="#2E86C1" strokeWidth="3" />
        <circle cx="214" cy="244" r="4" fill="#2E86C1" />
        <circle cx="246" cy="244" r="4" fill="#2E86C1" />
      </g>

      {/* Alumno con implante coclear */}
      <g>
        <circle cx="315" cy="145" r="20" fill="#fde68a" />
        <circle cx="298" cy="138" r="4" fill="#2E86C1" />
        <rect x="293" y="130" width="3" height="10" rx="1" fill="#2E86C1" />
        <rect x="295" y="160" width="40" height="60" rx="10" fill="#60a5fa" />
        <rect x="299" y="220" width="12" height="18" fill="#2E86C1" />
        <rect x="320" y="220" width="12" height="18" fill="#2E86C1" />
      </g>

      {/* Alumno con tablet pictográfica */}
      <g>
        <circle cx="395" cy="152" r="19" fill="#c4b5fd" />
        <rect x="376" y="170" width="40" height="55" rx="10" fill="#ea580c" />
        <rect x="382" y="218" width="12" height="15" fill="#2E86C1" />
        <rect x="400" y="218" width="12" height="15" fill="#2E86C1" />
        <rect x="405" y="180" width="34" height="24" rx="3" fill="#FBF8F2" stroke="#2E86C1" strokeWidth="2" />
        <rect x="408" y="184" width="8" height="7" fill="#27AE60" />
        <rect x="418" y="184" width="8" height="7" fill="#E67E22" />
        <rect x="428" y="184" width="8" height="7" fill="#60a5fa" />
        <rect x="408" y="194" width="8" height="7" fill="#fde68a" />
        <rect x="418" y="194" width="8" height="7" fill="#c4b5fd" />
        <rect x="428" y="194" width="8" height="7" fill="#27AE60" />
      </g>

      {/* Sparkles */}
      <g>
        <path d="M450 60 l6 14 14 6 -14 6 -6 14 -6 -14 -14 -6 14 -6z" fill="#27AE60" opacity=".85" />
        <circle cx="70" cy="80" r="4" fill="#fde68a" />
        <circle cx="80" cy="70" r="2" fill="#fde68a" />
      </g>
    </svg>
  );
}

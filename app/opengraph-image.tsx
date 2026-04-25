import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'IncluAI — Educación inclusiva con IA';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// SVG del logo inline — next/og no soporta importar componentes React
// con SVG complejos, así que duplicamos el path acá. Mantener
// sincronizado con components/branding/Logo.tsx
const LOGO_PATH =
  'M 5 0 H 12 A 4 4 0 0 0 20 0 H 27 A 5 5 0 0 1 32 5 V 12 A 4 4 0 0 1 32 20 V 27 A 5 5 0 0 1 27 32 H 5 A 5 5 0 0 1 0 27 V 5 A 5 5 0 0 1 5 0 Z';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          width: '100%',
          height: '100%',
          background:
            'linear-gradient(135deg, #061b34 0%, #0f2240 40%, #0e4f68 100%)',
          color: 'white',
          padding: '80px',
          position: 'relative',
        }}
      >
        {/* Mesh blur orbs */}
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            left: '-5%',
            width: '500px',
            height: '500px',
            borderRadius: '999px',
            background: 'radial-gradient(circle, rgba(46,134,193,0.45), transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-15%',
            right: '-10%',
            width: '600px',
            height: '600px',
            borderRadius: '999px',
            background: 'radial-gradient(circle, rgba(39,174,96,0.4), transparent 70%)',
          }}
        />

        {/* Logo + wordmark */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '48px',
            zIndex: 10,
          }}
        >
          <svg
            width="80"
            height="80"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="og-grad" x1="0" y1="0" x2="32" y2="32">
                <stop offset="0" stopColor="#27AE60" />
                <stop offset="1" stopColor="#5DA9D8" />
              </linearGradient>
            </defs>
            <path d={LOGO_PATH} fill="url(#og-grad)" />
            <circle cx="22" cy="22" r="2" fill="white" fillOpacity="0.9" />
          </svg>
          <span
            style={{
              fontSize: '64px',
              fontWeight: 800,
              letterSpacing: '-0.04em',
            }}
          >
            IncluAI
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            display: 'flex',
            fontSize: '64px',
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-0.035em',
            maxWidth: '900px',
            zIndex: 10,
            marginBottom: '24px',
          }}
        >
          Cada alumno merece una clase pensada para él.
        </div>

        {/* Subhead */}
        <div
          style={{
            fontSize: '26px',
            fontWeight: 400,
            opacity: 0.8,
            maxWidth: '800px',
            lineHeight: 1.4,
            zIndex: 10,
          }}
        >
          IA especializada en educación inclusiva — Argentina, hecha por
          docentes para docentes.
        </div>

        {/* Pills módulos */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginTop: '48px',
            zIndex: 10,
          }}
        >
          {['📚 Docentes', '🏠 Familias', '⚕️ Profesionales'].map((label) => (
            <div
              key={label}
              style={{
                padding: '10px 20px',
                borderRadius: '999px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                fontSize: '20px',
                fontWeight: 600,
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Url + dot */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '80px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '18px',
            opacity: 0.7,
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '999px',
              background: '#27AE60',
              boxShadow: '0 0 12px rgba(39,174,96,0.7)',
            }}
          />
          incluai.com.ar
        </div>
      </div>
    ),
    { ...size }
  );
}

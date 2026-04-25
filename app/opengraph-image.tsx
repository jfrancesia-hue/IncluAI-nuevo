import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'IncluAI — Educación inclusiva con IA';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

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
            background:
              'radial-gradient(circle, rgba(46,134,193,0.45), transparent 70%)',
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
            background:
              'radial-gradient(circle, rgba(39,174,96,0.4), transparent 70%)',
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
          <div style={{ fontSize: '76px', lineHeight: 1 }}>🧩</div>
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

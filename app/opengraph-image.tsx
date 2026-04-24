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
          alignItems: 'center',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #0f2240 0%, #1e3a5f 40%, #0e4f68 100%)',
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
          padding: '60px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              backgroundColor: '#15803d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
            }}
          >
            🧩
          </div>
          <span style={{ fontSize: '56px', fontWeight: 800 }}>IncluAI</span>
        </div>

        <div
          style={{
            fontSize: '36px',
            fontWeight: 700,
            textAlign: 'center',
            lineHeight: 1.3,
            maxWidth: '800px',
            marginBottom: '24px',
          }}
        >
          Cada persona merece ser comprendida
        </div>

        <div
          style={{
            fontSize: '22px',
            fontWeight: 400,
            textAlign: 'center',
            opacity: 0.85,
            maxWidth: '700px',
            lineHeight: 1.5,
          }}
        >
          Inteligencia artificial especializada en educacion inclusiva para docentes, familias y profesionales de salud
        </div>

        <div
          style={{
            display: 'flex',
            gap: '16px',
            marginTop: '40px',
          }}
        >
          {['📚 Docentes', '🏠 Familias', '⚕️ Profesionales'].map((label) => (
            <div
              key={label}
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255,255,255,0.15)',
                fontSize: '18px',
                fontWeight: 600,
              }}
            >
              {label}
            </div>
          ))}
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            fontSize: '16px',
            opacity: 0.6,
          }}
        >
          inclua.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}

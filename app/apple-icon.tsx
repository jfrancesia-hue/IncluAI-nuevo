import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

const LOGO_PATH =
  'M 5 0 H 12 A 4 4 0 0 0 20 0 H 27 A 5 5 0 0 1 32 5 V 12 A 4 4 0 0 1 32 20 V 27 A 5 5 0 0 1 27 32 H 5 A 5 5 0 0 1 0 27 V 5 A 5 5 0 0 1 5 0 Z';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'linear-gradient(135deg, #061b34 0%, #0f2240 50%, #0e4f68 100%)',
          borderRadius: '40px',
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="apple-icon-grad"
              x1="0"
              y1="0"
              x2="32"
              y2="32"
            >
              <stop offset="0" stopColor="#27AE60" />
              <stop offset="1" stopColor="#5DA9D8" />
            </linearGradient>
          </defs>
          <path d={LOGO_PATH} fill="url(#apple-icon-grad)" />
          <circle cx="22" cy="22" r="2.5" fill="white" />
        </svg>
      </div>
    ),
    { ...size }
  );
}

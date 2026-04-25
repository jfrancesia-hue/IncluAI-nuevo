import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

const LOGO_PATH =
  'M 5 0 H 12 A 4 4 0 0 0 20 0 H 27 A 5 5 0 0 1 32 5 V 12 A 4 4 0 0 1 32 20 V 27 A 5 5 0 0 1 27 32 H 5 A 5 5 0 0 1 0 27 V 5 A 5 5 0 0 1 5 0 Z';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="favicon-grad" x1="0" y1="0" x2="32" y2="32">
              <stop offset="0" stopColor="#27AE60" />
              <stop offset="1" stopColor="#2E86C1" />
            </linearGradient>
          </defs>
          <path d={LOGO_PATH} fill="url(#favicon-grad)" />
          <circle cx="22" cy="22" r="2.5" fill="white" />
        </svg>
      </div>
    ),
    { ...size }
  );
}

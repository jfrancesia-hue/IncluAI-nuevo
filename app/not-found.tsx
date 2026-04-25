import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/branding/Logo';

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-6 overflow-hidden px-4 text-center">
      {/* Mesh sutil */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ filter: 'blur(60px)', opacity: 0.4 }}
      >
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '20%',
            width: '40%',
            height: '40%',
            background:
              'radial-gradient(circle, rgba(46,134,193,0.4), transparent 60%)',
            animation: 'mesh-orb-1 22s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '15%',
            right: '15%',
            width: '40%',
            height: '40%',
            background:
              'radial-gradient(circle, rgba(39,174,96,0.35), transparent 60%)',
            animation: 'mesh-orb-2 26s ease-in-out infinite',
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6">
        <div style={{ animation: 'glow-pulse 3.6s ease-in-out infinite' }}>
          <Logo size={88} variant="gradient" gradientId="not-found-logo" />
        </div>

        <p
          className="text-6xl font-extrabold"
          style={{
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.04em',
            background: 'linear-gradient(135deg, #27AE60, #2E86C1)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          404
        </p>
        <h1
          className="text-3xl font-bold text-[#1F2E3D] sm:text-4xl"
          style={{
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.025em',
          }}
        >
          Página no encontrada
        </h1>
        <p className="max-w-md text-base text-[#4A5968]" style={{ lineHeight: 1.6 }}>
          La página que buscás no existe o fue movida. Volvé al inicio para
          seguir generando guías inclusivas.
        </p>
        <Button asChild size="lg" className="magnetic-btn">
          <Link href="/">Volver al inicio →</Link>
        </Button>
      </div>
    </div>
  );
}

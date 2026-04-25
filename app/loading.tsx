export default function RootLoading() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-6 overflow-hidden bg-[#FBF8F2] px-4">
      {/* Mesh sutil */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ filter: 'blur(70px)', opacity: 0.35 }}
      >
        <div
          style={{
            position: 'absolute',
            top: '25%',
            left: '15%',
            width: '40%',
            height: '40%',
            background:
              'radial-gradient(circle, rgba(46,134,193,0.5), transparent 60%)',
            animation: 'mesh-orb-1 22s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '20%',
            right: '20%',
            width: '40%',
            height: '40%',
            background:
              'radial-gradient(circle, rgba(39,174,96,0.5), transparent 60%)',
            animation: 'mesh-orb-2 26s ease-in-out infinite',
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-5">
        <div className="relative flex h-24 w-24 items-center justify-center">
          <div
            aria-hidden
            className="absolute inset-0 animate-ping rounded-2xl bg-[#27AE60]/25"
          />
          <div
            aria-label="Cargando"
            className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#27AE60] to-[#0d9448] text-4xl text-white shadow-[0_8px_28px_rgba(22,163,74,0.32)]"
          >
            🧩
          </div>
        </div>
        <p
          className="text-xl font-bold text-[#1F2E3D]"
          style={{
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.02em',
          }}
        >
          Preparando todo…
        </p>
      </div>
    </div>
  );
}

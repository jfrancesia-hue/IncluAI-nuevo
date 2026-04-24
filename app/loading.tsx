export default function RootLoading() {
  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center gap-5 bg-[#FBF8F2] px-4">
      <div className="relative flex h-24 w-24 items-center justify-center">
        <div
          aria-hidden
          className="absolute inset-0 animate-ping rounded-full bg-[#27AE60]/30"
        />
        <div
          aria-label="Cargando"
          className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#27AE60] to-[#0d9448] text-4xl text-white shadow-[0_8px_24px_rgba(22,163,74,0.3)]"
        >
          🧩
        </div>
      </div>
      <p className="font-serif text-xl font-bold text-[#2E86C1]">
        Preparando todo…
      </p>
    </div>
  );
}

import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-1 flex-col items-center justify-center bg-[#fbf7f0] px-4 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 20%, rgba(22,163,74,0.1), transparent 45%), radial-gradient(circle at 85% 80%, rgba(30,58,95,0.08), transparent 45%)',
        }}
      />
      <Link
        href="/"
        className="relative mb-6 inline-flex items-center gap-2 font-serif text-2xl font-bold text-[#1e3a5f]"
      >
        <span aria-hidden>🧩</span> IncluAI
      </Link>
      <div className="relative w-full max-w-[480px]">{children}</div>
      <p className="relative mt-8 text-xs text-[#5c6b7f]">
        IncluAI — Hecho con ❤️ en Argentina 🇦🇷
      </p>
    </div>
  );
}

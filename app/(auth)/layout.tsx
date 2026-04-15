import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center bg-background px-4 py-10">
      <Link
        href="/"
        className="mb-8 text-2xl font-bold font-serif text-primary"
      >
        🧩 IncluIA
      </Link>
      <div className="w-full max-w-md">{children}</div>
      <p className="mt-8 text-xs text-muted">
        IncluIA — Hecho en Argentina 🇦🇷
      </p>
    </div>
  );
}

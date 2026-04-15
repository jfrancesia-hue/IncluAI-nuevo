'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div aria-hidden className="h-7 w-7" />;
  const dark = theme === 'dark';
  return (
    <button
      type="button"
      aria-label={dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card text-sm hover:bg-primary-bg"
    >
      {dark ? '☀️' : '🌙'}
    </button>
  );
}

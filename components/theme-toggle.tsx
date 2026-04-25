'use client';

import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';

// useSyncExternalStore evita el setState-in-effect del patrón clásico
// `useEffect(() => setMounted(true))` para manejar hydration.
function subscribe() {
  return () => {};
}
function getSnapshot() {
  return true;
}
function getServerSnapshot() {
  return false;
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  if (!mounted) return <div aria-hidden className="h-8 w-8" />;
  const dark = theme === 'dark';
  return (
    <button
      type="button"
      aria-label={dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full border text-sm transition hover:scale-105"
      style={{
        background: 'var(--navbar-pill-bg)',
        borderColor: 'var(--navbar-pill-border)',
        color: 'var(--navbar-pill-text)',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
      }}
    >
      {dark ? '☀️' : '🌙'}
    </button>
  );
}

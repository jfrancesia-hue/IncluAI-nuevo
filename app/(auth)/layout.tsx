// El layout auth ya no impone wrapper — cada página usa AuthShell directamente
// para tener control sobre el aside (login/registro lo muestran;
// verificar-email no). Esto da consistencia visual sin sacrificar flexibilidad.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

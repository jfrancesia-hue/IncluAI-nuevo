export default function RootLoading() {
  return (
    <div className="flex min-h-screen flex-1 items-center justify-center">
      <span
        aria-label="Cargando"
        className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent"
      />
    </div>
  );
}

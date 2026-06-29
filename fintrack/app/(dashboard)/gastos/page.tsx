export const metadata = { title: "Gastos · FinTrack" };

export default function GastosPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Gastos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Historial y registro de transacciones
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
        Próximamente — lista de gastos
      </div>
    </div>
  );
}

export const metadata = { title: "Presupuesto · FinTrack" };

export default function PresupuestoPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Presupuesto</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configuración 20/35/30/15 · Ciclo quincenal
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
        Próximamente — configuración de presupuesto
      </div>
    </div>
  );
}

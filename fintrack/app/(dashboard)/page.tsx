export const metadata = { title: "Dashboard · FinTrack" };

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Junio 2026 · Semana 3 de 4
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Patrimonio Neto", value: "—" },
          { label: "Presupuesto Mensual", value: "—" },
          { label: "Tasa de Ahorro", value: "—" },
          { label: "Crédito Utilizado", value: "—" },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-xl border border-border bg-card p-5"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
            <p className="mt-3 font-mono text-2xl font-bold text-foreground">
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

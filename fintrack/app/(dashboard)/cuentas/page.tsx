export const metadata = { title: "Cuentas · FinTrack" };

export default function CuentasPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">
          Cuentas y Tarjetas
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Banco General · BAC Credomatic
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
        Próximamente — resumen de cuentas y tarjetas
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
import { fmt } from "@/lib/formatters";
import type { BudgetConfig } from "@/types/fintrack";

const SLICES = [
  { key: "savings" as const, label: "Ahorro emergencia", color: "bg-positive" },
  { key: "fixed" as const, label: "Gastos fijos", color: "bg-ft-blue" },
  { key: "variable" as const, label: "Gastos variables", color: "bg-gold" },
  { key: "buffer" as const, label: "Buffer operativo", color: "bg-ft-purple" },
];

interface BudgetAllocationProps {
  config: BudgetConfig;
}

export function BudgetAllocation({ config }: BudgetAllocationProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Distribución del Salario
      </p>

      {/* Bar */}
      <div className="mb-5 flex h-3 w-full overflow-hidden rounded-full">
        {SLICES.map(({ key, color }) => (
          <div
            key={key}
            className={cn("h-full", color)}
            style={{ width: `${config[key]}%` }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="space-y-2.5">
        {SLICES.map(({ key, label, color }) => {
          const pct = config[key];
          const amount = (config.salary * pct) / 100;
          return (
            <div key={key} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className={cn("h-2.5 w-2.5 rounded-full", color)} />
                <span className="text-muted-foreground">{label}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-foreground">{fmt(amount)}</span>
                <span className="w-8 text-right text-xs text-muted-foreground">
                  {pct}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

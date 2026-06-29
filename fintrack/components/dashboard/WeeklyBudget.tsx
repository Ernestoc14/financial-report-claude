import { cn } from "@/lib/utils";
import { fmt } from "@/lib/formatters";
import { WEEKLY_SPLITS } from "@/lib/constants";

interface WeekBudget {
  week: number;
  allocation: number;
  spent: number;
  remaining: number;
  pct: number;
}

interface WeeklyBudgetProps {
  data: WeekBudget;
}

export function WeeklyBudget({ data }: WeeklyBudgetProps) {
  const { week, allocation, spent, remaining, pct } = data;
  const isOver = pct > 1;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Semana {week} · Gastos Variables
        </p>
        <span className="text-xs text-muted-foreground">
          {WEEKLY_SPLITS[week - 1]}% del pool variable
        </span>
      </div>

      <div className="mb-3 flex items-end justify-between">
        <div>
          <p className="font-mono text-2xl font-bold text-foreground">{fmt(spent)}</p>
          <p className="text-xs text-muted-foreground">de {fmt(allocation)}</p>
        </div>
        <p
          className={cn(
            "font-mono text-sm font-semibold",
            isOver ? "text-negative" : "text-positive"
          )}
        >
          {isOver ? "-" : "+"}{fmt(Math.abs(remaining))}
        </p>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            isOver ? "bg-negative" : pct > 0.8 ? "bg-yellow-500" : "bg-positive"
          )}
          style={{ width: `${Math.min(pct * 100, 100)}%` }}
        />
      </div>
      <p className="mt-1.5 text-right text-xs text-muted-foreground">
        {Math.round(pct * 100)}% utilizado
      </p>
    </div>
  );
}

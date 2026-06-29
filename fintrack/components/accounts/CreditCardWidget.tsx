import { fmt, pct } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { CreditCard } from "@/types/fintrack";

interface CreditCardWidgetProps {
  card: CreditCard;
}

export function CreditCardWidget({ card }: CreditCardWidgetProps) {
  const utilization = card.limit > 0 ? card.balance / card.limit : 0;
  const available = card.limit - card.balance;
  const isWarning = utilization >= 0.3;
  const isDanger = utilization >= 0.5;

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Tarjeta
          </p>
          <p className="mt-0.5 text-sm font-medium text-foreground">{card.name}</p>
        </div>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-semibold",
            isDanger
              ? "bg-destructive/15 text-destructive"
              : isWarning
                ? "bg-yellow-500/15 text-yellow-400"
                : "bg-positive/15 text-positive"
          )}
        >
          {pct(utilization * 100, 0)} uso
        </span>
      </div>

      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="font-mono text-xl font-bold text-foreground">
          {fmt(card.balance)}
        </span>
        <span className="text-xs text-muted-foreground">/ {fmt(card.limit)}</span>
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            isDanger ? "bg-destructive" : isWarning ? "bg-yellow-500" : "bg-positive"
          )}
          style={{ width: `${Math.min(utilization * 100, 100)}%` }}
        />
      </div>

      <p className="mt-1.5 text-xs text-muted-foreground">
        {fmt(available)} disponible
      </p>
    </div>
  );
}

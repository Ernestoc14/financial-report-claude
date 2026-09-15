"use client";

import { getPayCycleInfo } from "@/lib/date-utils";
import { WEEKLY_SPLITS } from "@/mock/budget";
import { cn } from "@/lib/utils";

export function PayCycleBar() {
  const { daysSincePay, daysUntilPay, weekIndex, totalWeeks, cycleProgress } = getPayCycleInfo();
  const weekBudgetPct = WEEKLY_SPLITS[Math.min(weekIndex, WEEKLY_SPLITS.length - 1)];

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Ciclo de Pago
        </p>
        <span className="text-xs text-muted-foreground">
          Día {daysSincePay} · faltan <span className="font-semibold text-foreground">{daysUntilPay}d</span>
        </span>
      </div>

      {/* Cycle progress */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${Math.min(cycleProgress * 100, 100).toFixed(1)}%` }}
        />
      </div>

      {/* Week indicators */}
      <div className="mt-3 flex gap-1.5">
        {WEEKLY_SPLITS.map((pct, i) => (
          <div
            key={i}
            className={cn(
              "flex flex-1 flex-col items-center rounded-lg py-2 text-center text-[10px] font-semibold",
              i === weekIndex
                ? "bg-primary/20 text-primary"
                : i < weekIndex
                  ? "bg-muted/60 text-muted-foreground line-through"
                  : "bg-muted/30 text-muted-foreground"
            )}
          >
            <span>S{i + 1}</span>
            <span>{pct}%</span>
          </div>
        ))}
      </div>

      <p className="mt-2 text-center text-[11px] text-muted-foreground">
        Semana {weekIndex + 1} — presupuesto variable: <span className="font-semibold text-foreground">{weekBudgetPct}%</span> del variable mensual
      </p>
    </div>
  );
}

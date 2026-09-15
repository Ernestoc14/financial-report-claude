"use client";

import { useFinanceStore } from "@/store/useFinanceStore";
import { fmt, fmtShortDate } from "@/lib/formatters";
import { CATEGORY_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function RecentTransactions() {
  const transactions = useFinanceStore((s) => s.transactions);
  const recent = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 7);

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-5 py-4">
        <h3 className="text-sm font-semibold text-foreground">Transacciones Recientes</h3>
      </div>
      <div className="divide-y divide-border">
        {recent.map((tx) => {
          const isIncome = tx.type === "income";
          const isTransfer = tx.type === "transfer";
          const dot = CATEGORY_COLORS[tx.category] ?? "#64748B";

          return (
            <div key={tx.id} className="flex items-center gap-4 px-5 py-3">
              <div
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: dot }}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{tx.description}</p>
                <p className="text-xs text-muted-foreground">{fmtShortDate(tx.date)}</p>
              </div>
              <p
                className={cn(
                  "shrink-0 font-mono text-sm font-semibold tabular-nums",
                  isIncome ? "text-positive" : isTransfer ? "text-ft-blue" : "text-foreground"
                )}
              >
                {isIncome ? "+" : isTransfer ? "" : "−"}
                {fmt(tx.amount)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { useMemo } from "react";
import type { Alert, CreditCard, BudgetConfig } from "@/types/fintrack";

export function useAlerts(
  cards: CreditCard[],
  config: BudgetConfig | null,
  monthlySpent: number
): Alert[] {
  return useMemo(() => {
    const alerts: Alert[] = [];

    // Credit utilization warnings (target: keep below 30%)
    for (const card of cards) {
      const utilization = card.limit > 0 ? card.balance / card.limit : 0;
      if (utilization >= 0.3) {
        alerts.push({
          type: utilization >= 0.5 ? "danger" : "warn",
          message: `${card.name}: utilización al ${Math.round(utilization * 100)}% (límite $${card.limit})`,
          field: `card_${card.id}`,
        });
      }
    }

    // Budget overspend warning
    if (config) {
      const variablePool = (config.salary * config.variable) / 100;
      const overspendPct = monthlySpent / variablePool;
      if (overspendPct >= 1) {
        alerts.push({
          type: "danger",
          message: "Has superado el presupuesto variable de este mes.",
          field: "budget_variable",
        });
      } else if (overspendPct >= 0.85) {
        alerts.push({
          type: "warn",
          message: `Has usado el ${Math.round(overspendPct * 100)}% del presupuesto variable.`,
          field: "budget_variable",
        });
      }
    }

    return alerts;
  }, [cards, config, monthlySpent]);
}

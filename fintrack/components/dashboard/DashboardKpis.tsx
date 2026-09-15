"use client";

import { useFinanceStore } from "@/store/useFinanceStore";
import { KpiCard } from "./KpiCard";
import { pct } from "@/lib/formatters";

export function DashboardKpis() {
  const { netWorth, budget, totalCreditUsed, totalCreditLimit, monthlySavingsRate } = useFinanceStore();
  const creditUtilPct = totalCreditLimit > 0 ? (totalCreditUsed / totalCreditLimit) * 100 : 0;
  const budgetUsed = budget.salary > 0 ? (totalCreditUsed / budget.salary) * 100 : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard label="Patrimonio Neto" value={netWorth} format="currency" />
      <KpiCard label="Presupuesto Mensual" value={budget.salary} format="currency" />
      <KpiCard
        label="Tasa de Ahorro"
        value={budget.savings}
        format="percent"
        delta={monthlySavingsRate > 0 ? 0 : undefined}
      />
      <KpiCard
        label="Crédito Utilizado"
        value={pct(creditUtilPct, 1)}
        format="raw"
        delta={creditUtilPct > 30 ? -(creditUtilPct - 30) : 0}
      />
    </div>
  );
}

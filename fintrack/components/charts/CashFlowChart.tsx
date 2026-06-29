"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DESIGN_TOKENS } from "@/lib/constants";
import { fmt, fmtShortDate } from "@/lib/formatters";

interface CashFlowPoint {
  date: string;
  income: number;
  expenses: number;
}

interface CashFlowChartProps {
  data: CashFlowPoint[];
}

export function CashFlowChart({ data }: CashFlowChartProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Flujo de Caja
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={DESIGN_TOKENS.green} stopOpacity={0.2} />
              <stop offset="95%" stopColor={DESIGN_TOKENS.green} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={DESIGN_TOKENS.red} stopOpacity={0.2} />
              <stop offset="95%" stopColor={DESIGN_TOKENS.red} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={DESIGN_TOKENS.border} />
          <XAxis
            dataKey="date"
            tickFormatter={(v) => fmtShortDate(v)}
            tick={{ fill: "#64748B", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `$${v}`}
            tick={{ fill: "#64748B", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: DESIGN_TOKENS.card,
              border: `1px solid ${DESIGN_TOKENS.border}`,
              borderRadius: 8,
              color: "#E2E8F0",
              fontSize: 12,
            }}
            formatter={(v, name) => [
              fmt(Number(v)),
              name === "income" ? "Ingresos" : "Gastos",
            ]}
            labelFormatter={(l) => fmtShortDate(l)}
          />
          <Area
            type="monotone"
            dataKey="income"
            stroke={DESIGN_TOKENS.green}
            strokeWidth={2}
            fill="url(#incomeGrad)"
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke={DESIGN_TOKENS.red}
            strokeWidth={2}
            fill="url(#expenseGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

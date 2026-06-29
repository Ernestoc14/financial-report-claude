"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { DESIGN_TOKENS, CATEGORY_COLORS } from "@/lib/constants";
import { fmt } from "@/lib/formatters";

interface CategoryData {
  category: string;
  label: string;
  amount: number;
}

interface CategoryPieChartProps {
  data: CategoryData[];
}

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Gastos por Categoría
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="label"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={2}
          >
            {data.map((entry) => (
              <Cell
                key={entry.category}
                fill={CATEGORY_COLORS[entry.category] ?? "#64748B"}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: DESIGN_TOKENS.card,
              border: `1px solid ${DESIGN_TOKENS.border}`,
              borderRadius: 8,
              color: "#E2E8F0",
              fontSize: 12,
            }}
            formatter={(v) => [fmt(Number(v)), ""]}
          />
          <Legend
            formatter={(value) => (
              <span style={{ color: "#94A3B8", fontSize: 11 }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

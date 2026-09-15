import type { BudgetConfig } from "@/types/fintrack";

export const MOCK_BUDGET: BudgetConfig = {
  id: 1,
  salary: 1800,
  payday: 15,
  savings: 20,
  fixed: 35,
  variable: 30,
  buffer: 15,
  userId: 1,
};

export const WEEKLY_SPLITS = [30, 25, 25, 20] as const;

export const FIXED_EXPENSES = [
  { label: "Alquiler",         amount: 450.00, category: "vivienda" },
  { label: "Internet",         amount: 29.99,  category: "servicios" },
  { label: "Netflix",          amount: 8.99,   category: "entretenimiento" },
  { label: "Spotify",          amount: 6.99,   category: "entretenimiento" },
  { label: "Cuota iPhone",     amount: 45.00,  category: "cuotas" },
] as const;

import type { SavingsGoal } from "@/types/fintrack";

export const MOCK_GOALS: SavingsGoal[] = [
  {
    id: 1,
    name: "Fondo Emergencia",
    targetAmount: 3000,
    currentAmount: 400,
    deadline: "2027-10-30",
    userId: 1,
  },
  {
    id: 2,
    name: "Ahorro Navidad",
    targetAmount: 1200,
    currentAmount: 925,
    deadline: "2026-12-15",
    userId: 1,
  },
  {
    id: 3,
    name: "Ahorros General",
    targetAmount: 600,
    currentAmount: 120,
    deadline: "2027-03-31",
    userId: 1,
  },
];

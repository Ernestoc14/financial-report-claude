import { create } from "zustand";
import type { BudgetConfig } from "@/types/fintrack";

interface FintrackState {
  budgetConfig: BudgetConfig | null;
  currentWeek: number;
  selectedMonth: string; // "YYYY-MM"
  setBudgetConfig: (config: BudgetConfig) => void;
  setCurrentWeek: (week: number) => void;
  setSelectedMonth: (month: string) => void;
}

const now = new Date();
const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

export const useFintrackStore = create<FintrackState>((set) => ({
  budgetConfig: null,
  currentWeek: 1,
  selectedMonth: defaultMonth,
  setBudgetConfig: (config) => set({ budgetConfig: config }),
  setCurrentWeek: (week) => set({ currentWeek: week }),
  setSelectedMonth: (month) => set({ selectedMonth: month }),
}));

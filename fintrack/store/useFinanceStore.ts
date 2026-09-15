"use client";

import { create } from "zustand";
import type { Account, CreditCard, Expense, BudgetConfig, SavingsGoal } from "@/types/fintrack";
import { MOCK_ACCOUNTS, MOCK_CREDIT_CARDS, MOCK_TRANSACTIONS, MOCK_BUDGET, MOCK_GOALS } from "@/mock";

interface FinanceState {
  accounts: Account[];
  creditCards: CreditCard[];
  transactions: Expense[];
  budget: BudgetConfig;
  goals: SavingsGoal[];

  totalBalance: number;
  netWorth: number;
  totalCreditUsed: number;
  totalCreditLimit: number;
  monthlySavingsRate: number;

  addTransaction: (tx: Omit<Expense, "id" | "userId">) => void;
}

function computeDerived(
  accounts: Account[],
  creditCards: CreditCard[],
  budget: BudgetConfig
): Pick<FinanceState, "totalBalance" | "netWorth" | "totalCreditUsed" | "totalCreditLimit" | "monthlySavingsRate"> {
  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
  const totalCreditUsed = creditCards.reduce((s, c) => s + c.balance, 0);
  const totalCreditLimit = creditCards.reduce((s, c) => s + c.limit, 0);
  const netWorth = totalBalance - totalCreditUsed;
  const monthlySavingsRate = (budget.savings / 100) * budget.salary;
  return { totalBalance, netWorth, totalCreditUsed, totalCreditLimit, monthlySavingsRate };
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  accounts: MOCK_ACCOUNTS,
  creditCards: MOCK_CREDIT_CARDS,
  transactions: MOCK_TRANSACTIONS,
  budget: MOCK_BUDGET,
  goals: MOCK_GOALS,
  ...computeDerived(MOCK_ACCOUNTS, MOCK_CREDIT_CARDS, MOCK_BUDGET),

  addTransaction(tx) {
    const { transactions } = get();
    const id = Math.max(0, ...transactions.map((t) => t.id)) + 1;
    set({ transactions: [{ ...tx, id, userId: 1 }, ...transactions] });
  },
}));

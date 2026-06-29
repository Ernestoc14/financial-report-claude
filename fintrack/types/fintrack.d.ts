export interface User {
  id: number;
  email: string;
  username: string;
  jwt: string;
}

export interface Account {
  id: number;
  name: string;
  bank: "banco_general" | "bac";
  type: "checking" | "savings" | "special";
  balance: number;
  userId: number;
}

export interface CreditCard {
  id: number;
  name: string;
  bank: "bac";
  limit: number;
  balance: number;
  color: string;
  userId: number;
}

export interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: "income" | "expense" | "transfer";
  accountId: number;
  userId: number;
}

export interface BudgetConfig {
  id: number;
  salary: number;
  payday: number;
  savings: number;
  fixed: number;
  variable: number;
  buffer: number;
  userId: number;
}

export interface SavingsGoal {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  userId: number;
}

export interface Alert {
  type: "warn" | "danger" | "info";
  message: string;
  field?: string;
}

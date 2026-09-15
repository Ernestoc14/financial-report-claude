import type { Account, CreditCard } from "@/types/fintrack";

export const MOCK_ACCOUNTS: Account[] = [
  {
    id: 1,
    name: "Trabajo (Salario)",
    bank: "banco_general",
    type: "checking",
    balance: 1800.00,
    userId: 1,
  },
  {
    id: 2,
    name: "Principal (Yappy/Débito)",
    bank: "banco_general",
    type: "checking",
    balance: 423.50,
    userId: 1,
  },
  {
    id: 3,
    name: "Ahorros General",
    bank: "banco_general",
    type: "savings",
    balance: 250.00,
    userId: 1,
  },
  {
    id: 4,
    name: "Ahorros Navidad",
    bank: "banco_general",
    type: "special",
    balance: 925.00,
    userId: 1,
  },
  {
    id: 5,
    name: "Fondo Emergencia",
    bank: "banco_general",
    type: "savings",
    balance: 100.00,
    userId: 1,
  },
  {
    id: 6,
    name: "Ahorros BAC",
    bank: "bac",
    type: "savings",
    balance: 20.00,
    userId: 1,
  },
];

export const MOCK_CREDIT_CARDS: CreditCard[] = [
  {
    id: 1,
    name: "AMEX ConnectMiles",
    bank: "bac",
    limit: 100,
    balance: 47.50,
    color: "#4A9EFF",
    userId: 1,
  },
  {
    id: 2,
    name: "Visa Smartcash",
    bank: "bac",
    limit: 500,
    balance: 58.20,
    color: "#9B7FE8",
    userId: 1,
  },
];

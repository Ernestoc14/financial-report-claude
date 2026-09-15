import type { Expense } from "@/types/fintrack";

export const MOCK_TRANSACTIONS: Expense[] = [
  { id: 1,  description: "Salario quincenal",          amount: 600.00, date: "2026-08-30", category: "transferencia", type: "income",   accountId: 1, userId: 1 },
  { id: 2,  description: "Alquiler",                   amount: 450.00,  date: "2026-09-01", category: "vivienda",      type: "expense",  accountId: 2, userId: 1 },
  { id: 3,  description: "Super 99 – despensa",        amount: 87.40,   date: "2026-09-01", category: "comida",        type: "expense",  accountId: 2, userId: 1 },
  { id: 4,  description: "Uber",                       amount: 6.50,    date: "2026-09-02", category: "transporte",    type: "expense",  accountId: 2, userId: 1 },
  { id: 5,  description: "Netflix",                    amount: 8.99,    date: "2026-09-02", category: "entretenimiento", type: "expense", accountId: 1, userId: 1 },
  { id: 6,  description: "Fondo Emergencia – traspaso", amount: 360.00, date: "2026-09-01", category: "ahorro",        type: "transfer", accountId: 5, userId: 1 },
  { id: 7,  description: "Ahorro Navidad",             amount: 25.00,   date: "2026-09-01", category: "ahorro",        type: "transfer", accountId: 4, userId: 1 },
  { id: 8,  description: "Almuerzo – El Trapiche",     amount: 14.00,   date: "2026-09-03", category: "comida",        type: "expense",  accountId: 2, userId: 1 },
  { id: 9,  description: "AMEX – ConnectMiles",        amount: 47.50,   date: "2026-09-03", category: "credito",       type: "expense",  accountId: 2, userId: 1 },
  { id: 10, description: "Visa Smartcash – cuota",     amount: 45.00,   date: "2026-09-03", category: "cuotas",        type: "expense",  accountId: 2, userId: 1 },
  { id: 11, description: "Farmacia Arrocha",           amount: 22.30,   date: "2026-09-04", category: "salud",         type: "expense",  accountId: 2, userId: 1 },
  { id: 12, description: "Gas Terpel",             amount: 38.00,   date: "2026-09-04", category: "transporte",    type: "expense",  accountId: 2, userId: 1 },
  { id: 13, description: "Pago Internet",        amount: 29.99,   date: "2026-09-05", category: "servicios",     type: "expense",  accountId: 1, userId: 1 },
  { id: 14, description: "Spotify",                    amount: 6.99,    date: "2026-09-05", category: "entretenimiento", type: "expense", accountId: 1, userId: 1 },
  { id: 15, description: "Ropa – Zara",                amount: 55.00,   date: "2026-09-06", category: "ropa",          type: "expense",  accountId: 2, userId: 1 },
];

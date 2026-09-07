export const CATEGORIES = [
  { value: "vivienda", label: "Vivienda" },
  { value: "comida", label: "Comida" },
  { value: "transporte", label: "Transporte" },
  { value: "salud", label: "Salud" },
  { value: "entretenimiento", label: "Entretenimiento" },
  { value: "ropa", label: "Ropa" },
  { value: "educacion", label: "Educación" },
  { value: "ahorro", label: "Ahorro" },
  { value: "servicios", label: "Servicios" },
  { value: "credito", label: "Tarjeta de Crédito" },
  { value: "transferencia", label: "Transferencia" },
  { value: "cuotas", label: "Cuotas" },
  { value: "otros", label: "Otros" },
] as const;

export const BANKS = {
  banco_general: {
    id: "banco_general",
    name: "Banco General",
    color: "#C9A84C",
    accounts: {
      bg_salary: { name: "Cuenta Salario", type: "savings" },
      bg_main: { name: "Cuenta Principal", type: "savings" },
      bg_savings: { name: "Cuenta Ahorro", type: "savings" },
      bg_xmas: { name: "Ahorro Navidad", type: "special" },
      bg_emergency: { name: "Fondo Emergencia", type: "savings" },
    },
    cards: {
      visa_debito: { name: "Visa Debito" }
    },
    others: {
      yappy_mobile: { name: "Yappy" }
    }
  },
  bac: {
    id: "bac",
    name: "BAC Credomatic",
    color: "#4A9EFF",
    accounts: {
      bac_savings: { name: "Cuenta Ahorro BAC", type: "savings" },
    },
    cards: {
      amex: { name: "AMEX ConnectMiles", limit: 100 },
      visa_smartcash: { name: "Visa Smartcash", limit: 500 },
    },
  },
} as const;

export const DESIGN_TOKENS = {
  background: "#0B1220",
  card: "#152035",
  border: "#1E3050",
  gold: "#C9A84C",
  green: "#3DD68C",
  red: "#E05555",
  blue: "#4A9EFF",
  purple: "#9B7FE8",
} as const;

export const BUDGET_DEFAULTS = {
  savings: 20,
  fixed: 35,
  variable: 30,
  buffer: 15,
} as const;

// export const WEEKLY_SPLITS = [30, 25, 25, 20] as const;

export const PAYDAY = [15, 30];

export const CATEGORY_COLORS: Record<string, string> = {
  vivienda: "#4A9EFF",
  comida: "#3DD68C",
  transporte: "#C9A84C",
  salud: "#9B7FE8",
  entretenimiento: "#E05555",
  ropa: "#F97316",
  educacion: "#06B6D4",
  ahorro: "#3DD68C",
  servicios: "#64748B",
  credito: "#E05555",
  transferencia: "#94A3B8",
  cuotas: "#F59E0B",
  otros: "#6B7280",
};

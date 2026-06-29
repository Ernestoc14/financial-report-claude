export function fmt(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function pct(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function fmtDate(date: string | Date): string {
  return new Intl.DateTimeFormat("es-PA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function fmtShortDate(date: string | Date): string {
  return new Intl.DateTimeFormat("es-PA", {
    day: "numeric",
    month: "short",
  }).format(new Date(date));
}

export function fmtCompact(amount: number): string {
  if (Math.abs(amount) >= 1000) {
    return `$${(amount / 1000).toFixed(1)}k`;
  }
  return fmt(amount);
}

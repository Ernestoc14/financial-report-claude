const MONTHS_ES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const PAYDAY = [15, 30];

export function getMonthWeekLabel(date: Date = new Date()): string {
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  const { weekIndex, totalWeeks } = getPayCycleInfo(date);
  return `${day} de ${MONTHS_ES[month]} ${year} - Semana ${weekIndex + 1} de ${totalWeeks}`;
}

export interface PayCycleInfo {
  lastPayday: Date;
  nextPayday: Date;
  daysSincePay: number;
  daysUntilPay: number;
  weekIndex: number;
  totalWeeks: number;
  cycleProgress: number;
}

export function getPayCycleInfo(date: Date = new Date()): PayCycleInfo {
  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.getMonth();

  let lastPaydayDay: number;
  let nextPaydayDay: number;
  let nextPaydayMonth = month;
  let nextPaydayYear = year;

  if (day <= PAYDAY[0]) {
    // Between 1st and 15th — last pay was 30th of previous month
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    lastPaydayDay = 30;
    const lastPayday = new Date(prevYear, prevMonth, lastPaydayDay);
    nextPaydayDay = PAYDAY[0];
    const nextPayday = new Date(year, month, nextPaydayDay);
    const cycleLength = Math.round((nextPayday.getTime() - lastPayday.getTime()) / 86400000);
    const daysSincePay = Math.round((date.getTime() - lastPayday.getTime()) / 86400000);
    const daysUntilPay = Math.round((nextPayday.getTime() - date.getTime()) / 86400000);
    const totalWeeks = Math.ceil(cycleLength / 7);
    const weekIndex = Math.min(Math.floor(daysSincePay / 7), totalWeeks - 1);
    return { lastPayday, nextPayday, daysSincePay, daysUntilPay, weekIndex, totalWeeks, cycleProgress: daysSincePay / cycleLength };
  } else {
    // Between 16th and end of month — last pay was 15th of this month
    const lastPayday = new Date(year, month, PAYDAY[0]);
    nextPaydayDay = PAYDAY[1];
    const nextPayday = new Date(year, nextPaydayMonth, nextPaydayDay);
    const cycleLength = Math.round((nextPayday.getTime() - lastPayday.getTime()) / 86400000);
    const daysSincePay = Math.round((date.getTime() - lastPayday.getTime()) / 86400000);
    const daysUntilPay = Math.round((nextPayday.getTime() - date.getTime()) / 86400000);
    const totalWeeks = Math.ceil(cycleLength / 7);
    const weekIndex = Math.min(Math.floor(daysSincePay / 7), totalWeeks - 1);
    return { lastPayday, nextPayday, daysSincePay, daysUntilPay, weekIndex, totalWeeks, cycleProgress: daysSincePay / cycleLength };
  }

  void nextPaydayYear; // suppress unused warning
}

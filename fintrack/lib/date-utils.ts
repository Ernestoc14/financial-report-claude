const MONTHS = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
];

export function getMonthWeekLabel(date: Date = new Date()): string {
    const year = date.getFullYear();
    const month = date.getMonth();
    const dayOfMonth = date.getDate();

    const monthName = MONTHS[month];

    const currentWeek = Math.ceil(dayOfMonth / 7);

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const totalWeeks = Math.ceil(daysInMonth / 7);

    return `${monthName} ${dayOfMonth} ${year} - Semana ${currentWeek} de ${totalWeeks}`;
}
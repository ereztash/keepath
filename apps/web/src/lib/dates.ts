import { startOfWeek, endOfWeek, addDays, addWeeks, format } from 'date-fns';

/**
 * Get Monday 00:00 of the week containing `date`.
 */
export function weekStart(date: Date = new Date()): Date {
  return startOfWeek(date, { weekStartsOn: 1 });
}

/**
 * Get Sunday 23:59:59.999 of the week containing `date`.
 */
export function weekEnd(date: Date = new Date()): Date {
  return endOfWeek(date, { weekStartsOn: 1 });
}

export function previousWeekStart(date: Date = new Date()): Date {
  return addWeeks(weekStart(date), -1);
}

export function nextWeekStart(date: Date = new Date()): Date {
  return addWeeks(weekStart(date), 1);
}

export function weekDays(weekStartDate: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => addDays(weekStartDate, i));
}

export function formatWeekRange(weekStartDate: Date): string {
  const end = endOfWeek(weekStartDate, { weekStartsOn: 1 });
  return `${format(weekStartDate, 'MMM d')} – ${format(end, 'MMM d')}`;
}

export function hoursBetween(start: Date, end: Date): number {
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
}

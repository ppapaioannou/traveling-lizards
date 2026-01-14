const MS_PER_DAY = 24 * 60 * 60 * 1000;

export const startOfDay = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const addDays = (date: Date, days: number): Date => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

export const diffDays = (a: Date, b: Date): number => {
  const aStart = startOfDay(a).getTime();
  const bStart = startOfDay(b).getTime();
  return Math.round((aStart - bStart) / MS_PER_DAY);
};

export const getMondayOfWeek = (date: Date): Date => {
  const d = startOfDay(date);
  const day = d.getDay();
  const diff = (day + 6) % 7;
  return addDays(d, -diff);
};

export const getFridayOfWeek = (date: Date): Date =>
  addDays(getMondayOfWeek(date), 4);

export const isMonday = (date: Date): boolean => startOfDay(date).getDay() === 1;

export const isFriday = (date: Date): boolean => startOfDay(date).getDay() === 5;

const formatDay = (date: Date): string =>
  date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

export const formatRange = (start: Date, end: Date): string =>
  `${formatDay(start)} \u2192 ${formatDay(end)}`;
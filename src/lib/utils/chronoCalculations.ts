// ---------- Basics ----------
export const MS_PER_DAY = 86_400_000;

export const startOfLocalDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const isLeapYear = (year: number) =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

export const daysInYear = (year: number) => (isLeapYear(year) ? 366 : 365);

// Day-of-year: 1..365/366 (UTC-stable)
export function dayOfYear(d: Date): number {
  const utc = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  const yearStartUTC = Date.UTC(d.getFullYear(), 0, 1);
  return Math.floor((utc - yearStartUTC) / MS_PER_DAY) + 1;
}

export function daysRemainingInYear(d: Date): number {
  return daysInYear(d.getFullYear()) - dayOfYear(d);
}

// ---------- Week Numbers ----------
export function isoWeek(d: Date): { year: number; week: number } {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = date.getUTCDay() || 7;            // Sun=0 -> 7
  date.setUTCDate(date.getUTCDate() + 4 - day); // move to Thu of this week
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.floor((date.getTime() - yearStart.getTime()) / MS_PER_DAY / 7) + 1;
  return { year: date.getUTCFullYear(), week };
}

/** Simple ordinal week: week 1 = Jan 1–7, week 2 = Jan 8–14, etc. */
export function ordinalWeek(d: Date): number {
  return Math.floor((dayOfYear(d) - 1) / 7) + 1;
}

/** US-style week (Sun-start; week 1 = week containing Jan 1). */
export function usWeek(d: Date): number {
  const year = d.getFullYear();
  const jan1 = new Date(year, 0, 1);
  const sundayIndex = jan1.getDay(); // Sun=0..Sat=6
  return Math.floor((dayOfYear(d) + sundayIndex - 1) / 7) + 1;
}

// ---------- Fixed English Abbreviations ----------
const DOW_ABBR = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const MON_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

// ---------- Formatters ----------
export function formatDowMonDay(d: Date): string {
  const dow = DOW_ABBR[d.getDay()];
  const mon = MON_ABBR[d.getMonth()];
  const day = d.getDate();
  return `${dow}, ${mon} ${day}`;
}

export function formatDowMonDayYear(d: Date): string {
  const dow = DOW_ABBR[d.getDay()];
  const mon = MON_ABBR[d.getMonth()];
  const day = d.getDate();
  const y = d.getFullYear();
  return `${dow}, ${mon} ${day}, ${y}`;
}

export type WeekSystem = "ISO" | "US" | "ORDINAL";

/** Set default to "US" if you expect Week 40 today. */
export function formatWeekLabel(d: Date, system: WeekSystem = "US"): string {
  if (system === "ISO") {
    const { week } = isoWeek(d);
    return `Week ${week}`;
  }
  if (system === "US") {
    return `Week ${usWeek(d)}`;
  }
  return `Week ${ordinalWeek(d)}`;
}

// ---------- Header Composer ----------
export interface HeaderOptions {
  weekSystem?: WeekSystem; // default: US
  date?: Date;             // default: now
}

export function buildHeader(opts: HeaderOptions = {}): string {
  const date = opts.date ?? new Date();
  const weekSystem = opts.weekSystem ?? "US";
  const parts = [
    `${dayOfYear(date)}/${daysRemainingInYear(date)}`,
    formatWeekLabel(date, weekSystem),
    formatDowMonDay(date),
  ];
  return parts.join(" • ");
}

// ---------- Date arithmetic helpers ----------
function clampToMonth(y: number, m: number, day: number): Date {
  const lastDay = new Date(y, m + 1, 0).getDate();
  return new Date(y, m, Math.min(day, lastDay));
}

function addMonthsClamped(base: Date, months: number): Date {
  const y = base.getFullYear();
  const m = base.getMonth() + months;
  const targetY = y + Math.floor(m / 12);
  const targetM = ((m % 12) + 12) % 12;
  return clampToMonth(targetY, targetM, base.getDate());
}

/** Days until a target (positive if in the future; negative if in the past). */
export function daysUntil(target: Date, from: Date = new Date()): number {
  const a = startOfLocalDay(from).getTime();
  const b = startOfLocalDay(target).getTime();
  return Math.round((b - a) / MS_PER_DAY);
}

/** Age in years as a decimal. */
export function ageInYears(dob: Date, on: Date = new Date(), precision = 2): number {
  const yearMs = 365.2425 * MS_PER_DAY;
  const span = on.getTime() - dob.getTime();
  return Number((span / yearMs).toFixed(precision));
}

/** Next birthday strictly after "on" (handles Feb 29 via clamp). */
export function nextBirthday(dob: Date, on: Date = new Date()): Date {
  const today = startOfLocalDay(on);
  const y = today.getFullYear();
  const thisYear = clampToMonth(y, dob.getMonth(), dob.getDate());
  const next = thisYear > today ? thisYear : clampToMonth(y + 1, dob.getMonth(), dob.getDate());
  return startOfLocalDay(next);
}

/** Next half-birthday strictly after "on" (birthday + 6 months; no birthday fallback). */
export function nextHalfBirthday(dob: Date, on: Date = new Date()): Date {
  const today = startOfLocalDay(on);
  const y = today.getFullYear();

  // Half for current cycle
  const halfThisYear = addMonthsClamped(clampToMonth(y, dob.getMonth(), dob.getDate()), 6);
  if (halfThisYear > today) return startOfLocalDay(halfThisYear);

  // Otherwise the half after next year's birthday
  const halfNextYear = addMonthsClamped(clampToMonth(y + 1, dob.getMonth(), dob.getDate()), 6);
  return startOfLocalDay(halfNextYear);
}

// ---------- Convenience (includes year) ----------
export function formatNextBirthday(dob: Date, on: Date = new Date()): string {
  return formatDowMonDayYear(nextBirthday(dob, on));
}

export function formatHalfBirthday(dob: Date, on: Date = new Date()): string {
  return formatDowMonDayYear(nextHalfBirthday(dob, on));
}

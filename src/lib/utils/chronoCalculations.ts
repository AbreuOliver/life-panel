// ---------- Basics ----------
export const startOfLocalDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const isLeapYear = (year: number) =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

export const daysInYear = (year: number) => (isLeapYear(year) ? 366 : 365);

// Day-of-year: 1..365/366
export function dayOfYear(d: Date): number {
  const utc = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  const yearStartUTC = Date.UTC(d.getFullYear(), 0, 1);
  return Math.floor((utc - yearStartUTC) / 86_400_000) + 1;
}


export function daysRemainingInYear(d: Date): number {
  return daysInYear(d.getFullYear()) - dayOfYear(d);
}

// ---------- Week Numbers ----------
/**
 * ISO week (Mon-start; week 1 = week with first Thursday).
 * Returns { year, week } where week is 1..52/53.
 */
export function isoWeek(d: Date): { year: number; week: number } {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Thursday of this week
  const day = date.getUTCDay() || 7; // Sun=0 -> 7
  date.setUTCDate(date.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.floor(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7) + 1;
  return { year: date.getUTCFullYear(), week };
}

/**
 * Simple ordinal week: week 1 = Jan 1–7, week 2 = Jan 8–14, etc.
 * (No weekday alignment.)
 */
export function ordinalWeek(d: Date): number {
  return Math.floor((dayOfYear(d) - 1) / 7) + 1;
}

/**
 * US-style week (Sun-start; week 1 begins on the week containing Jan 1).
 * Note: This is NOT ISO; it’s aligned to Sunday-start weeks spanning Jan 1.
 */
export function usWeek(d: Date): number {
  const year = d.getFullYear();
  const jan1 = new Date(year, 0, 1);
  const sundayIndex = (jan1.getDay() + 7) % 7; // Sun=0..Sat=6
  return Math.floor((dayOfYear(d) + sundayIndex - 1) / 7) + 1;
}

// ---------- Fixed English Abbreviations ----------
const DOW_ABBR = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const MON_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

// ---------- Formatters ----------
export function formatYear(d: Date): string {
  return String(d.getFullYear());
}

export function formatDayOfYearFraction(d: Date): string {
  const doy = dayOfYear(d);
  const rem = daysRemainingInYear(d);
  return `${doy}/${rem}`;
}

export type WeekSystem = "ISO" | "US" | "ORDINAL";

export function formatWeekLabel(d: Date, system: WeekSystem = "ISO"): string {
  if (system === "ISO") {
    const { week } = isoWeek(d);
    return `Week ${week}`;
  }
  if (system === "US") {
    return `Week ${usWeek(d)}`;
  }
  // ORDINAL
  return `Week ${ordinalWeek(d)}`;
}

export function formatDowMonDay(d: Date): string {
  const dow = DOW_ABBR[d.getDay()];
  const mon = MON_ABBR[d.getMonth()];
  const day = d.getDate();
  return `${dow}, ${mon} ${day}`;
}

// ---------- Header Composer ----------
export interface HeaderOptions {
  weekSystem?: WeekSystem; // default: ISO
  date?: Date;             // default: now
}

export function buildHeader(opts: HeaderOptions = {}): string {
  const date = opts.date ?? new Date();
  const weekSystem = opts.weekSystem ?? "ISO";
  const parts = [
    formatDayOfYearFraction(date),             // e.g., "270/95"
    formatYear(date),                          // e.g., "2025"
    formatWeekLabel(date, weekSystem),         // e.g., "Week 39" (ISO for 2025-09-27)
    formatDowMonDay(date),                     // e.g., "Sat, Sep 27"
  ];
  return parts.join(" • ");
}

// ---------- Example helpers you’ll likely want next ----------
/** Days until a target (positive if in the future; negative if in the past). */
export function daysUntil(target: Date, from: Date = new Date()): number {
  const a = startOfLocalDay(from).getTime();
  const b = startOfLocalDay(target).getTime();
  return Math.round((b - a) / 86_400_000);
}

/** Age in years as a floating number (e.g., 5.50). */
export function ageInYears(dob: Date, on: Date = new Date(), precision = 2): number {
  const yearMs = 365.2425 * 86_400_000; // mean tropical year
  const span = on.getTime() - dob.getTime();
  return Number((span / yearMs).toFixed(precision));
}

/** Next half-birthday date after "on". */
export function nextHalfBirthday(dob: Date, on: Date = new Date()): Date {
  const y = on.getFullYear();
  const candidates = [
    new Date(y, dob.getMonth(), dob.getDate()),
    new Date(y, dob.getMonth() + 6, dob.getDate()),
    new Date(y + 1, dob.getMonth(), dob.getDate()),
    new Date(y + 1, dob.getMonth() + 6, dob.getDate()),
  ].map(startOfLocalDay);
  return candidates.find(c => c.getTime() > startOfLocalDay(on).getTime())!;
}

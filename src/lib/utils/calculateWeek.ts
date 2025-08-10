/**
 * CALCULATE THE CURRENT WEEK NUMBER OF THE YEAR WITH A CUSTOM START DAY
 * @param date - THE DATE TO CALCULATE THE WEEK FOR (DEFAULT TO TODAY)
 * @param weekStartDay - THE DAY WEEK STARTS ON (0 = SUNDAY, 1 = MONDAY, ..., 6 = SATURDAY)
 * @returns THE WEEK NUMBER AS A 1-BASED INTEGER
 */
export function getWeekOfYear(date: Date = new Date(), weekStartDay: number = 0): number {
  // COPY THE DATE TO AVOID MUTATING THE ORIGINAL
  const target = new Date(date.getTime());

  // SET HOURS TO ZERO TO IGNORE TIME PART
  target.setHours(0, 0, 0, 0);

  // GET THE DAY OF THE WEEK FOR THE GIVEN DATE (0 = SUN, 1 = MON, ..., 6 = SAT)
  const dayOfWeek = target.getDay();

  // CALCULATE THE OFFSET FROM THE WEEK START DAY
  // THIS SHIFTS THE DATE BACK TO THE START OF THE WEEK ACCORDING TO weekStartDay
  const dayOffset = (dayOfWeek < weekStartDay) 
    ? 7 - (weekStartDay - dayOfWeek)
    : dayOfWeek - weekStartDay;

  // MOVE THE DATE BACK TO THE START OF THE WEEK
  target.setDate(target.getDate() - dayOffset);

  // GET THE FIRST DAY OF THE YEAR
  const yearStart = new Date(target.getFullYear(), 0, 1);
  yearStart.setHours(0, 0, 0, 0);

  // GET THE DAY OF THE WEEK FOR THE YEAR START
  const yearStartDayOfWeek = yearStart.getDay();

  // CALCULATE OFFSET FROM weekStartDay TO ADJUST YEAR START TO THE FIRST WEEK START
  const yearStartOffset = (yearStartDayOfWeek < weekStartDay)
    ? 7 - (weekStartDay - yearStartDayOfWeek)
    : yearStartDayOfWeek - weekStartDay;

  // ADJUST THE YEAR START DATE BACK TO THE FIRST START OF WEEK IN THE YEAR
  yearStart.setDate(yearStart.getDate() - yearStartOffset);

  // CALCULATE THE NUMBER OF MILLISECONDS BETWEEN TARGET WEEK START AND YEAR START WEEK START
  const diff = target.getTime() - yearStart.getTime();

  // CALCULATE THE NUMBER OF WEEKS (MILLISECONDS DIVIDED BY MILLISECONDS IN A WEEK)
  // ADD 1 TO MAKE IT 1-BASED
  const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
  const weekNumber = Math.floor(diff / oneWeekMs) + 2;

  return weekNumber;
}

/**
 * GET THE START AND END DATES OF THE WEEK FOR A GIVEN DATE AND WEEK START DAY
 * @param date - THE DATE TO CALCULATE THE WEEK RANGE FOR (DEFAULT TO TODAY)
 * @param weekStartDay - THE DAY WEEK STARTS ON (0 = SUNDAY, 1 = MONDAY, ..., 6 = SATURDAY)
 * @returns AN OBJECT WITH `start` AND `end` DATES REPRESENTING THE WEEK RANGE
 */
export function getWeekRange(date: Date = new Date(), weekStartDay: number = 0): { start: Date; end: Date } {
  // COPY DATE TO AVOID MUTATING ORIGINAL
  const target = new Date(date.getTime());
  target.setHours(0, 0, 0, 0);

  // GET THE DAY OF WEEK (0=SUN,...)
  const dayOfWeek = target.getDay();

  // CALCULATE OFFSET TO START OF WEEK
  const dayOffset = (dayOfWeek < weekStartDay) ? 7 - (weekStartDay - dayOfWeek) : dayOfWeek - weekStartDay;

  // CALCULATE START OF WEEK DATE
  const start = new Date(target);
  start.setDate(target.getDate() - dayOffset);
  start.setHours(0, 0, 0, 0);

  // CALCULATE END OF WEEK DATE (6 DAYS AFTER START)
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

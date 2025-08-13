import { writable } from 'svelte/store';

// MEETIND DAY CAN ONLY BE NUMBERS REPRESENTING DAYS OF THE WEEK
export type MeetingDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type ReadingPlan = 'New Testament' | 'Old Testament' | 'Whole Bible';

export interface UserPreferences {
  meetingDay: MeetingDay;
  readingPlan: ReadingPlan;
  completedDays: string[];
  weekOffset: number; // ← Add this: 0 = current week, -1 = last week, +1 = next week
}

export const userPreferences = writable<UserPreferences>({
  meetingDay: 5,
  readingPlan: 'New Testament',
  completedDays: [],
  weekOffset: 0 // ← Default to current week
});

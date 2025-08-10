import { writable } from 'svelte/store';

// MEETIND DAY CAN ONLY BE NUMBERS REPRESENTING DAYS OF THE WEEK
export type MeetingDay = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type ReadingPlan = 'New Testament' | 'Old Testament' | 'Whole Bible';

export interface UserPreferences {
  meetingDay: MeetingDay;
  readingPlan: ReadingPlan;
  completedDays: string[];
}

export const userPreferences = writable<UserPreferences>({
  meetingDay: 1,
  readingPlan: 'New Testament',
  completedDays: []
});

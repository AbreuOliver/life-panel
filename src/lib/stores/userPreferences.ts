import { writable } from 'svelte/store';


export interface UserPreferences {
  meetingDay: number;
  readingPlan: string;
  completedDays: number[];
}

export const userPreferences = writable<UserPreferences>({
  meetingDay: 5,
  readingPlan: 'New Testament',
  completedDays: []
});

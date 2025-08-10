import { writable } from 'svelte/store';


export interface UserPreferences {
  meetingDay: number;
  readingPlan: string;
  completedDays: string[]; 
}

export const userPreferences = writable<UserPreferences>({
  meetingDay: 0,
  readingPlan: 'New Testament',
  completedDays: []
});

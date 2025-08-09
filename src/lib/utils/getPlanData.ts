// src/utils/getReadingPlan.ts
import plansData from '$lib/data/plans.json';

type PlanEntry = {
  plan: string[];
  memoryVerses: string[];
};

type ReadingPlan = {
  plan: string[];
  memoryVerses: string[];
} | null;

/**
 * LOOK UP THE READING PLAN AND MEMORY VERSE FOR A GIVEN WEEK AND PLAN NAME.
 * @param weekNumber - THE CURRENT WEEK NUMBER (1-52)
 * @param selectedPlan - THE PLAN NAME, e.g. "New Testament"
 * @returns THE PLAN AND MEMORY VERSES OR NULL IF NOT FOUND
 */
export function getReadingPlan(
  weekNumber: number,
  selectedPlan: string
): ReadingPlan {
  // MAP USER-FRIENDLY PLAN NAME TO JSON KEY
  const planKeyMap: Record<string, string> = {
    "New Testament": "F260_NewTestament",
    "Whole Bible": "F260_WholeBible",
    "Old Testament": "F260_OldTestament",
  };

  const key = planKeyMap[selectedPlan];
  if (!key) return null; // unknown plan

  const planData = plansData[key];
  if (!planData) return null; // plan data missing

  const weekStr = weekNumber.toString();

  const weekEntry: PlanEntry | undefined = planData[weekStr];
  if (!weekEntry) return null; // week data missing

  return {
    plan: weekEntry.plan,
    memoryVerses: weekEntry.memoryVerses,
  };
}

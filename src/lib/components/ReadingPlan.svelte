<script lang="ts">
  import { onMount } from "svelte";
  import { userPreferences } from "$lib/stores/userPreferences";
  import { getWeekOfYear, getWeekRange } from "$lib/utils/calculateWeek";
  import { getReadingPlan } from "$lib/utils/getPlanData";
  import SectionCard from "$lib/components/SectionCard.svelte";

  const today = new Date();

  // Store subscription
  $: meetingDay = $userPreferences.meetingDay;
  $: selectedPlan = $userPreferences.readingPlan;

  // Week calculation
  $: currentWeek = getWeekOfYear(today, meetingDay);
  $: ({ start, end } = getWeekRange(today, meetingDay));

  function formatDate(date: Date) {
    return date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }

  $: weekRangeString = `${formatDate(start)} - ${formatDate(end)}`;

  // Load reading plan for week
  $: reading = getReadingPlan(currentWeek, selectedPlan);

  // Completion array stored locally after mount
  let allCompleted: boolean[] = [];

  function storageKey() {
    return `plan:${selectedPlan}:week:${currentWeek}`;
  }

  // Load completed days from localStorage (only client)
  function loadCompletedDays() {
    if (typeof localStorage === "undefined") {
      // Not in browser, return default
      return Array(reading?.plan?.length || 0).fill(false);
    }
    const key = storageKey();
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
    return Array(reading?.plan?.length || 0).fill(false);
  }

  // Save completed days to localStorage (only client)
  function saveCompletedDays() {
    if (typeof localStorage === "undefined") return;
    const key = storageKey();
    localStorage.setItem(key, JSON.stringify(allCompleted));
  }

  function toggleDayCompletion(index: number) {
    allCompleted[index] = !allCompleted[index];
    saveCompletedDays();

    userPreferences.update((prefs) => {
      const weekKey = `Week ${currentWeek}, Day ${index + 1}, Plan ${selectedPlan}`;
      const exists = prefs.completedDays.includes(weekKey);
      return {
        ...prefs,
        completedDays: exists
          ? prefs.completedDays.filter((d) => d !== weekKey)
          : [...prefs.completedDays, weekKey],
      };
    });
  }

  // Load completion data only on client mount
  onMount(() => {
    allCompleted = loadCompletedDays();
  });

  // When week or plan changes, reload completion data (only client)
  $: if (reading?.plan && typeof localStorage !== "undefined") {
    allCompleted = loadCompletedDays();
  }

  // Completion percentage (0–1)
  $: completionPercent = reading?.plan?.length
    ? allCompleted.filter(Boolean).length / reading.plan.length
    : 0;

  // Circle geometry
  const radius = 10;
  const circumference = 2 * Math.PI * radius;

  $: dashOffset = circumference * (1 - completionPercent);
</script>

<SectionCard>
  <div class="flex items-center justify-between">
    <h2
      class="pl-1 text-[13px] uppercase font-inter font-medium mb-0 text-[var(--color-text-muted)]"
    >
      Reading Plan
    </h2>
    <div class="flex">
      <!-- <p class="text-[var(--color-text-secondary)] pr-2">
        {completionPercent * 100}%
      </p> -->
      <!-- Animated circular progress -->
      <svg class="w-6 h-6" viewBox="0 0 24 24">
        <!-- Background track -->
        <circle
          cx="12"
          cy="12"
          r={radius}
          stroke="var(--color-text-muted)"
          stroke-width="2"
          fill="none"
          opacity="0.3"
        />
        <!-- Foreground progress -->
        <circle
          cx="12"
          cy="12"
          r={radius}
          stroke="var(--color-primary-green)"
          stroke-width="2"
          fill="none"
          stroke-linecap="round"
          stroke-dasharray={circumference}
          stroke-dashoffset={dashOffset}
          style="transition: stroke-dashoffset 0.4s ease;"
        />
      </svg>
    </div>
  </div>

  <div class="min-h-10 py-2.5">
    <p class="font-manrope text-2xl grow-1 font-semibold text-white mb-3">
      Today
      <span class="text-[var(--color-text-muted)]">
        • {formatDate(new Date())}
      </span>
    </p>

    <div
      class="w-[109.5%] flex items-center justify-center bg-white h-[1px] -ml-4 mt-4 mb-6"
    ></div>

    {#if reading?.plan}
      {#each reading.plan as passage, index}
        <div class="flex items-center justify-between mb-6">
          <!-- Left: Day circle + text -->
          <div class="flex items-center gap-4 flex-1">
            <div
              class="flex flex-col items-center justify-center w-14 h-14 rounded-full bg-[#252525] text-sm font-thin"
            >
              <span class="text-[12px] font-inter text-neutral-400">Day</span>
              <span class="text-md font-inter font-semibold text-neutral-50">
                {index + 1}
              </span>
            </div>
            <p
              class="font-manrope text-lg leading-7 text-[var(--color-text-muted)]"
            >
              {passage}
            </p>
          </div>

          <!-- Right: Checkbox -->
          {#if allCompleted[index]}
            <button
              on:click={() => toggleDayCompletion(index)}
              aria-label={`Mark Week ${currentWeek} Day ${index + 1} as incomplete`}
              class="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-primary-green)] border-[var(--color-primary-green)] text-white"
            >
              <svg
                viewBox="0 0 20 20"
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M4 10l3 3 9-9"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          {:else}
            <button
              on:click={() => toggleDayCompletion(index)}
              aria-label={`Mark Week ${currentWeek} Day ${index + 1} as complete`}
              class="flex items-center justify-center w-12 h-12 rounded-full border border-gray-400 bg-transparent"
            >
            </button>
          {/if}
        </div>
      {/each}
    {:else}
      <p class="font-manrope text-[var(--color-text-muted)]">
        No reading plan available.
      </p>
    {/if}
  </div>
</SectionCard>

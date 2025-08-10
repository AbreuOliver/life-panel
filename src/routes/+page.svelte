<script lang="ts">
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";
  import { userPreferences } from "$lib/stores/userPreferences";
  import { getWeekOfYear, getWeekRange } from "../lib/utils/calculateWeek";
  import { getReadingPlan } from "$lib/utils/getPlanData";
  import SectionCard from "$lib/components/SectionCard.svelte";
  import MemoryVerse from "$lib/components/MemoryVerse.svelte";
  import CalendarCard from "$lib/components/CalendarCard.svelte";
  import ArrowDown from "$lib/components/icons/ArrowDown.svelte";

  const today = new Date();

  // Reactive subscription to store (auto-subscribe via $ prefix)
  $: meetingDay = $userPreferences.meetingDay;

  // Reactive dependent variables
  $: startDay = meetingDay;
  $: currentWeek = getWeekOfYear(today, startDay);
  $: ({ start, end } = getWeekRange(today, startDay));

  function formatDate(date: Date): string {
    return date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }

  $: weekRangeString = `${formatDate(start)} - ${formatDate(end)}`;

  const selectedPlan = "New Testament";

  $: reading = getReadingPlan(currentWeek, selectedPlan);

  const verseText = `The steps of a good man are ordered by the Lord: and He delighteth in his way. Though he fall, he shall not be utterly cast down: for the LORD upholdeth him with His hand.`;

  onMount(() => {
    console.log("Svelte component mounted!");
    console.log("Current meetingDay from store:", meetingDay);
    console.log("Current week:", currentWeek);
  });

  let expanded = false;

  function toggleExpanded() {
    expanded = !expanded;
  }

  $: completed = $userPreferences.completedDays || [];

  // Build the unique key for a given index
  function dayKeyFor(index: number) {
    return `Week ${currentWeek}, Day ${index + 1}`;
  }

  function toggleDayCompletion(index: number) {
    const key = dayKeyFor(index);
    userPreferences.update((prefs) => {
      const exists = prefs.completedDays.includes(key);
      return {
        ...prefs,
        completedDays: exists
          ? prefs.completedDays.filter((d) => d !== key)
          : [...prefs.completedDays, key],
      };
    });
  }
</script>

<main class="space-y-3">
  <SectionCard bgColor="#E8E8E8">
    <h2
      class="pl-1 text-[13px] uppercase font-inter font-medium mb-1.5 cursor-auto text-[var(--color-text-secondary)]"
    >
      Current Reading Plan
    </h2>
    <div
      class="flex items-center min-h-10 p-2.5 border border-[#CDCFCE] rounded-[13px]"
    >
      <p
        class="font-manrope grow-1 font-semibold text-[var(--color-text-primary)]"
      >
        {selectedPlan}
        <span class="text-[var(--color-text-muted)]"
          >• {new Date().getFullYear()}</span
        >
      </p>
      <!-- <button
        on:click={toggleExpanded}
        class="flex justify-end items-center bg-transparent min-h-6.5 ml-auto grow-1"
        aria-expanded={expanded}
        aria-controls="calendar-edit"
      >
        <ArrowDown
          up={expanded}
          color={expanded
            ? "var(--color-primary-green)"
            : "var(--color-text-muted)"}
          size={26}
        />
      </button> -->
    </div>
  </SectionCard>
  <!-- >> CALENDAR >>>>>>>>>>>>>>>>>>>>>>>>>>-->
  <CalendarCard />
  <!-- >> MEMORY VERSE >>>>>>>>>>>>>>>>>>>>>> -->
  <MemoryVerse memoryVerses={reading!.memoryVerses} {verseText} />
  <!-- >> READING PLAN >>>>>>>>>>>>>>>>>>>>>>>-->
  <SectionCard>
    <h2
      class="pl-1 text-[13px] uppercase font-inter font-medium mb-0 text-[var(--color-text-muted)]"
    >
      Reading Plan
    </h2>

    <div class="min-h-10 py-2.5">
      <p class="font-manrope text-2xl grow-1 font-semibold text-white mb-3">
        Today
        <span class="text-[var(--color-text-muted)]"
          >• {formatDate(new Date())}</span
        >
      </p>

      <div
        class="w-[109.5%] flex items-center justify-center bg-white h-0.5 -ml-4 my-4"
      ></div>

      {#if reading?.plan}
        {#each reading.plan as passage, index}
          <div class="flex items-center justify-between mb-6">
            <!-- Left side: Day circle + text -->
            <div class="flex items-center gap-4 flex-1">
              <!-- Day circle -->
              <div
                class="flex flex-col items-center justify-center w-14 h-14 rounded-full bg-[#252525] text-sm font-thin"
              >
                <span class="text-[12px] font-inter text-neutral-400">Day</span>
                <span class="text-md font-inter font-semibold text-neutral-50"
                  >{index + 1}</span
                >
              </div>

              <!-- Passage text -->
              <p
                class="font-manrope text-lg leading-7 text-[var(--color-text-muted)]"
              >
                {passage}
              </p>
            </div>

            <!-- Right side: Checkbox -->
            {#if completed.includes(dayKeyFor(index))}
              <button
                on:click={() => toggleDayCompletion(index)}
                aria-label={`Mark ${dayKeyFor(index)} as incomplete`}
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
                aria-label={`Mark ${dayKeyFor(index)} as complete`}
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
</main>

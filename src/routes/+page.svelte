<script lang="ts">
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";
  import { userPreferences } from "$lib/stores/userPreferences";
  import { getWeekOfYear, getWeekRange } from "../lib/utils/calculateWeek";
  import { getReadingPlan } from "$lib/utils/getPlanData";
  import SectionCard from "$lib/components/SectionCard.svelte";
  import MemoryVerse from "$lib/components/MemoryVerse.svelte";
  import CalendarCard from "$lib/components/CalendarCard.svelte";

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

  function changeMeetingDay(event: Event) {
    const target = event.target as HTMLSelectElement;
    const newDay = parseInt(target.value);
    userPreferences.update((prefs) => ({ ...prefs, meetingDay: newDay }));
  }

  const daysOfWeek = [
    { value: 0, label: "Sunday" },
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
  ];
</script>

<main class="space-y-3">
  <SectionCard bgColor="#E8E8E8">
    <h2
      class="pl-1 text-[14px] uppercase font-inter font-medium mb-1.5 cursor-auto text-[var(--color-text-secondary)]"
    >
      Current Reading Plan
    </h2>
    <div
      class="flex items-center min-h-10 p-2.5 border border-[#CDCFCE] rounded-[13px]"
    >
      <p
        class="font-manrope grow-1 font-semibold text-[var(--color-text-primary)]"
      >
        New Testament
        <span class="text-[var(--color-text-muted)]">• Adult</span>
      </p>
      <button
        class="flex justify-center items-center border-[var(--color-text-muted)] py-0.5 px-2 rounded-[7px] min-h-6.5 cursor-pointer"
      >
        <p class="font-manrope text-xs text-[var(--color-text-muted)]">Edit</p>
      </button>
    </div>
  </SectionCard>
  <!-- CALENDAR -->
  <CalendarCard />
  <!-- <SectionCard bgColor="#E8E8E8">
    <h2
      class="pl-1 text-[14px] uppercase font-inter font-medium mb-1.5 text-[var(--color-text-secondary)]"
    >
      Calendar
    </h2>
    <div class="flex min-h-10 p-2.5 border border-[#CDCFCE] rounded-[13px]">
      <p
        class="font-manrope grow-1 font-semibold text-[var(--color-text-primary)]"
      >
        Week {currentWeek}
        <span class="text-[var(--color-text-muted)]">• {weekRangeString}</span>
      </p>
      <button
        on:click={toggleExpanded}
        class="flex justify-center items-center border-[var(--color-text-muted)] py-0.5 px-2 rounded-[7px] min-h-6.5 cursor-pointer"
        aria-expanded={expanded}
        aria-controls="calendar-edit"
      >
        <p class="font-manrope text-xs text-[var(--color-text-muted)]">
          {expanded ? "Close" : "Edit"}
        </p>
      </button>
    </div>

    {#if expanded}
      <div
        id="calendar-edit"
        class="mt-3 p-3 border border-[#CDCFCE] rounded-[13px] bg-transparent text-black"
        transition:slide={{ duration: 300 }}
      >
        <label
          class="font-manrope font-semibold mb-1 block"
          for="meeting-day-select"
        >
          Select Meeting Day:
        </label>
        <select
          id="meeting-day-select"
          class="border border-gray-300 rounded p-1"
          bind:value={meetingDay}
          on:change={changeMeetingDay}
        >
          {#each daysOfWeek as day}
            <option value={day.value}>
              {day.label}
            </option>
          {/each}
        </select>
        <p class="mt-2 text-sm text-gray-600">
          Current Meeting Day: <strong
            >{daysOfWeek.find((d) => d.value === meetingDay)?.label}</strong
          >
        </p>
      </div>
    {/if}
  </SectionCard> -->

  <MemoryVerse memoryVerses={reading?.memoryVerses} {verseText} />

  <SectionCard>
    <h2
      class="pl-1 text-[12px] uppercase font-inter font-medium mb-1 text-[var(--color-text-secondary)]"
    >
      Reading Plan
    </h2>
    <div class="min-h-10 py-2.5">
      <p class="font-manrope text-2xl grow-1 font-semibold pb-2 text-white">
        Today
        <span class="text-[var(--color-text-muted)]"
          >•
          {formatDate(new Date())}
        </span>
      </p>
      {#each reading!.plan as passage}
        <p class="font-manrope text-lg/6 pl-0.5 text-[var(--color-text-muted)]">
          {passage}
        </p>
      {/each}
    </div>
    <button
      class="flex justify-center items-center py-0.5 px-2 rounded-[7px] min-h-6.5 cursor-pointer bg-[var(--color-primary-green)]"
    >
      <p class="font-manrope text-xs">Reveal Text</p>
    </button>
  </SectionCard>
</main>

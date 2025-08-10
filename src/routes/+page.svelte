<script lang="ts">
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";
  import { userPreferences } from "$lib/stores/userPreferences";
  import { getWeekOfYear, getWeekRange } from "$lib/utils/calculateWeek";
  import { getReadingPlan } from "$lib/utils/getPlanData";
  import SectionCard from "$lib/components/SectionCard.svelte";
  import MemoryVerse from "$lib/components/MemoryVerse.svelte";
  import CalendarCard from "$lib/components/CalendarCard.svelte";
  import ReadingPlan from "$lib/components/ReadingPlan.svelte";

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

  const verseText = ``;

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
  <ReadingPlan />
</main>

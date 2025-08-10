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
          >•
          {formatDate(new Date())}
        </span>
      </p>
      <div
        class="w-[109.5%] flex items-center justify-center bg-white h-0.5 -ml-4 my-4"
      ></div>
      <!-- {#each reading!.plan as passage}
        <p
          class="font-manrope text-2xl/8 pl-0.5 text-[var(--color-text-muted)]"
        >
          {passage}
        </p>
      {/each} -->
      {#each reading!.plan as passage, index}
        <div
          class="flex items-center justify-start border-2 border-transparent"
        >
          <div
            class="flex flex-col items-center justify-center w-14 h-14 rounded-full bg-[#252525] text-sm font-thin mr-4"
            aria-label={`Day ${index + 1}`}
          >
            <span class="tex-[12px] font-inter font-normal text-neutral-400"
              >Day</span
            >
            <span class="text-md font-inter font-semibold text-neutral-50"
              >{index + 1}</span
            >
          </div>
          <p
            class="flex items-center font-manrope text-2xl leading-8 text-[var(--color-text-muted)] text-center max-w-xl min-h-16"
          >
            {passage}
          </p>
        </div>
      {/each}
    </div>
  </SectionCard>
</main>

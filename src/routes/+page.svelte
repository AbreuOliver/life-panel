<script lang="ts">
  import { getWeekOfYear, getWeekRange } from "../lib/utils/calculateWeek";
  import { getReadingPlan } from "$lib/utils/getPlanData";
  import SectionCard from "$lib/components/SectionCard.svelte";
  import MemoryVerse from "$lib/components/MemoryVerse.svelte";

  const selectedPlan = "New Testament";
  //   const selectedPlan = "Whole Bible";

  // TODAY'S DATE
  const today = new Date();

  // USER'S WEEK START DAY (e.g., 0 for Sunday)
  const startDay = 5;

  // CALL THE FUNCTION TO GET CURRENT WEEK NUMBER
  const currentWeek = getWeekOfYear(today, startDay);

  // GET WEEK RANGE (START AND END DATES)
  const { start, end } = getWeekRange(today, startDay);

  // FORMAT DATES FOR DISPLAY
  const formatDate = (date: Date): string =>
    date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

  const weekRangeString = `${formatDate(start)} - ${formatDate(end)}`;

  const reading = getReadingPlan(currentWeek, selectedPlan);

  const verseText = `The steps of a good man are ordered by the Lord:
    and He delighteth in his way.

    Though he fall, he shall not be utterly cast down:
    for the LORD upholdeth him with His hand.`;
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

  <SectionCard bgColor="#E8E8E8">
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
        class="flex justify-center items-center border-[var(--color-text-muted)] py-0.5 px-2 rounded-[7px] min-h-6.5 cursor-pointer"
      >
        <p class="font-manrope text-xs text-[var(--color-text-muted)]">Edit</p>
      </button>
    </div>
  </SectionCard>

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

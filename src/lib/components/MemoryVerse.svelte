<script lang="ts">
  import SectionCard from "$lib/components/SectionCard.svelte";
  import EyeOpen from "./icons/EyeOpen.svelte";
  import EyeClosed from "./icons/EyeClosed.svelte";
  import { userPreferences } from "$lib/stores/userPreferences";
  import kjv from "$lib/data/kjv.json";
  import { derived } from "svelte/store";
  import { getWeekOfYear } from "$lib/utils/calculateWeek";
  import { getReadingPlan } from "$lib/utils/getPlanData";

  let revealed = false;

  function toggleReveal() {
    revealed = !revealed;
  }

  // Derive needed reactive values
  const selectedPlan = derived(userPreferences, ($prefs) => $prefs.readingPlan);
  const meetingDay = derived(userPreferences, ($prefs) => $prefs.meetingDay);

  const currentWeek = derived([meetingDay], ([$meetingDay]) => {
    const today = new Date();
    return getWeekOfYear(today, $meetingDay);
  });

  const readingPlanData = derived(
    [currentWeek, selectedPlan],
    ([$currentWeek, $selectedPlan]) => {
      if (!$selectedPlan) return null;
      return getReadingPlan($currentWeek, $selectedPlan);
    }
  );

  const memoryVersesData = derived(readingPlanData, ($readingPlanData) => {
    if (!$readingPlanData || !$readingPlanData.memoryVerses)
      return { refs: "", verseText: "" };
    const refs = $readingPlanData.memoryVerses;
    let verseText = "";

    if (Array.isArray(refs)) {
      verseText = refs
        .map((ref) => kjv[ref] ?? "")
        .filter(Boolean)
        .join(" ");
    } else {
      verseText = kjv[refs] || "";
    }

    return {
      refs,
      verseText,
    };
  });

  // Local reactive values
  let memoryVerseDisplay: string | string[] = "";
  let verseText: string = "";

  $: memoryVersesData.subscribe(({ refs, verseText: text }) => {
    memoryVerseDisplay = refs;
    verseText = text;
  });
</script>

<SectionCard>
  <h2
    class="pl-1 text-[12px] uppercase font-inter font-medium mb-1 text-[var(--color-text-secondary)]"
  >
    Memory Verse
  </h2>

  <p class="font-manrope text-2xl grow-1 font-semibold text-white">
    {Array.isArray(memoryVerseDisplay)
      ? memoryVerseDisplay.join(", ")
      : memoryVerseDisplay}
  </p>

  <div class="min-h-10 py-2.5 relative">
    <p
      class="font-manrope text-lg/6 pl-0.5 text-[var(--color-text-muted)] transition-filter duration-300"
      class:blur-sm={!revealed}
      aria-label="Memory verse text"
    >
      {verseText || "No verse text available."}
    </p>
  </div>

  <button
    on:click={toggleReveal}
    class="flex items-center py-0.5 px-2 rounded-[7px] min-h-8 cursor-pointer bg-[var(--color-primary-green)] mt-2 ml-auto"
    aria-pressed={revealed}
  >
    {#if revealed}
      <EyeClosed color="#212121" size={14} />
    {:else}
      <EyeOpen color="#212121" size={14} />
    {/if}
    <p class="font-manrope text-xs pr-2">
      {revealed ? "Hide Text" : "Reveal Text"}
    </p>
  </button>
</SectionCard>

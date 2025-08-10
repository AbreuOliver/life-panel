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

  const selectedPlan = derived(userPreferences, ($prefs) => {
    console.log("selectedPlan:", $prefs.readingPlan);
    return $prefs.readingPlan;
  });

  const meetingDay = derived(userPreferences, ($prefs) => {
    console.log("meetingDay:", $prefs.meetingDay);
    return $prefs.meetingDay;
  });

  const currentWeek = derived([meetingDay], ([$meetingDay]) => {
    const today = new Date();
    const week = getWeekOfYear(today, $meetingDay);
    console.log("currentWeek:", week);
    return week;
  });

  const readingPlanData = derived(
    [currentWeek, selectedPlan],
    ([$currentWeek, $selectedPlan]) => {
      console.log("getReadingPlan args:", { $currentWeek, $selectedPlan });
      if (!$selectedPlan) return null;
      const data = getReadingPlan($currentWeek, $selectedPlan);
      console.log("readingPlanData:", data);
      return data;
    }
  );

  function expandVerseRange(ref: string): string[] {
    // Match pattern like: Book Chapter:StartVerse-EndVerse or Book Chapter:Verse
    // Examples: "Psalms 37:4-6", "Genesis 1:1"
    const rangeRegex = /^(.+?) (\d+):(\d+)(-(\d+))?$/;
    const match = ref.match(rangeRegex);
    if (!match) {
      // Not a recognized pattern, return as-is in an array
      return [ref];
    }
    const book = match[1];
    const chapter = match[2];
    const startVerse = parseInt(match[3]);
    const endVerse = match[5] ? parseInt(match[5]) : startVerse;

    const verses = [];
    for (let v = startVerse; v <= endVerse; v++) {
      verses.push(`${book} ${chapter}:${v}`);
    }
    return verses;
  }

  let memoryVerseDisplay: string | string[] = "";
  let verseText: string = "";

  $: memoryVersesData.subscribe(({ refs, verseText: text }) => {
    console.log("Final memoryVersesData output:", { refs, text });
    memoryVerseDisplay = refs;
    verseText = text;
  });

  const memoryVersesData = derived(readingPlanData, ($readingPlanData) => {
    if (!$readingPlanData || !$readingPlanData.memoryVerses) {
      return { refs: "", verseText: "" };
    }

    const refs = $readingPlanData.memoryVerses;

    function formatVerse(text: string): string {
      let formatted = text.replace(/#/g, "\n");
      formatted = formatted.replace(/\[([^\]]+)\]/g, "$1");
      return formatted;
    }

    let verseText = "";

    if (Array.isArray(refs)) {
      verseText = refs
        .map((ref) => {
          // expand range refs into individual verse keys
          const expandedRefs = expandVerseRange(ref);
          const verses = expandedRefs
            .map((key) => kjv[key] ?? "")
            .filter(Boolean)
            .map(formatVerse)
            .join(" ");
          return verses;
        })
        .filter(Boolean)
        .join(" ");
    } else {
      const expandedRefs = expandVerseRange(refs);
      verseText = expandedRefs
        .map((key) => kjv[key] ?? "")
        .filter(Boolean)
        .map(formatVerse)
        .join(" ");
    }

    return { refs, verseText };
  });
</script>

<SectionCard>
  <h2
    class="pl-1 text-[13px] uppercase font-inter font-medium mb-1 text-[var(--color-text-muted)]"
  >
    Memory Verse
  </h2>

  <p class="font-manrope text-2xl grow-1 font-semibold text-white">
    {Array.isArray(memoryVerseDisplay)
      ? memoryVerseDisplay.join(", ")
      : memoryVerseDisplay}
  </p>

  <div class="min-h-10 py-4 relative">
    <p
      class="font-manrope text-lg/6 pl-0.5 text-[var(--color-text-muted)] transition-filter duration-300 whitespace-pre-line"
      class:blur-sm={!revealed}
      aria-label="Memory verse text"
    >
      {@html verseText || "No verse text available."}
    </p>
  </div>

  <button
    on:click={toggleReveal}
    class="flex items-center py-0.5 px-3 rounded-2xl min-h-9 cursor-pointer bg-[var(--color-primary-green)] mt-2 ml-auto"
    aria-pressed={revealed}
  >
    {#if revealed}
      <EyeClosed color="#1E1E1E" size={16} />
    {:else}
      <EyeOpen color="#1E1E1E" size={16} />
    {/if}
    <p class="font-manrope text-sm pr-2 py-1">
      {revealed ? "Hide Text" : "Reveal Text"}
    </p>
  </button>
</SectionCard>

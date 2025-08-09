<script lang="ts">
  import SectionCard from "$lib/components/SectionCard.svelte";
  import EyeOpen from "./icons/EyeOpen.svelte";
  import EyeClosed from "./icons/EyeClosed.svelte";

  export let memoryVerses: string | string[] = ""; // verse references (e.g., ["Psalm 37:23-24"])
  export let verseText: string = ""; // full verse passage text

  let revealed = false;

  function toggleReveal() {
    revealed = !revealed;
  }

  // Format memoryVerses display (join if array)
  $: memoryVerseDisplay = Array.isArray(memoryVerses)
    ? memoryVerses.join(", ")
    : memoryVerses;
</script>

<SectionCard>
  <h2
    class="pl-1 text-[12px] uppercase font-inter font-medium mb-1 text-[var(--color-text-secondary)]"
  >
    Memory Verse
  </h2>

  <p class="font-manrope text-2xl grow-1 font-semibold text-white">
    {memoryVerseDisplay}
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
      <EyeClosed color={`#212121`} size={14} />
    {:else}
      <EyeOpen color={`#212121`} size={14} />
    {/if}
    <p class="font-manrope text-xs pr-2">
      {revealed ? "Hide Text" : "Reveal Text"}
    </p>
  </button>
</SectionCard>

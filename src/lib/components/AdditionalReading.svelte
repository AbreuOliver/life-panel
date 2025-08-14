<script lang="ts">
  import { slide } from "svelte/transition";
  import { onMount } from "svelte";
  import SectionCard from "$lib/components/SectionCard.svelte";

  let today: Date = new Date();
  let dayOfMonth = today.getDate();

  // Computed readings
  let proverbChapter = dayOfMonth; // Proverbs chapter matches the date
  let psalmsStart = dayOfMonth * 5 - 4; // Adjusted so 1st day starts at Psalm 1
  let psalmsEnd = dayOfMonth * 5;

  onMount(() => {
    console.log(
      `Proverb ${proverbChapter}, Psalms ${psalmsStart}-${psalmsEnd}`
    );
  });
</script>

<SectionCard bgColor="#82D844" padding="md">
  <h2
    class="pl-1 text-[13px] uppercase font-inter font-medium mb-1.5 cursor-auto text-[var(--color-text-secondary)]"
  >
    Additional Reading <span class="text-black pl-3"
      >Daily Psalms & Proverb</span
    >
  </h2>

  <div class="flex flex-col gap-2 min-h-10 p-2.5 rounded-[13px]">
    <p
      class="font-manrope text-2xl grow-1 mb-3 font-semibold text-[var(--color-text-primary)]"
    >
      Proverbs {proverbChapter}
    </p>
    <p
      class="font-manrope text-2xl grow-1 mb-3 font-semibold text-[var(--color-text-primary)]"
    >
      Psalms {psalmsStart}–{psalmsEnd}
    </p>
  </div>

  <!-- Keep the rest of your existing content here -->
</SectionCard>

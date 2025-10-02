<script lang="ts">
  import ResetIcon from "$lib/components/icons/ResetIcon.svelte";

  // A simple array of verses; expand as needed
  const verses = [
    {
      text: "“Follow...holiness, without which, no man shall see the Lord.”",
      ref: "Hebrews 12:14",
    },
    {
      text: "“The fear of the Lord is the beginning of wisdom.”",
      ref: "Proverbs 9:10",
    },
    {
      text: "“Thy word is a lamp unto my feet, and a light unto my path.”",
      ref: "Psalm 119:105",
    },
  ];

  let index = 0;
  let up = false; // for icon rotation animation

  function nextVerse() {
    up = !up;
    index = (index + 1) % verses.length;
  }
</script>

<aside
  class="sticky flex items-center py-2 h-full max-h-[56px] top-0 z-10 w-full px-6 bg-neutral-700 tracking-wider"
>
  <!-- Centered text block -->
  <div class="flex-1 text-center text-white">
    <p
      class="font-manrope text-xs font-normal tracking-tight max-w-[45ch] mx-auto"
    >
      {verses[index].text}
    </p>
    <p class="font-manrope text-xs font-normal tracking-tight">
      {verses[index].ref}
    </p>
  </div>

  <!-- Button fixed to right edge -->
  <button
    on:click={nextVerse}
    class="ml-auto flex items-center justify-center rounded-full p-1 hover:bg-neutral-600 focus:outline-none"
    aria-label="Next verse"
  >
    <ResetIcon color="white" size={14} {up} />
  </button>
</aside>

<style></style>

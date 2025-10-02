<!-- <script lang="ts">
  import { onMount } from "svelte";
  import { isInstalledAsPWA } from "$lib/utils/pwaModeDetect";
  import { browser } from "$app/environment";
  import { buildHeader } from "$lib/utils/chronoCalculations";

  const headerISO = buildHeader({ weekSystem: "ISO" });
  // "270/95 • 2025 • Week 39 • Sat, Sep 27" for 2025-09-27 (ISO standard)

  const headerUS = buildHeader({ weekSystem: "US" });
  // Sunday-start, Jan-1-anchored week numbering

  const headerOrdinal = buildHeader({ weekSystem: "ORDINAL" });

  let pwaIOS = false;

  onMount(() => {
    if (!browser) return;

    const isPWA = isInstalledAsPWA();
    const ua = navigator.userAgent;

    if (isPWA && /iPhone|iPad/.test(ua)) {
      pwaIOS = true;
    }
  });
</script>

<aside
  class={`flex justify-center items-center text-center py-2 h-full max-h-[56px] sticky top-0 z-10 w-full px-6 ${
    pwaIOS ? "pwa-ios" : "default-header"
  }`}
>
  <h1
    class={`max-w-[45ch] mx-auto w-full font-manrope text-lg font-bold tracking-tight ${
      pwaIOS ? "text-white" : "text-primary-green"
    }`}
  >
    <span class="tracking-tighter">{headerUS}</span>
  </h1>
</aside>

<style></style> -->

<script lang="ts">
  import { usWeek, startOfLocalDay } from "$lib/utils/chronoCalculations";

  // --- Today and “this week” (Sun-start) ---
  const today = startOfLocalDay(new Date());
  const dow = today.getDay(); // Sun=0..Sat=6

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - dow);

  const days = Array.from(
    { length: 7 },
    (_, i) =>
      new Date(
        weekStart.getFullYear(),
        weekStart.getMonth(),
        weekStart.getDate() + i
      )
  );

  // Header label e.g., "September 2025"
  const currentMonth = new Intl.DateTimeFormat("en-US", {
    month: "long",
  }).format(today);

  const currentYear = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
  }).format(today);

  // US-style week number (Sun-start; week containing Jan 1 = week 1)
  const weekNumber = usWeek(today);

  const DOW = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

  function isSameDay(a: Date, b: Date) {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }
</script>

<aside
  class="flex flex-col items-center justify-center text-center py-2 h-full sticky top-0 z-10 w-full bg-white text-neutral-700 border-b border-neutral-300 pb-4"
  aria-label="Week strip"
>
  <!-- Month / Year -->
  <div class="font-manrope text-xl font-semibold pb-2">
    {currentMonth}
    <span class="text-neutral-800 font-bold">{currentYear}</span>
  </div>

  <!-- 8-column week strip: header row + values row -->
  <div class="w-full px-2">
    <!-- Header row -->
    <div
      class="grid grid-cols-8 gap-x-2 text-[10px] leading-5 uppercase tracking-wide text-neutral-700"
    >
      <div class="text-center text-orange-600">WK</div>
      {#each DOW as label}
        <div class="text-center">{label}</div>
      {/each}
    </div>

    <!-- Values row -->
    <div class="grid grid-cols-8 gap-x-2 items-center mt-1">
      <!-- Week number -->
      <div class="text-center text-orange-600 text-sm font-semibold">
        {weekNumber}
      </div>

      <!-- Day numbers (Sun..Sat) -->
      {#each days as d}
        <div class="text-center">
          <span
            class="inline-flex items-center justify-center w-6 h-6 rounded text-sm"
            class:text-white={isSameDay(d, today)}
            class:bg-blue-600={isSameDay(d, today)}
            class:rounded-full={isSameDay(d, today)}
            class:text-nuetral-600={!isSameDay(d, today)}
            class:ring-2={isSameDay(d, today)}
            class:ring-white={isSameDay(d, today)}
          >
            {d.getDate()}
          </span>
        </div>
      {/each}
    </div>
  </div>
</aside>

<style>
  /* Optional: reduce layout shift on narrow screens by ensuring fixed cell width */
  :global(.grid-cols-8 > div) {
    min-width: 0;
  }
</style>

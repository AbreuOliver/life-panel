<script lang="ts">
  import { slide } from "svelte/transition";
  import SectionCard from "$lib/components/SectionCard.svelte";
  import ArrowDown from "$lib/components/icons/ArrowDown.svelte";
  import type { Person } from "$lib/data/persons";

  // IMPORT corrected utilities from chronoCalculations.ts
  import {
    nextBirthday,
    nextHalfBirthday,
    daysUntil,
    ageInYears, // keep your age decimal consistent
    // If you already have a y/m/d age helper elsewhere, keep it. Otherwise:
  } from "$lib/utils/chronoCalculations";
  // Year-including date formatter
  import { formatDowMonDayYear as fmtWithYear } from "$lib/utils/chronoCalculations";

  export let person: Person; // { id, name, dob, ... }

  // minimal DOB parser (accepts "YYYY-MM-DD" or "MM/DD/YYYY")
  function parseDOB(input: string | Date): Date {
    if (input instanceof Date)
      return new Date(input.getFullYear(), input.getMonth(), input.getDate());
    if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
      const [y, m, d] = input.split("-").map(Number);
      return new Date(y, m - 1, d);
    }
    const [m, d, y] = input.split("/").map(Number);
    return new Date(y, m - 1, d);
  }

  // Optional: keep your calendar-accurate Y/M/D breakdown
  function diffYMD(
    from: Date,
    to: Date
  ): { years: number; months: number; days: number } {
    const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
    const end = new Date(to.getFullYear(), to.getMonth(), to.getDate());
    let a = start,
      b = end;
    if (a > b) [a, b] = [b, a];
    let years = b.getFullYear() - a.getFullYear();
    let months = b.getMonth() - a.getMonth();
    let days = b.getDate() - a.getDate();
    if (days < 0) {
      const pm = new Date(b.getFullYear(), b.getMonth(), 0);
      days += pm.getDate();
      months -= 1;
    }
    if (months < 0) {
      months += 12;
      years -= 1;
    }
    return { years, months, days };
  }

  // ---- reactive derived from prop ----
  $: today = new Date();
  $: personName = person?.name ?? "";
  $: dob = parseDOB(person?.dob ?? "");

  $: ageYearsDecimal = ageInYears(dob, today, 2);
  $: ageParts = diffYMD(dob, today);

  // USE the fixed helpers (these **only** return the correct milestone)
  $: bday = nextBirthday(dob, today);
  $: half = nextHalfBirthday(dob, today);

  // year-including labels + day counts
  $: bdayText = `${fmtWithYear(bday)} (${daysUntil(bday, today)} ${daysUntil(bday, today) === 1 ? "day" : "days"})`;
  $: halfText = `${fmtWithYear(half)} (${daysUntil(half, today)} ${daysUntil(half, today) === 1 ? "day" : "days"})`;

  // UI state
  let cardExpanded = false;
  const toggleCardExpanded = () => (cardExpanded = !cardExpanded);
  const onHeaderKeydown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleCardExpanded();
    }
  };
  const cardPanelId = "person-age-panel";
</script>

<SectionCard bgColor="#E8E8E8" padding="md">
  <h2
    class="pl-1 text-[13px] uppercase font-inter font-semibold mb-1 text-[var(--color-text-primary)] pb-1"
  >
    {personName}
    <span class="text-[var(--color-text-muted)]"
      >• {ageYearsDecimal}
      yrs</span
    >
  </h2>

  <div
    class="w-full p-3 rounded-[13px] border border-[#CDCFCE] focus:outline-none"
  >
    <button
      class="flex items-center w-full"
      on:click={toggleCardExpanded}
      on:keydown={onHeaderKeydown}
      aria-expanded={cardExpanded}
      aria-controls={cardPanelId}
    >
      <div class="flex flex-col items-start text-left mr-auto space-y-1.5">
        <p class="font-manrope font-semibold text-[var(--color-text-primary)]">
          Age: {ageYearsDecimal} yrs •
          <span class="text-[var(--color-primary-green)] text-bold">
            {ageParts.years}y {ageParts.months}m {ageParts.days}d
          </span>
        </p>
      </div>

      <ArrowDown
        up={cardExpanded}
        color={cardExpanded
          ? "var(--color-primary-green)"
          : "var(--color-text-muted)"}
        size={28}
      />
    </button>
  </div>

  {#if cardExpanded}
    <div
      id={cardPanelId}
      class="mt-4 space-y-3"
      transition:slide={{ duration: 300 }}
    >
      <div
        class="flex flex-col min-h-10 p-2.5 border border-[#CDCFCE] rounded-[13px]"
      >
        <p class="font-manrope font-semibold text-[var(--color-text-primary)]">
          Next Birthday:
          <span class="text-[var(--color-primary-green)]">{bdayText}</span>
        </p>
        <p class="font-manrope font-semibold text-[var(--color-text-primary)]">
          Half-Birthday:
          <span class="text-[var(--color-primary-green)]">{halfText}</span>
        </p>
      </div>
    </div>
  {/if}
</SectionCard>

<style>
  button:focus-visible {
    outline: 2px solid var(--color-primary-green);
    outline-offset: 2px;
  }
</style>

<script lang="ts">
  import { slide } from "svelte/transition";
  import SectionCard from "$lib/components/SectionCard.svelte";
  import ArrowDown from "$lib/components/icons/ArrowDown.svelte";
  import type { Person } from "$lib/data/persons"; // { id, name, dob, color? }

  // ---- PROP ----
  export let person: Person; // required

  // ---- UTILITIES (consider moving to a shared module) ----
  const MS_PER_DAY = 86_400_000;
  const startOfLocalDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());

  function parseDOB(input: string | Date): Date {
    if (input instanceof Date) return startOfLocalDay(input);
    // Accept "YYYY-MM-DD" or "MM/DD/YYYY"
    if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
      const [y, m, d] = input.split("-").map(Number);
      return new Date(y, m - 1, d);
    }
    const [m, d, y] = input.split("/").map(Number);
    return new Date(y, m - 1, d);
  }

  function daysBetween(a: Date, b: Date): number {
    const A = startOfLocalDay(a).getTime();
    const B = startOfLocalDay(b).getTime();
    return Math.round((B - A) / MS_PER_DAY);
  }
  const daysUntil = (target: Date, from: Date = new Date()) =>
    daysBetween(from, target);

  function nextBirthday(dob: Date, from: Date = new Date()): Date {
    const y = from.getFullYear();
    const candidate = new Date(y, dob.getMonth(), dob.getDate());
    return candidate > startOfLocalDay(from)
      ? candidate
      : new Date(y + 1, dob.getMonth(), dob.getDate());
  }

  function nextHalfBirthday(dob: Date, from: Date = new Date()): Date {
    const y = from.getFullYear();
    const thisYearBday = new Date(y, dob.getMonth(), dob.getDate());
    const thisYearHalf = new Date(y, dob.getMonth() + 6, dob.getDate());
    const candidates = [
      thisYearBday,
      thisYearHalf,
      new Date(y + 1, dob.getMonth(), dob.getDate()),
      new Date(y + 1, dob.getMonth() + 6, dob.getDate()),
    ].map(startOfLocalDay);
    const now = startOfLocalDay(from).getTime();
    const nxt = candidates.find((c) => c.getTime() > now);
    return nxt ?? candidates[candidates.length - 1];
  }

  function diffYMD(
    from: Date,
    to: Date
  ): { years: number; months: number; days: number } {
    let start = startOfLocalDay(from);
    let end = startOfLocalDay(to);
    if (start > end) [start, end] = [end, start];
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();
    if (days < 0) {
      const pm = new Date(end.getFullYear(), end.getMonth(), 0);
      days += pm.getDate();
      months -= 1;
    }
    if (months < 0) {
      months += 12;
      years -= 1;
    }
    return { years, months, days };
  }

  function ageFloatYears(
    dob: Date,
    on: Date = new Date(),
    precision = 2
  ): number {
    const yearMs = 365.2425 * MS_PER_DAY;
    return Number(((on.getTime() - dob.getTime()) / yearMs).toFixed(precision));
  }

  const fmtDate = (d: Date) =>
    d.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

  // ---- REACTIVE DERIVED FROM PROP ----
  $: today = new Date();
  $: personName = person?.name ?? "";
  $: dob = parseDOB(person?.dob ?? "");
  $: ageParts = diffYMD(dob, today);
  $: ageYearsDecimal = ageFloatYears(dob, today, 2);
  $: half = nextHalfBirthday(dob, today);
  $: bday = nextBirthday(dob, today);
  $: daysToHalf = daysUntil(half, today);
  $: daysToBday = daysUntil(bday, today);

  // ---- UI STATE ----
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
    class="pl-1 text-[13px] uppercase font-inter font-semibold mb-1 text-[var(--color-text-muted)] pb-1"
  >
    {personName}
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
          <span class="text-[var(--color-primary-green)]">
            {fmtDate(bday)} ({daysToBday}
            {daysToBday === 1 ? "day" : "days"})
          </span>
        </p>
        <p class="font-manrope font-semibold text-[var(--color-text-primary)]">
          Half-Birthday:
          <span class="text-[var(--color-primary-green)]">
            {fmtDate(half)} ({daysToHalf}
            {daysToHalf === 1 ? "day" : "days"})
          </span>
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

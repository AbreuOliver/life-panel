<script lang="ts">
  import { slide } from "svelte/transition";
  import { userPreferences } from "$lib/stores/userPreferences";
  import { getWeekOfYear, getWeekRange } from "$lib/utils/calculateWeek";
  import SectionCard from "./SectionCard.svelte";

  const today = new Date();

  $: meetingDay = $userPreferences.meetingDay;
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

  let expanded = false;

  function toggleExpanded() {
    expanded = !expanded;
  }

  function changeMeetingDay(event: Event) {
    const target = event.target as HTMLSelectElement;
    const newDay = parseInt(target.value);
    userPreferences.update((prefs) => ({ ...prefs, meetingDay: newDay }));
  }

  const daysOfWeek = [
    { value: 0, label: "Sunday" },
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
  ];
</script>

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
      on:click={toggleExpanded}
      class="flex justify-center items-center border-[var(--color-text-muted)] py-0.5 px-2 rounded-[7px] min-h-6.5 cursor-pointer"
      aria-expanded={expanded}
      aria-controls="calendar-edit"
    >
      <p class="font-manrope text-xs text-[var(--color-text-muted)]">
        {expanded ? "Close" : "Edit"}
      </p>
    </button>
  </div>

  {#if expanded}
    <div
      id="calendar-edit"
      class="mt-3 p-3 border border-[#CDCFCE] rounded-[13px] bg-transparent text-black"
      transition:slide={{ duration: 300 }}
    >
      <label
        class="font-manrope font-semibold mb-1 block"
        for="meeting-day-select"
      >
        Select Meeting Day:
      </label>
      <select
        id="meeting-day-select"
        class="border border-gray-300 rounded p-1"
        bind:value={meetingDay}
        on:change={changeMeetingDay}
      >
        {#each daysOfWeek as day}
          <option value={day.value}>
            {day.label}
          </option>
        {/each}
      </select>
      <p class="mt-2 text-sm text-gray-600">
        Current Meeting Day: <strong
          >{daysOfWeek.find((d) => d.value === meetingDay)?.label}</strong
        >
      </p>
    </div>
  {/if}
</SectionCard>

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

  function changeMeetingDay(newDay: number) {
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
      <p
        class="font-inter font-semibold tracking-tight text-[var(--color-text-secondary)] font-sm mb-2"
      >
        Select Meeting Day:
      </p>
      <fieldset class="flex justify-between" aria-label="Select Meeting Day">
        {#each daysOfWeek as day}
          <label
            class="cursor-pointer select-none rounded px-2 py-1 border transition
                 flex items-center justify-center text-center
                 text-sm font-semibold flex-1 max-w-[calc(100%/7)]
                 {meetingDay === day.value
              ? 'border-[var(--color-primary-green)] bg-[var(--color-primary-green)]/20'
              : 'border-transparent hover:border-gray-400'}"
          >
            <input
              type="radio"
              name="meetingDay"
              value={day.value}
              bind:group={meetingDay}
              class="sr-only"
              on:change={() => changeMeetingDay(day.value)}
            />
            {day.label.slice(0, 3)}
          </label>
        {/each}
      </fieldset>

      <!-- <p class="mt-2 text-sm text-gray-600">
        Current Meeting Day:
        <strong>{daysOfWeek.find((d) => d.value === meetingDay)?.label}</strong>
      </p> -->
    </div>
  {/if}
</SectionCard>

<script lang="ts">
  import { slide } from "svelte/transition";
  import { userPreferences } from "$lib/stores/userPreferences";
  import { getWeekOfYear, getWeekRange } from "$lib/utils/calculateWeek";
  import { getReadingPlan } from "$lib/utils/getPlanData";
  import SectionCard from "$lib/components/SectionCard.svelte";
  import ArrowDown from "$lib/components/icons/ArrowDown.svelte";

  const today = new Date();
  $: selectedPlan = $userPreferences.readingPlan;

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
  $: reading = getReadingPlan(currentWeek, selectedPlan);

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
    class="pl-1 text-[13px] uppercase font-inter font-medium mb-1.5 cursor-auto text-[var(--color-text-secondary)]"
  >
    Current Reading Plan
  </h2>
  <div
    class="flex items-center min-h-10 p-2.5 border border-[#CDCFCE] rounded-[13px]"
  >
    <p
      class="font-manrope grow-1 font-semibold text-[var(--color-text-primary)]"
    >
      {selectedPlan}
      <span class="text-[var(--color-text-muted)]"
        >• {new Date().getFullYear()}</span
      >
    </p>
    <!-- <button
        on:click={toggleExpanded}
        class="flex justify-end items-center bg-transparent min-h-6.5 ml-auto grow-1"
        aria-expanded={expanded}
        aria-controls="calendar-edit"
      >
        <ArrowDown
          up={expanded}
          color={expanded
            ? "var(--color-primary-green)"
            : "var(--color-text-muted)"}
          size={26}
        />
      </button> -->
  </div>
  <h2
    class="pl-1 text-[13px] uppercase font-inter font-medium mb-1.5 text-[var(--color-text-secondary)]"
  >
    Calendar
  </h2>
  <div class="flex min-h-10 p-2.5 border border-[#CDCFCE] rounded-[13px]">
    <p
      class="font-manrope grow-1 font-semibold text-[var(--color-text-primary)]"
    >
      Week {currentWeek}
      <span class="text-[var(--color-text-secondary)]">• {weekRangeString}</span
      >
    </p>
    <button
      on:click={toggleExpanded}
      class="flex justify-end items-center bg-transparent min-h-6.5 cursor-pointer ml-auto grow-1"
      aria-expanded={expanded}
      aria-controls="calendar-edit"
    >
      <ArrowDown
        up={expanded}
        color={expanded
          ? "var(--color-primary-green)"
          : "var(--color-text-muted)"}
        size={26}
      />
    </button>
  </div>
  {#if expanded}
    <div
      id="calendar-edit"
      class="mt-3 p-3 rounded-[13px] bg-neutral-100"
      transition:slide={{ duration: 300 }}
    >
      <p
        class="font-inter font-medium tracking-tight text-[var(--color-text-muted)] font-sm mb-4"
      >
        Current Meeting Day: <span class="text-[var(--color-text-secondary)]"
          >{daysOfWeek.find((d) => d.value === meetingDay)?.label}</span
        >
      </p>
      <fieldset
        class="-ml-2 flex justify-between"
        aria-label="Select Meeting Day"
      >
        {#each daysOfWeek as day}
          <label
            class="cursor-pointer select-none rounded-[3rem] h-12 px-2 py-1 border transition
                 flex items-center justify-center text-center text-[var(--color-text-secondary)]
                 text-sm font-medium flex-1 max-w-[calc(100%/7)]
                 {meetingDay === day.value
              ? 'border-[var(--color-primary-green)] bg-[var(--color-primary-green)] text-[var(--color-text-primary)]'
              : 'border-transparent hover:border-[var(--color-text-muted)]'}"
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

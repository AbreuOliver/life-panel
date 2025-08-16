<script lang="ts">
  import { slide } from "svelte/transition";
  import { onMount } from "svelte";
  import {
    userPreferences,
    type MeetingDay,
  } from "$lib/stores/userPreferences.store";
  import { getWeekOfYear, getWeekRange } from "$lib/utils/calculateWeek";
  import { getReadingPlan } from "$lib/utils/getPlanData";
  import SectionCard from "$lib/components/SectionCard.svelte";
  import ArrowDown from "$lib/components/icons/ArrowDown.svelte";
  import NarrowArrow from "$lib/components/icons/NarrowArrow.svelte";

  let meetingDay: MeetingDay = 0;

  // ==================== CONSTANTS ====================
  const today = new Date();

  // ==================== REACTIVE STORE VALUES ====================
  $: selectedPlan = $userPreferences.readingPlan;
  $: meetingDay = $userPreferences.meetingDay;
  $: weekOffset = $userPreferences.weekOffset;

  // ==================== DERIVED REACTIVE VALUES ====================
  let displayDate: Date;

  // Calculate display date based on week offset
  $: {
    const d = new Date(today);
    d.setDate(d.getDate() + weekOffset * 7);
    displayDate = d;
  }

  // Week start day is the meeting day
  $: startDay = meetingDay;

  // Calculate current week number based on displayDate and week start day
  $: currentWeek = getWeekOfYear(displayDate, startDay);

  // Calculate start and end dates of the displayed week
  $: ({ start, end } = getWeekRange(displayDate, startDay));

  // Format the week range string for display
  function formatDate(date: Date): string {
    return date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }
  $: weekRangeString = `${formatDate(start)} - ${formatDate(end)}`;

  // Get reading plan for the displayed week
  $: reading = getReadingPlan(currentWeek, selectedPlan);

  // Check if we're viewing the current week
  $: isCurrentWeek = weekOffset === 0;

  // ==================== LOCAL STATE ====================
  // Separate UI states
  let cardExpanded = false; // controls entire card accordion
  let meetingExpanded = false; // controls Meeting Day selector accordion

  // ==================== EVENT HANDLERS ====================
  function toggleCardExpanded() {
    cardExpanded = !cardExpanded;
  }

  function toggleMeetingExpanded() {
    meetingExpanded = !meetingExpanded;
  }

  function changeMeetingDay(newDay: MeetingDay) {
    userPreferences.update((prefs) => ({
      ...prefs,
      meetingDay: newDay,
    }));
  }

  function changeWeek(delta: number) {
    userPreferences.update((prefs) => ({
      ...prefs,
      weekOffset: prefs.weekOffset + delta,
    }));
  }

  function goToCurrentWeek() {
    userPreferences.update((prefs) => ({
      ...prefs,
      weekOffset: 0,
    }));
  }

  // ==================== STATIC DATA ====================
  const daysOfWeek = [
    { value: 0, label: "Sunday" },
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
  ];

  onMount(() => {
    // optional debugging
    // console.log(">>> Store Values", $userPreferences);
  });

  // ==================== ACCESSIBILITY IDS ====================
  const cardPanelId = "plan-week-panel";
  const meetingPanelId = "meeting-day-panel";

  // Space/Enter keyboard support for header button
  function onHeaderKeydown(e: KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleCardExpanded();
    }
  }

  function onMeetingKeydown(e: KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleMeetingExpanded();
    }
  }
</script>

<SectionCard bgColor="#E8E8E8" padding="md">
  <!-- Collapsed Header / Toggle -->
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
      <!-- Left column -->
      <div class="flex flex-col items-start text-left mr-auto space-y-2">
        <p class="text-sm font-inter uppercase text-[var(--color-text-muted)]">
          Current Plan and Week
        </p>

        <p class="font-manrope font-semibold text-[var(--color-text-primary)]">
          {selectedPlan}
          •
          <span class="text-[var(--color-primary-green)]"
            >Week {currentWeek}</span
          >
        </p>

        <p
          class="font-manrope font-semibold text-[var(--color-text-secondary)]"
        >
          {weekRangeString}
        </p>
      </div>

      <!-- Right side: arrow pushed far right -->
      <ArrowDown
        up={cardExpanded}
        color={cardExpanded
          ? "var(--color-primary-green)"
          : "var(--color-text-muted)"}
        size={24}
      />
    </button>
  </div>

  <!-- Expanded Body -->
  {#if cardExpanded}
    <div
      id={cardPanelId}
      class="mt-4 space-y-0"
      transition:slide={{ duration: 300 }}
    >
      <!-- Reading Plan header -->
      <!-- <h2
        class="pl-1 text-[13px] uppercase font-inter font-medium text-[var(--color-text-secondary)]"
      >
        {#if isCurrentWeek}
          Current Reading Plan
        {:else}
          <span class="italic">Viewing Reading Plan</span>
        {/if}
      </h2>
      <div
        class="flex items-center min-h-10 p-2.5 border border-[#CDCFCE] rounded-[13px]"
      >
        <p
          class="font-manrope grow-1 font-semibold text-[var(--color-text-primary)]"
        >
          {selectedPlan}
          <span class="text-[var(--color-text-muted)]"
            >• {today.getFullYear()}</span
          >
        </p>
      </div> -->

      <!-- Week section + nav -->
      <div class="flex w-full items-center">
        <h2
          class="pl-1 text-[13px] uppercase font-inter font-medium text-[var(--color-text-secondary)]"
        >
          <!-- {#if isCurrentWeek}
            Current Week
          {:else}
            <span class="italic">Viewing Week</span>
          {/if} -->

          {#if isCurrentWeek}
            Present Week
          {:else if weekOffset < 0}
            {Math.abs(weekOffset)} Week{Math.abs(weekOffset) !== 1 ? "s" : ""} Ago
          {:else if weekOffset > 0}
            {weekOffset} Week{weekOffset !== 1 ? "s" : ""} Ahead
          {/if}
        </h2>

        <div class="flex items-center gap-1 ml-auto">
          {#if !isCurrentWeek}
            <button
              on:click={goToCurrentWeek}
              class="flex items-center px-3 py-1.5 text-xs rounded-2xl bg-[var(--color-primary-green)
              
              text-white hover:opacity-80 transition-opacity"
              aria-label="Go to Current Week"
            >
              <span
                class="mt-0.5 bg-[var(--color-primary-green)]/60 py-1.5 px-2 rounded-xl text-[black]"
                >Back to Current Week</span
              >
            </button>
          {/if}

          <div
            class="flex items-center border border-neutral-300 rounded-2xl mb-2"
          >
            <button
              on:click={() => changeWeek(-1)}
              class="p-1 rounded hover:text-[var(--color-primary-green)] transition-colors"
              aria-label="Previous Week"
              title="Previous Week"
            >
              <NarrowArrow
                direction="right"
                size={20}
                color="var(--color-text-muted)"
              />
            </button>
            <button
              on:click={() => changeWeek(1)}
              class="p-1 rounded hover:text-[var(--color-primary-green)] transition-colors"
              aria-label="Next Week"
              title="Next Week"
            >
              <NarrowArrow
                direction="left"
                size={20}
                color="var(--color-text-muted)"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- Week details row -->
      <div>
        <div
          class="flex flex-col min-h-10 p-2.5 border border-[#CDCFCE] rounded-[13px]"
        >
          <button
            on:click={toggleMeetingExpanded}
            class="flex items-center bg-transparent min-h-6.5 cursor-pointer grow-1 w-full"
            aria-expanded={meetingExpanded}
            aria-controls="calendar-edit"
          >
            <p
              class="font-manrope grow-1 font-semibold text-[var(--color-text-primary)] text-left"
            >
              <span class="text-[var(--color-text-secondary)]"
                >{weekRangeString}</span
              >
            </p>
            <div class="flex items-center ml-auto">
              <ArrowDown
                up={meetingExpanded}
                color={meetingExpanded
                  ? "var(--color-primary-green)"
                  : "var(--color-text-muted)"}
                size={28}
              />
              <!-- <p
                class={`flex justify-center items-center text-xs py-1.75 px-2 rounded-xl text-[var(--color-text-muted) ${
                  meetingExpanded
                    ? "bg-[var(--color-primary-green)]/60"
                    : "bg-transparent border-[var(--color-text-muted)]/60 border-1"
                }`}
              >
                {meetingExpanded ? "Save & Close" : "Change Meeting Day"}
              </p> -->
            </div>
          </button>
          {#if meetingExpanded}
            <div
              id="calendar-edit"
              class="mt-3 p-3 rounded-[13px] bg-neutral-100"
              transition:slide={{ duration: 300 }}
            >
              <p
                class="font-inter font-medium tracking-tight text-[var(--color-text-muted)] font-sm mb-3"
              >
                Select Meeting Day
              </p>
              <fieldset
                class="-ml-2 flex justify-between"
                aria-label="Select Meeting Day"
              >
                {#each daysOfWeek as day}
                  <label
                    class="cursor-pointer select-none rounded-[3rem] h-11 px-2 py-1 border transition flex items-center justify-center text-center text-[var(--color-text-secondary)] text-sm font-medium flex-1 max-w-[calc(100%/7)] {meetingDay ===
                    day.value
                      ? 'border-[var(--color-primary-green)] bg-[var(--color-primary-green)] text-[var(--color-text-primary)]'
                      : 'border-transparent hover:border-[var(--color-text-muted)]'}"
                  >
                    <input
                      type="radio"
                      name="meetingDay"
                      value={day.value}
                      bind:group={meetingDay}
                      class="sr-only"
                      on:change={() =>
                        changeMeetingDay(day.value as MeetingDay)}
                    />
                    {day.label.slice(0, 3)}
                  </label>
                {/each}
              </fieldset>
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</SectionCard>

<style>
  /* Optional: focus ring for header/meeting buttons */
  button:focus-visible {
    outline: 2px solid var(--color-primary-green);
    outline-offset: 2px;
  }
</style>

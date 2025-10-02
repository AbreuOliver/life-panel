<!-- <script lang="ts">
  import PersonCard from "$lib/components/PersonCard.svelte";
  import { persons } from "$lib/data/persons";

  // If you have a Person type elsewhere, import it. Otherwise:
  type Person = (typeof persons)[number];

  // DRY: build a lookup for O(1) access
  const byId = Object.fromEntries(
    persons.map((p) => [p.id, p] as const)
  ) as Record<string, Person | undefined>;

  // Define tabs as labels + sets of ids (change these groups to your needs)
  const tabs = [
    {
      label: "Nuclear",
      ids: ["oliver", "cara", "ezekiel", "elias", "marissa", "malachi"],
    },
    { label: "Extended", ids: ["ezekiel", "elias", "marissa", "malachi"] },
    { label: "Friends", ids: ["mattd"] },
    { label: "Others", ids: ["ricardo"] },
  ] as const;

  // Resolve each tab's people once, filtering out any missing ids
  const groups = tabs.map((t) => ({
    label: t.label,
    people: t.ids.map((id) => byId[id]).filter((p): p is Person => Boolean(p)),
  }));

  let active = 0;

  // a11y ids
  const tabId = (i: number) => `people-tab-${i}`;
  const panelId = (i: number) => `people-panel-${i}`;

  // Optional: keyboard nav (Home/End/Arrow keys)
  function onKeydown(e: KeyboardEvent) {
    const max = groups.length - 1;
    if (e.key === "ArrowRight") {
      active = active === max ? 0 : active + 1;
      e.preventDefault();
    }
    if (e.key === "ArrowLeft") {
      active = active === 0 ? max : active - 1;
      e.preventDefault();
    }
    if (e.key === "Home") {
      active = 0;
      e.preventDefault();
    }
    if (e.key === "End") {
      active = max;
      e.preventDefault();
    }
  }
</script>

<main class="flex flex-col w-screen h-full mx-auto">
  //-- svelte-ignore a11y_interactive_supports_focus --
  <div
    role="tablist"
    aria-label="People groups"
    class="flex gap-2 border-b border-neutral-400 px-4 pt-2"
    on:keydown={onKeydown}
  >
    {#each groups as g, i}
      <button
        id={tabId(i)}
        role="tab"
        aria-selected={i === active}
        aria-controls={panelId(i)}
        tabindex={i === active ? 0 : -1}
        class="px-3 py-2 text-sm font-medium rounded-t
               border-b-2 {i === active
          ? 'border-blue-600'
          : 'border-transparent text-gray-600 hover:text-gray-900'}"
        on:click={() => (active = i)}
      >
        {g.label}
        <span class="ml-1 text-xs opacity-70">({g.people.length})</span>
      </button>
    {/each}
  </div>

  {#each groups as g, i}
    // -- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -
    <section
      id={panelId(i)}
      role="tabpanel"
      aria-labelledby={tabId(i)}
      hidden={i !== active}
      class="px-0"
    >
      <div class="bg-blue-200/50 p-4 mx-auto w-full space-y-4">
        {#each g.people as person (person.id)}
          <PersonCard {person} />
        {/each}
      </div>
    </section>
  {/each}
</main> -->
<script lang="ts">
  import PersonCard from "$lib/components/PersonCard.svelte";
  import { persons } from "$lib/data/persons";

  type Person = (typeof persons)[number];
  const byId = Object.fromEntries(
    persons.map((p) => [p.id, p] as const)
  ) as Record<string, Person>;

  // --- Sub-tabs inside "Dates" (your existing groups) ---
  const dateGroups = [
    // { label: "Parents", ids: ["oliver", "cara"] },
    // { label: "Kids", ids: ["ezekiel", "elias", "marissa", "malachi"] },
    // { label: "Friends", ids: ["mattd"] },
    {
      label: "Family",
      ids: ["oliver", "cara", "ezekiel", "elias", "marissa", "malachi"],
    },
    { label: "Friends", ids: ["mattd"] },
    { label: "Missionaries", ids: ["ricardo"] },
    { label: "Others", ids: ["ricardo"] },
  ] as const;

  const groups = dateGroups.map((t) => ({
    label: t.label,
    people: t.ids.map((id) => byId[id]).filter(Boolean) as Person[],
  }));

  // --- Top-level tabs ---
  const mainTabs = ["Dates", "Notes", "Other"] as const;
  let mainActive = 0;
  const mainTabId = (i: number) => `main-tab-${i}`;
  const mainPanelId = (i: number) => `main-panel-${i}`;

  function onKeydownMain(e: KeyboardEvent) {
    const max = mainTabs.length - 1;
    if (e.key === "ArrowRight") {
      mainActive = mainActive === max ? 0 : mainActive + 1;
      e.preventDefault();
    }
    if (e.key === "ArrowLeft") {
      mainActive = mainActive === 0 ? max : mainActive - 1;
      e.preventDefault();
    }
    if (e.key === "Home") {
      mainActive = 0;
      e.preventDefault();
    }
    if (e.key === "End") {
      mainActive = max;
      e.preventDefault();
    }
  }

  // --- Sub-tab state/ids (Dates only) ---
  let subActive = 0;
  const subTabId = (i: number) => `sub-tab-${i}`;
  const subPanelId = (i: number) => `sub-panel-${i}`;

  function onKeydownSub(e: KeyboardEvent) {
    const max = groups.length - 1;
    if (e.key === "ArrowRight") {
      subActive = subActive === max ? 0 : subActive + 1;
      e.preventDefault();
      e.stopPropagation();
    }
    if (e.key === "ArrowLeft") {
      subActive = subActive === 0 ? max : subActive - 1;
      e.preventDefault();
      e.stopPropagation();
    }
    if (e.key === "Home") {
      subActive = 0;
      e.preventDefault();
      e.stopPropagation();
    }
    if (e.key === "End") {
      subActive = max;
      e.preventDefault();
      e.stopPropagation();
    }
  }
</script>

<main class="flex flex-col w-screen h-full mx-auto">
  <!-- Top-level tabs -->
  <div
    role="tablist"
    aria-label="Sections"
    class="flex gap-2 border-b border-neutral-400 px-4 pt-2"
    on:keydown={onKeydownMain}
  >
    {#each mainTabs as t, i}
      <button
        id={mainTabId(i)}
        role="tab"
        aria-selected={i === mainActive}
        aria-controls={mainPanelId(i)}
        tabindex={i === mainActive ? 0 : -1}
        class="px-3 py-2 text-sm font-medium rounded-t
               border-b-2 {i === mainActive
          ? 'border-blue-600'
          : 'border-transparent text-gray-600 hover:text-gray-900'}"
        on:click={() => (mainActive = i)}
      >
        {t}
      </button>
    {/each}
  </div>

  <!-- Top-level panels -->
  {#each mainTabs as _t, i}
    <section
      id={mainPanelId(i)}
      role="tabpanel"
      aria-labelledby={mainTabId(i)}
      hidden={i !== mainActive}
      class="px-0"
    >
      {#if i === 0}
        <!-- DATES: your existing sub-tabs go here -->
        <div
          role="tablist"
          aria-label="People groups"
          class="flex gap-2 border-b border-neutral-300 px-4 pt-2"
          on:keydown={onKeydownSub}
        >
          {#each groups as g, j}
            <button
              id={subTabId(j)}
              role="tab"
              aria-selected={j === subActive}
              aria-controls={subPanelId(j)}
              tabindex={j === subActive ? 0 : -1}
              class="px-3 py-2 text-xs font-medium rounded-t
                     border-b-2 {j === subActive
                ? 'border-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'}"
              on:click={() => (subActive = j)}
            >
              {g.label}
              <span class="ml-1 text-[11px] opacity-70"
                >({g.people.length})</span
              >
            </button>
          {/each}
        </div>

        {#each groups as g, j}
          <section
            id={subPanelId(j)}
            role="tabpanel"
            aria-labelledby={subTabId(j)}
            hidden={j !== subActive}
            class="px-0"
          >
            <div class="bg-blue-200/50 p-4 mx-auto w-full space-y-4">
              {#each g.people as person (person.id)}
                <PersonCard {person} />
              {/each}
            </div>
          </section>
        {/each}
      {:else if i === 1}
        <!-- NOTES -->
        <div class="p-4 text-sm text-neutral-700">Notes content</div>
      {:else}
        <!-- OTHER -->
        <div class="p-4 text-sm text-neutral-700">Other content</div>
      {/if}
    </section>
  {/each}
</main>

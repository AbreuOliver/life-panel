<script lang="ts">
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
  <!-- Tabs -->
  <!-- svelte-ignore a11y_interactive_supports_focus -->
  <div
    role="tablist"
    aria-label="People groups"
    class="flex gap-2 border-b border-neutral-400 px-4"
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

  <!-- Panels -->
  {#each groups as g, i}
    <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
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
</main>

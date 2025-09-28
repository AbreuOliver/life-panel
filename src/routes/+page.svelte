<script lang="ts">
  import MemoryVerse from "$lib/components/MemoryVerse.svelte";
  import PersonCard from "$lib/components/PersonCard.svelte";
  import ReadingPlan from "$lib/components/ReadingPlan.svelte";
  //   import AdditionalReading from "$lib/components/AdditionalReading.svelte";
  import { persons } from "$lib/data/persons";
  const oliver = persons.find((p) => p.id === "oliver");
  const cara = persons.find((p) => p.id === "cara");
  const ezekiel = persons.find((p) => p.id === "ezekiel");
  const elias = persons.find((p) => p.id === "elias");
</script>

<main class="space-y-4">
  {#if oliver}
    <PersonCard person={oliver} />
  {/if}
  {#if cara}
    <PersonCard person={cara} />
  {/if}
  {#if ezekiel}
    <PersonCard person={ezekiel} />
  {/if}
  {#if elias}
    <PersonCard person={elias} />
  {/if}
  <!-- <MemoryVerse />
  <ReadingPlan /> -->
  <!-- <AdditionalReading /> -->
</main>

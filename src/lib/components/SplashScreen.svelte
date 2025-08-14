<script lang="ts">
  import { onMount } from "svelte";

  export let onDone: () => void;

  let visible = true;

  onMount(() => {
    // Show splash for 2 seconds, then call onDone
    const timer = setTimeout(() => {
      visible = false;
      onDone();
    }, 2000);

    return () => clearTimeout(timer);
  });
</script>

{#if visible}
  <div
    class="fixed inset-0 flex items-center justify-center bg-lime-500 text-white z-50"
  >
    <h1 class="text-3xl font-bold">HEAR Journal</h1>
  </div>
{/if}

<script lang="ts">
  import "../app.css";
  import favicon from "$lib/assets/favicon.svg";
  import Header from "$lib/components/Header.svelte";
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<div class="grid grid-cols-[1fr_minmax(0,70ch)_1fr] min-h-screen">
  <div></div>
  <!-- left gutter -->
  <div class="px-4 sm:px-0">
    <Header />
    <slot />
  </div>
  <div></div>
  <!-- right gutter -->
</div>

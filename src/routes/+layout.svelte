<script lang="ts">
  import "../app.css";
  import favicon from "$lib/assets/favicon.svg";
  import Header from "$lib/components/Header.svelte";
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen flex flex-col space-y-4">
  <Header />
  <main class="flex-1 max-w-[70ch] mx-auto px-4 sm:px-0 w-full">
    <slot />
  </main>
</div>

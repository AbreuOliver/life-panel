<script lang="ts">
  import { onMount } from "svelte";
  import { isInstalledAsPWA } from "$lib/utils/pwaModeDetect";
  import { browser } from "$app/environment";

  if (browser) {
    // Access window.navigator properties here
    console.log(window.navigator.userAgent);
  }

  let modeClass = "browser-mode";

  onMount(() => {
    if (isInstalledAsPWA()) {
      modeClass = "pwa-mode";
    }
  });
</script>

<header
  class={`flex items-center min-h-16  sticky top-0 z-10 w-screen shadow-none px-8 sm:px-6 ${modeClass}`}
>
  <h1
    class="max-w-[30ch] pt-6 pb-3 mx-auto w-full font-manrope text-3xl font-bold tracking-tight"
  >
    <span class="tracking-tighter">HEAR</span> Journal
  </h1>
</header>

<style>
  header {
    padding-top: env(safe-area-inset-top);
  }

  /* Browser mode */
  .browser-mode {
    background-color: white;
  }
  .browser-mode h1 {
    color: var(--color-primary-green);
  }

  /* PWA mode */
  .pwa-mode {
    background-color: var(--color-primary-green);
  }
  .pwa-mode h1 {
    color: white;
  }
</style>

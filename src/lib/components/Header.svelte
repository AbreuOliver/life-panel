<script lang="ts">
  import { onMount } from "svelte";
  import { isInstalledAsPWA } from "$lib/utils/pwaModeDetect";
  import { browser } from "$app/environment";

  let pwaIOS = false;

  onMount(() => {
    if (!browser) return;

    const isPWA = isInstalledAsPWA();
    const ua = navigator.userAgent;

    if (isPWA && /iPhone|iPad/.test(ua)) {
      pwaIOS = true;
    }
  });
</script>

<header
  class={`flex items-center min-h-16 sticky top-0 z-10 w-full px-8 sm:px-6 ${
    pwaIOS ? "pwa-ios" : "default-header"
  }`}
>
  <h1
    class={`max-w-[30ch] pt-6 pb-3 mx-auto w-full font-manrope text-3xl font-bold tracking-tight ${
      pwaIOS ? "text-white" : "text-primary-green"
    }`}
  >
    <span class="tracking-tighter">HEAR</span> Journal
  </h1>
</header>

<style>
  header {
    padding-top: env(safe-area-inset-top);
  }

  .pwa-ios {
    background-color: #82d844;
  }

  .default-header {
    background-color: white;
  }

  .text-primary-green {
    color: var(--color-primary-green);
  }

  .text-white {
    color: white;
  }
</style>

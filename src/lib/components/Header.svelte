<script lang="ts">
  import { onMount } from "svelte";
  import { isInstalledAsPWA } from "$lib/utils/pwaModeDetect";
  import { browser } from "$app/environment";
  import { buildHeader } from "$lib/utils/chronoCalculations";

  const headerISO = buildHeader({ weekSystem: "ISO" });
  // "270/95 • 2025 • Week 39 • Sat, Sep 27" for 2025-09-27 (ISO standard)

  const headerUS = buildHeader({ weekSystem: "US" });
  // Sunday-start, Jan-1-anchored week numbering

  const headerOrdinal = buildHeader({ weekSystem: "ORDINAL" });

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
  class={`flex justify-center items-center py-2 h-full max-h-[56px] sticky top-0 z-10 w-full px-8 sm:px-6 border-b border-[var(--color-primary-green)]  ${
    pwaIOS ? "pwa-ios" : "default-header"
  }`}
>
  <h1
    class={`max-w-[45ch] pt-6 pb-3 mx-auto w-full font-manrope text-xl font-bold tracking-tight ${
      pwaIOS ? "text-white" : "text-primary-green"
    }`}
  >
    <span class="tracking-tighter">{headerISO}</span>
  </h1>
</header>

<style>
  header {
    padding-top: env(safe-area-inset-top);
  }

  .pwa-ios {
    background-color: transparent;
  }

  .default-header {
    background-color: #007aff;
  }

  .text-primary-green {
    color: var(--color-primary-green);
  }

  .text-white {
    color: white;
  }
</style>

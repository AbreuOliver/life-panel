<script lang="ts">
  import "../app.css";
  import favicon from "$lib/assets/HEAR-Journal.ico";
  import Header from "$lib/components/Header.svelte";
  import Splash from "$lib/components/SplashScreen.svelte";
  import Banner from "$lib/components/Banner.svelte";
  import { dev, browser } from "$app/environment";
  import { onMount } from "svelte";
  import { parseUserAgent } from "$lib/utils/userAgentParser";
  import { registerSW } from "virtual:pwa-register";
  import { isInstalledAsPWA } from "$lib/utils/pwaModeDetect";
  import DateSection from "$lib/components/DateSection.svelte";

  // UI state
  let showSplash = false;
  let isPWA = false;
  let uaDisplay = "";

  onMount(() => {
    if (!browser) return;
    uaDisplay = parseUserAgent(window.navigator.userAgent);
    isPWA = isInstalledAsPWA();
    showSplash = isPWA;
  });

  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      if (confirm("New content available. Reload?")) {
        updateSW(true);
      }
    },
    onOfflineReady() {
      console.log("App ready to work offline");
    },
  });

  function handleSplashDone() {
    showSplash = false;
  }

  let showBanner = false;
  let showMenuDot = false;

  // Toggle logic
  function toggleBanner() {
    showBanner = !showBanner;
    if (!showBanner) {
      // If we just closed it manually, reset menu dot
      showMenuDot = false;
    }
  }

  function handleBannerClosed() {
    // Exit animation complete
    showMenuDot = true;
  }
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<Header />
<Banner />
<DateSection />
<div class="min-h-screen flex flex-col overflow-x-hidden">
  {#if showSplash}
    <Splash onDone={handleSplashDone} />
  {/if}

  <main class="flex-1 max-w-[70ch] mx-auto px-0 sm:px-0 w-full py-0">
    <slot />
  </main>
  <!-- <div
    class="h-4 w-full bg-amber-500 relative overflow-hidden"
    role="alert"
    aria-label="Warning indicator"
  >
    <div
      class="absolute inset-0 opacity-80"
      style="background-image: repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(0,0,0,0.3) 10px, rgba(0,0,0,0.3) 20px);"
    ></div>
  </div>
  <footer
    class="flex items-center justify-center text-center min-h-12 font-medium leading-tight px-3 py-6 bg-amber-400 font-mono"
  >
    <span class="sr-only">Current browser and device information:</span>
    User Agent Info: {uaDisplay}
  </footer> -->
</div>

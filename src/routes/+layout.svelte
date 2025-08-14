<script lang="ts">
  import "../app.css";
  import favicon from "$lib/assets/favicon.svg";
  import Header from "$lib/components/Header.svelte";
  import { browser } from "$app/environment";
  import { parseUserAgent } from "$lib/utils/userAgentParser";

  let uaDisplay = "";
  if (browser) {
    uaDisplay = parseUserAgent(window.navigator.userAgent);
  }
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen flex flex-col">
  <Header />

  <main class="flex-1 max-w-[70ch] mx-auto px-4 sm:px-0 w-full py-4">
    <slot />
  </main>

  <!-- Warning stripe - semantically indicates caution/alert -->
  <div
    class="h-6 w-full bg-amber-500 relative overflow-hidden"
    role="alert"
    aria-label="Warning indicator"
  >
    <!-- Diagonal stripes using Tailwind -->
    <div
      class="absolute inset-0 opacity-80"
      style="background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.3) 10px, rgba(0,0,0,0.3) 20px);"
    ></div>
  </div>

  <footer
    class="flex items-center justify-center text-center min-h-12 font-medium leading-tight p-2 bg-amber-400 font-mono"
  >
    <span class="sr-only">Current browser and device information:</span>
    User Agent Info: {uaDisplay}
  </footer>
</div>

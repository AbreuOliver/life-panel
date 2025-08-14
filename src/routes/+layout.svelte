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

<div class="min-h-screen flex flex-col space-y-4 pb-8">
  <aside
    class="flex items-center min-h-12 leading-tight p-2 bg-amber-400 font-mono"
  >
    Testing: {uaDisplay}
  </aside>
  <Header />
  <main class="flex-1 max-w-[70ch] mx-auto px-4 sm:px-0 w-full">
    <slot />
  </main>
</div>

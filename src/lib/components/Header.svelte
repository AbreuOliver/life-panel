<script lang="ts">
  import { onMount } from "svelte";
  import { isInstalledAsPWA } from "$lib/utils/pwaModeDetect";
  import { parseUserAgent } from "$lib/utils/userAgentParser";
  import { browser } from "$app/environment";

  if (browser) {
    // Access window.navigator properties here
    console.log(window.navigator.userAgent);
  }

  let modeClass = "browser-mode";
  let deviceType = "unknown";

  onMount(() => {
    const isPWA = isInstalledAsPWA();

    if (browser) {
      const userAgent = parseUserAgent(window.navigator.userAgent);

      // Detect device type
      if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
        deviceType = "ios";
      } else if (
        userAgent.includes("Android") ||
        userAgent.includes("Galaxy") ||
        userAgent.includes("Samsung")
      ) {
        deviceType = "android";
      }
    }

    if (isPWA) {
      modeClass = `pwa-mode pwa-${deviceType}`;
    } else {
      modeClass = "browser-mode";
    }

    // Update status bar meta tags for PWA mode
    if (isPWA && browser) {
      updateStatusBarStyle(deviceType);
    }
  });

  function updateStatusBarStyle(device: string) {
    // Update apple-mobile-web-app-status-bar-style for iOS
    let statusBarMeta = document.querySelector(
      'meta[name="apple-mobile-web-app-status-bar-style"]'
    );

    if (device === "ios") {
      // iOS: Use black-translucent for immersive experience
      if (statusBarMeta) {
        statusBarMeta.setAttribute("content", "black-translucent");
      } else {
        statusBarMeta = document.createElement("meta");
        statusBarMeta.setAttribute(
          "name",
          "apple-mobile-web-app-status-bar-style"
        );
        statusBarMeta.setAttribute("content", "black-translucent");
        document.head.appendChild(statusBarMeta);
      }
    } else if (device === "android") {
      // Android: Use default for better integration with system UI
      if (statusBarMeta) {
        statusBarMeta.setAttribute("content", "default");
      }

      // For Android, also update theme-color to match header
      let themeColorMeta = document.querySelector('meta[name="theme-color"]');
      if (themeColorMeta) {
        themeColorMeta.setAttribute("content", "#34A853"); // Android green
      }
    }
  }
</script>

<header
  class={`flex items-center min-h-16 sticky top-0 z-10 w-screen shadow-none px-8 sm:px-6 ${modeClass}`}
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

  /* PWA mode - Base styles */
  .pwa-mode {
    background-color: var(--color-primary-green);
  }
  .pwa-mode h1 {
    color: white;
  }

  /* PWA mode - iOS specific */
  .pwa-ios {
    /* iOS gets extra padding for status bar overlay */
    padding-top: calc(env(safe-area-inset-top) + 8px);
    background: linear-gradient(
      135deg,
      var(--color-primary-green) 0%,
      #6ab04c 100%
    );
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .pwa-ios h1 {
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  /* PWA mode - Android specific */
  .pwa-android {
    /* Android gets material design styling */
    background: var(--color-primary-green);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    transition: background-color 0.2s ease;
  }

  .pwa-android h1 {
    font-weight: 500; /* Slightly lighter for Material Design feel */
  }

  /* Android PWA hover effect */
  .pwa-android:hover {
    background-color: #2e8b3e;
  }

  /* Unknown device fallback */
  .pwa-unknown {
    background-color: var(--color-primary-green);
  }
</style>

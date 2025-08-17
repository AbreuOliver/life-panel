// src/lib/utils/pwaModeDetect.ts
export function isInstalledAsPWA(): boolean {
  if (typeof window === "undefined") return false;

  // Spec-compliant display-modes seen in the wild
  const modes = ["standalone", "fullscreen", "minimal-ui"] as const;
  for (const m of modes) {
    try {
      if (window.matchMedia?.(`(display-mode: ${m})`).matches) return true;
    } catch {
      /* noop */
    }
  }

  // iOS Safari (added to Home Screen)
  // `navigator.standalone` is non‑standard but the only signal iOS gives.
  if ((window.navigator as any).standalone === true) return true;

  // Android Trusted Web Activity heuristic
  if (typeof document !== "undefined" && document.referrer?.startsWith("android-app://")) {
    return true;
  }

  return false;
}

/** Optional: for logging/diagnostics */
export function getDisplayMode(): "standalone" | "fullscreen" | "minimal-ui" | "browser" | "unknown" {
  if (typeof window === "undefined") return "unknown";
  const modes = ["standalone", "fullscreen", "minimal-ui"] as const;
  for (const m of modes) {
    if (window.matchMedia?.(`(display-mode: ${m})`).matches) return m;
  }
  return "browser";
}

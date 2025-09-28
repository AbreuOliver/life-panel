<!-- <script lang="ts">
  // Controlled prop: when true → show + play entry; when false → play exit, then notify parent
  export let open = false;
  export let text = "Some items are sold out today. See Menu";
  // Svelte 5 event-style callback prop
  export let onclosed: (e: CustomEvent<void>) => void;

  let collapsing = false;

  $: if (open) {
    collapsing = false; // reset exit state when reopened
  } else if (!open && !collapsing) {
    collapsing = true; // start exit animation
  }

  function handleAnimationEnd(e: AnimationEvent) {
    // Only notify when the springy close finishes
    if (collapsing && e.animationName === "spring-accordion-close") {
      collapsing = false;
      onclosed?.(new CustomEvent("closed"));
    }
  }
</script>

{#if open || collapsing}
  <div
    role="status"
    aria-live="polite"
    class="soldout-banner bg-amber-300/50 text-center p-2 text-sm"
    class:is-collapsing={collapsing}
    on:animationend={handleAnimationEnd}
  >
    {text}
  </div>
{/if}

<style>
  /* ENTRY */
  .soldout-banner {
    animation: unfold-in 200ms cubic-bezier(0.22, 0.8, 0.2, 1) both;
    transform-origin: top center;
  }

  /* EXIT */
  .soldout-banner.is-collapsing {
    animation:
      spring-accordion-close 520ms cubic-bezier(0.2, 0.8, 0.2, 1.05) forwards,
      radius-spring-out 520ms cubic-bezier(0.2, 0.8, 0.2, 1.05) forwards;
  }

  @keyframes unfold-in {
    from {
      transform: scaleY(0.6);
      opacity: 0;
    }
    to {
      transform: scaleY(1);
      opacity: 1;
    }
  }

  @keyframes spring-accordion-close {
    0% {
      transform: scale(1, 1);
      opacity: 1;
    }
    12% {
      transform: scale(1.04, 1.06);
    }
    28% {
      transform: scale(1.02, 0.84);
    }
    48% {
      transform: scale(1.01, 0.94);
    }
    68% {
      transform: scale(1, 0.86);
    }
    85% {
      transform: scale(1, 0.92);
    }
    100% {
      transform: scale(0.98, 0.6);
      opacity: 0;
    }
  }

  @keyframes radius-spring-out {
    0% {
      border-radius: 12px;
    }
    28% {
      border-radius: 16px;
    }
    68% {
      border-radius: 14px;
    }
    100% {
      border-radius: 10px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .soldout-banner,
    .soldout-banner.is-collapsing {
      animation: none !important;
      transform: none !important;
      opacity: 1 !important;
    }
  }
</style> -->

<script lang="ts">
  export let open = false;
  export let text = "Some items are sold out today. See Menu";
  export let onclosed: (e: CustomEvent<void>) => void;

  let collapsing = false;

  $: if (open) {
    collapsing = false; // fully open
  } else if (!open && !collapsing) {
    collapsing = true; // start close sequence
  }

  function handleTransitionEnd(e: TransitionEvent) {
    // We listen on the shell's grid-template-rows transition.
    if (collapsing && e.propertyName === "grid-template-rows") {
      collapsing = false;
      onclosed?.(new CustomEvent("closed"));
    }
  }
</script>

{#if open || collapsing}
  <!-- Shell controls vertical space (layout), content handles “springiness” -->
  <div
    class="banner-shell bg-amber-300/50 text-center text-sm"
    class:open={open && !collapsing}
    class:closing={collapsing}
    on:transitionend={handleTransitionEnd}
  >
    <div class="banner-content">
      {text}
    </div>
  </div>
{/if}

<style>
  /* Shell: grid track animates layout height */
  .banner-shell {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 280ms cubic-bezier(0.22, 0.8, 0.2, 1);
    /* spacing/typography via Tailwind or add here if you prefer */
    margin: 8px 0 6px;
  }
  .banner-shell.open {
    grid-template-rows: 1fr; /* expands and pushes content below downward */
  }

  /* Inner content box that actually shows the banner */
  .banner-content {
    overflow: hidden; /* required for 0fr row */
    background: #ffeb7a;
    color: #111;
    text-align: center;
    border-radius: 12px;
    padding: 8px 12px;
    font-size: 14px;
    line-height: 1.25;
    transform-origin: top center;

    /* simple, unobtrusive entry (can be removed if you only want layout-driven open) */
    animation: unfold-in 160ms cubic-bezier(0.22, 0.8, 0.2, 1) both;
  }

  @keyframes unfold-in {
    from {
      transform: scaleY(0.9);
      opacity: 0;
    }
    to {
      transform: scaleY(1);
      opacity: 1;
    }
  }

  /* Closing: layout collapses via shell (0fr), while content plays a springy squeeze */
  .banner-shell.closing .banner-content {
    animation:
      spring-accordion-close 520ms cubic-bezier(0.2, 0.8, 0.2, 1.05) forwards,
      radius-spring-out 520ms cubic-bezier(0.2, 0.8, 0.2, 1.05) forwards;
  }

  @keyframes spring-accordion-close {
    0% {
      transform: scale(1, 1);
      opacity: 1;
    }
    12% {
      transform: scale(1.04, 1.06);
    } /* slight open */
    28% {
      transform: scale(1.02, 0.84);
    } /* snap shut */
    48% {
      transform: scale(1.01, 0.94);
    } /* rebound 1 */
    68% {
      transform: scale(1, 0.86);
    } /* dip */
    85% {
      transform: scale(1, 0.92);
    } /* rebound 2 */
    100% {
      transform: scale(0.98, 0.6);
      opacity: 0;
    }
  }

  @keyframes radius-spring-out {
    0% {
      border-radius: 12px;
    }
    28% {
      border-radius: 16px;
    }
    68% {
      border-radius: 14px;
    }
    100% {
      border-radius: 10px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .banner-shell {
      transition: none !important;
    }
    .banner-content {
      animation: none !important;
      transform: none !important;
      opacity: 1 !important;
    }
  }
</style>

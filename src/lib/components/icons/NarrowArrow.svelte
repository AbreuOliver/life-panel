<script lang="ts">
  export let direction: "left" | "right" = "right";
  export let size: number = 24;
  export let color: string = "#fff";
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  class={direction === "left" ? "rotate-180" : ""}
>
  <path
    fill="none"
    stroke={color}
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    d="M5 12h14M5 12l4 4m-4-4l4-4"
  />
</svg>

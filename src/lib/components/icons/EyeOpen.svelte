<script lang="ts">
  export let color: string = "currentColor";
  export let size: number = 12;
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  class="mr-2"
>
  <g
    fill="none"
    stroke={color}
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
  >
    <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0-4 0" />
    <path d="M21 12q-3.6 6-9 6t-9-6q3.6-6 9-6t9 6" />
  </g>
</svg>

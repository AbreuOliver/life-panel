<script lang="ts">
  export let color: string = "currentColor";
  export let size: number = 12;
  export let up: boolean = false;
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  class="mr-2"
  style="transform: rotate({up ? 180 : 0}deg); transition: transform 0.3s ease;"
>
  <path
    fill="none"
    stroke={color}
    stroke-width="2"
    d="M20 8c-1.403-2.96-4.463-5-8-5a9 9 0 1 0 0 18a9 9 0 0 0 9-9m0-9v6h-6"
  />
</svg>

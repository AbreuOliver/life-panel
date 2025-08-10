<script lang="ts">
  export let bgColor: string = "#1E1E1E";
</script>

<div
  class="p-4 rounded-[20px] shadow-[0_4px_6px_0_hsla(0,0%,0%,0.2)] flex-col"
  style="background-color: {bgColor};"
>
  <slot />
</div>

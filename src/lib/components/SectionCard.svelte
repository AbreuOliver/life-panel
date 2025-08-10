<script lang="ts">
  export let bgColor: string = "#1E1E1E";
</script>

<div class="p-4 rounded-[20px] flex-col" style="background-color: {bgColor};">
  <slot />
</div>

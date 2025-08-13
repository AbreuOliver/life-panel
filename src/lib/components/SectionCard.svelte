<script lang="ts">
  type PaddingSize = "none" | "sm" | "md" | "lg";

  export let bgColor: string = "#1E1E1E";
  export let padding: PaddingSize = "md";

  const paddingClasses: Record<PaddingSize, string> = {
    none: "0rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
  };
</script>

<div
  class="rounded-[20px] flex-col"
  style={`background-color: ${bgColor}; padding: ${paddingClasses[padding]}`}
>
  <slot />
</div>

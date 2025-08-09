<script lang="ts">
  import SectionCard from "$lib/components/SectionCard.svelte";
</script>

<SectionCard bgColor="#E8E8E8">
  <h2
    class="pl-1 text-[14px] uppercase font-inter text-[#656565] font-medium mb-1"
  >
    Current Reading Plan
  </h2>
  <div
    class="flex items-center min-h-10 p-2.5 border border-[#CDCFCE] rounded-[13px]"
  >
    <p class="font-manrope grow-1 text-neutral-800 font-semibold">
      New Testament
    </p>
    <button
      class="flex justify-center items-center bg-[#82d844] py-0.5 px-2 rounded-[7px] min-h-6.5"
    >
      <p class="font-manrope text-xs">Change</p></button
    >
  </div>
</SectionCard>
<div class="my-4"></div>
<SectionCard bgColor="#E8E8E8">
  <h2
    class="pl-1 text-[14px] uppercase font-inter text-[#656565] font-medium mb-1"
  >
    Calendar
  </h2>
  <div class="min-h-10 p-2.5 border border-[#CDCFCE] rounded-[13px]">
    <p class="font-manrope grow-1 text-neutral-800 font-semibold">Week 33</p>
  </div>
</SectionCard>

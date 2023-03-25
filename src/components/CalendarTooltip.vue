<script lang="ts">
export default {
  name: "CalendarTooltip",
};
</script>

<script setup lang="ts">
defineProps<{
  tooltipText: string;
}>();
const emits = defineEmits(["remove-tooltip"]);

const removeTooltip = () => {
  emits("remove-tooltip");
};
</script>

<template>
  <div class="calendar_tooltip">
    <div
      :class="[
        'calendar_tooltip--content',
        {
          'calendar_tooltip--content--min': tooltipText.length < 25,
          'calendar_tooltip--content--max': tooltipText.length > 25,
        },
      ]"
      @mouseenter="removeTooltip"
    >
      {{ tooltipText }}
    </div>

    <i class="calendar_tooltip-arrow" />
  </div>
</template>

<style scoped>
.calendar_tooltip {
  @apply absolute bottom-full left-1/2 transform -translate-x-1/2 z-20;
}
.calendar_tooltip-arrow {
  @apply w-0 h-0 border-x-8 border-x-transparent border-t-8 absolute left-1/2 transform -translate-x-1/2 top-full;
  border-top-color: var(--calendar-tooltip-border);
}
.calendar_tooltip--content {
  @apply border-[1px] px-4 py-2 text-[10px] w-max relative left-0 right-0 transform rounded-[4px] text-center;
  width: max-content;
  white-space: pre-line;
  background-color: var(--calendar-tooltip-bg);
  border-color: var(--calendar-tooltip-border);
  color: var(--calendar-tooltip-text);
}
/************/
/* Position */
/************/

/* Left tooltip */
.calendar_day-wrap-tooltip--left .calendar_tooltip--content--min {
  @apply transform -translate-x-[-5em];
}
.calendar_day-wrap-tooltip--left .calendar_tooltip--content--max {
  @apply transform -translate-x-[-9em];
}
/* Center tooltip */
.calendar_day-wrap-tooltip--center .calendar_tooltip--content {
  @apply left-1/2 -translate-x-1/2;
}
/* Right tooltip */
.calendar_day-wrap-tooltip--right .calendar_tooltip--content--min {
  @apply -translate-x-[6em];
}
.calendar_day-wrap-tooltip--right .calendar_tooltip--content--max {
  @apply -translate-x-[9em];
}
</style>

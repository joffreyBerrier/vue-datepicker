<script setup lang="ts">
interface Props {
  tooltipText: string
}
defineProps<Props>()
const emits = defineEmits(['remove-tooltip'])

const removeTooltip = () => {
  emits('remove-tooltip')
}
</script>

<template>
  <div class="calendar_tooltip">
    <div
      :class="[
        'calendar_tooltip--content',
        {
          'calendar_tooltip--content--min': tooltipText.length < 25,
          'calendar_tooltip--content--max': tooltipText.length > 25
        }
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
  @apply vuedatepicker-absolute vuedatepicker-bottom-full vuedatepicker-left-1/2 vuedatepicker-transform -vuedatepicker-translate-x-1/2 vuedatepicker-z-20;
}
.calendar_tooltip-arrow {
  @apply vuedatepicker-w-0 vuedatepicker-h-0 vuedatepicker-border-x-8 vuedatepicker-border-x-transparent vuedatepicker-border-t-8 vuedatepicker-absolute vuedatepicker-left-1/2 vuedatepicker-transform -vuedatepicker-translate-x-1/2 vuedatepicker-top-full;
  border-top-color: var(--calendar-tooltip-border);
}
.calendar_tooltip--content {
  @apply vuedatepicker-border-[1px] vuedatepicker-px-4 vuedatepicker-py-2 vuedatepicker-text-[10px] vuedatepicker-w-max vuedatepicker-relative vuedatepicker-left-0 vuedatepicker-right-0 vuedatepicker-transform vuedatepicker-rounded-[4px] vuedatepicker-text-center;
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
  @apply vuedatepicker-transform -vuedatepicker-translate-x-[-5em];
}
.calendar_day-wrap-tooltip--left .calendar_tooltip--content--max {
  @apply vuedatepicker-transform -vuedatepicker-translate-x-[-9em];
}
/* Center tooltip */
.calendar_day-wrap-tooltip--center .calendar_tooltip--content {
  @apply vuedatepicker-left-1/2 -vuedatepicker-translate-x-1/2;
}
/* Right tooltip */
.calendar_day-wrap-tooltip--right .calendar_tooltip--content--min {
  @apply -vuedatepicker-translate-x-[6em];
}
.calendar_day-wrap-tooltip--right .calendar_tooltip--content--max {
  @apply -vuedatepicker-translate-x-[9em];
}
</style>

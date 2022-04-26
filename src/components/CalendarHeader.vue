<script lang="ts">
export default {
  name: "CalendarHeader",
};
</script>

<script setup lang="ts">
import { computed } from "vue";
import type { ComputedRef, PropType } from "vue";

import type { Month } from "~/types";

import BaseIcon from "./BaseIcon.vue";

const emit = defineEmits(["paginate"]);
const props = defineProps({
  activeIndex: {
    type: Number,
    default: 0,
  },
  months: {
    type: Array as PropType<Month[]>,
    default: () => {
      return [];
    },
  },
});

const prevMonth: ComputedRef<string> = computed(() => {
  return props.months[props.activeIndex].monthName;
});

const nextMonth: ComputedRef<string> = computed(() => {
  return props.months[props.activeIndex + 1].monthName;
});

const paginate = (operator: string) => {
  emit("paginate", operator);
};
</script>

<template>
  <div class="calendar_header">
    <button
      type="button"
      data-testid="button-prev-month"
      :disabled="activeIndex === 0"
      class="calendar_header-left-button"
      @click="paginate('-')"
    >
      <base-icon name="chevronLeft" />
    </button>

    <p class="calendar_header-text">{{ prevMonth }}</p>
    <p class="calendar_header-text">{{ nextMonth }}</p>

    <button
      type="button"
      data-testid="button-next-month"
      :disabled="activeIndex >= months.length - 2"
      class="calendar_header-right-button"
      @click="paginate('+')"
    >
      <base-icon name="chevronRight" />
    </button>
  </div>
</template>

<style>
.calendar_header {
  @apply relative grid grid-cols-2 items-center gap-4;
}
.calendar_header-text {
  @apply text-center py-2 font-bold;
}
.calendar_header-left-button,
.calendar_header-right-button {
  background-color: var(--calendar-paginate-bg);
  border-color: var(--calendar-paginate-border-color);
  color: var(--calendar-paginate-text-color);
}
.calendar_header-left-button:hover,
.calendar_header-right-button:hover {
  background-color: var(--calendar-paginate-hover-bg);
  border-color: var(--calendar-paginate-hover-border);
  color: var(--calendar-paginate-hover-text);
}
.calendar_header-left-button:disabled,
.calendar_header-right-button:disabled {
  background-color: var(--calendar-paginate-disabled-bg);
  border-color: var(--calendar-paginate-disabled-border);
  color: var(--calendar-paginate-disabled-text);
}
.calendar_header-left-button {
  @apply absolute left-0 w-10 h-10 flex items-center justify-center border focus:outline-none disabled:pointer-events-none duration-300;
}
.calendar_header-right-button {
  @apply absolute right-0 w-10 h-10 flex items-center justify-center border focus:outline-none disabled:pointer-events-none duration-300;
}
</style>

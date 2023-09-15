<script lang="ts">
export default {
  name: "CalendarHeader",
};
</script>

<script setup lang="ts">
import { computed } from "vue";
import type { ComputedRef, PropType } from "vue";

import type { Month } from "../types";

import BaseIcon from "./BaseIcon.vue";

const emit = defineEmits(["paginate"]);
const props = defineProps({
  activeIndex: {
    type: Number,
    default: 0,
  },
  showHeader: {
    type: Boolean,
    default: false,
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
  <div :class="['calendar_header', { calendar_header_mobile: showHeader }]">
    <div class="calendar_header-left">
      <button
        type="button"
        data-testid="button-prev-month"
        :disabled="activeIndex === 0"
        class="calendar_header-left-button"
        @click="paginate('-')"
      >
        <base-icon name="chevronLeft" />
      </button>

      <p v-if="!showHeader" class="calendar_header-text">{{ prevMonth }}</p>
    </div>

    <p v-if="showHeader" class="text-center">{{ prevMonth }}</p>

    <div class="calendar_header-right">
      <p v-if="!showHeader" class="calendar_header-text">{{ nextMonth }}</p>

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
  </div>
</template>

<style>
.vue-calendar .calendar_header {
  @apply relative grid md:grid-cols-2 grid-cols-3 items-center gap-4;
}
.vue-calendar .calendar_header_mobile {
  @apply relative flex justify-between items-center gap-4 mb-6;
}
.vue-calendar .calendar_header-left-button,
.vue-calendar .calendar_header-right-button {
  background-color: var(--calendar-paginate-bg);
  border-color: var(--calendar-paginate-border-color);
  color: var(--calendar-paginate-text-color);
}
.vue-calendar .calendar_header-left-button:hover,
.vue-calendar .calendar_header-right-button:hover {
  background-color: var(--calendar-paginate-hover-bg);
  border-color: var(--calendar-paginate-hover-border);
  color: var(--calendar-paginate-hover-text);
}
.vue-calendar .calendar_header-left-button:disabled,
.vue-calendar .calendar_header-right-button:disabled {
  background-color: var(--calendar-paginate-disabled-bg);
  border-color: var(--calendar-paginate-disabled-border);
  color: var(--calendar-paginate-disabled-text);
}
.vue-calendar .calendar_header-left {
  @apply flex justify-start;
}
.vue-calendar .calendar_header-right {
  @apply flex justify-end;
}
.vue-calendar .calendar_header-text {
  @apply flex items-center text-[14px] font-bold px-3 capitalize m-0;
  color: var(--calendar-text-color);
}
.vue-calendar .calendar_header-left-button,
.vue-calendar .calendar_header-right-button {
  @apply flex items-center justify-center focus:outline-none disabled:pointer-events-none duration-300;
}
</style>

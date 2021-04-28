<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="icon-calendar"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>

  <date-input
    class="datepicker__input--first"
    :i18n="i18n"
    :input-date="formatDate(checkIn)"
    input-date-type="check-in"
    :is-open="isOpen"
    :single-day-selection="singleDaySelection"
  />

  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="icon-arrow-right"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M17 8l4 4m0 0l-4 4m4-4H3"
    />
  </svg>

  <date-input
    v-if="!singleDaySelection"
    :i18n="i18n"
    :input-date="formatDate(checkOut)"
    input-date-type="check-out"
    :is-open="isOpen"
    :single-day-selection="singleDaySelection"
  />
</template>


<script lang="ts">
import Helpers from "./helpers";
import { defineComponent, PropType } from "vue";

import DateInput from "./DateInput.vue";

interface I18nTooltip {
  halfDayCheckIn: string;
  halfDayCheckOut: string;
  saturdayToSaturday: string;
  sundayToSunday: string;
  minimumRequiredPeriod: string;
}
interface I18n {
  night: string;
  nights: string;
  "day-names": string[];
  "check-in": string;
  "check-out": string;
  "month-names": string[];
  tooltip: I18nTooltip;
  week: string;
  weeks: string;
}

export default defineComponent({
  name: "DateGroupInput",
  components: {
    DateInput
  },
  props: {
    checkIn: {
      type: Date,
      default: new Date(),
    },
    checkOut: {
      type: Date,
      default: new Date(),
    },
    format: {
      type: String,
      required: true
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
    i18n: {
      type: Object as PropType<I18n>,
      required: true
    },
    singleDaySelection: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    ...Helpers,
    formatDate(date: Date): Date | string {
      return this.dateFormater(date, this.format);
    },
  },
});
</script>

<style scoped>
.icon-calendar {
  @apply h-full w-6 ml-3;
}
.icon-arrow-right {
  @apply h-full w-4 mx-2;
}
</style>

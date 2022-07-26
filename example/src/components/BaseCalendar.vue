<script setup lang="ts">
import type { PropType } from "vue";

import { Calendar } from "../../../src/index";
import type {
  Booking,
  BookingColor,
  Period,
  Placeholder,
} from "../../../src/types";

defineProps({
  bookingColor: {
    type: Object as PropType<BookingColor>,
    default: () => ({}),
  },
  bookingDates: {
    type: Array as PropType<Booking[]>,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  formatDate: {
    type: String,
    default: "DD-MM-YYYY",
  },
  label: {
    type: String,
    default: "",
  },
  startDate: {
    type: [Date, String],
    default: null,
  },
  endDate: {
    type: [Date, String],
    default: null,
  },
  placeholder: {
    type: Object as PropType<Placeholder>,
    default: () => ({}),
  },
  locale: {
    type: String,
    default: "fr",
  },
  periodDates: {
    type: Array as PropType<Period[]>,
    default: () => [],
  },
  rules: {
    type: String,
    default: "",
  },
  wrapperClass: {
    type: String,
    default: "w-full mb-4",
  },
});

const emit = defineEmits(["update:startDate", "update:endDate"]);

const handleCheckIn = (date: Date) => {
  emit("update:startDate", date);
};
const handleCheckOut = (date: Date) => {
  emit("update:endDate", date);
};
</script>

<template>
  <calendar
    :booking-color="bookingColor"
    :booking-dates="bookingDates"
    :check-in="startDate"
    :check-out="endDate"
    :format-date="formatDate"
    :locale="locale"
    :period-dates="periodDates"
    :placeholder="placeholder"
    v-bind="$attrs"
    @update:check-in="handleCheckIn"
    @update:check-out="handleCheckOut"
  />
</template>

<style>
.vue-calendar {
  --calendar-wrapper: #fff;
  --calendar-tooltip-bg: #fff;
  --calendar-tooltip-border: #f0f2f6;

  --calendar-input-bg: #fff;
  --calendar-input-border: #f0f2f6;

  --calendar-paginate-bg: #fff;
  --calendar-paginate-text-color: #636372;
  --calendar-paginate-border-color: #f0f2f6;

  --calendar-paginate-hover-bg: #fff;
  --calendar-paginate-hover-border: #448084;
  --calendar-paginate-hover-text: #448084;

  --calendar-paginate-disabled-bg: #ffffff;
  --calendar-paginate-disabled-border: #f0f2f6;
  --calendar-paginate-disabled-text: #f0f2f6;

  --day-disabled: #f0f2f6;

  --day-border: #d9dae0;
  --day-range-days: #dbf0f0;
  --day-hovering-with-checkIn: #448084;
  --day-checkIn-checkOut: #448084;

  --day-today: #264646;
}
</style>

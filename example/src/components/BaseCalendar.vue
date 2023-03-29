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
    @update:check-in="handleCheckIn"
    @update:check-out="handleCheckOut"
    v-bind="$attrs"
  >
    <template #header>
      <slot name="header" />
    </template>
  </calendar>
</template>

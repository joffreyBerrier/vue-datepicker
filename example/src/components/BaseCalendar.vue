<script setup lang="ts">
import { onMounted, ref } from "vue";

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

const isAffixed = ref(false);

const calendarRef = ref(null);
onMounted(() => {
  console.log(calendarRef.value);
});
</script>

<template>
  <calendar
    ref="calendarRef"
    :booking-color="bookingColor"
    :booking-dates="bookingDates"
    :check-in="startDate"
    :check-out="endDate"
    :has-header="isAffixed"
    :is-affixed="isAffixed"
    :format-date="formatDate"
    locale="fr"
    :period-dates="periodDates"
    :placeholder="placeholder"
    @update:check-in="handleCheckIn"
    @update:check-out="handleCheckOut"
    v-bind="$attrs"
  >
    <template #header>
      <slot name="header" />
    </template>

    <template #calendar-footer>
      <slot name="calendar-footer" />
    </template>

    <template #calendar-header>
      <slot name="calendar-header" />
    </template>

    <template #calendar-header-mobile>
      <slot name="calendar-header-mobile" />
    </template>
  </calendar>
</template>

<style>
.calendar_wrapper.calendar_wrapper--left {
  z-index: 10;
}
</style>

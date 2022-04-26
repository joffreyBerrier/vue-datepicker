<script setup lang="ts">
import { ref } from "vue";
import Calendar from "./components/Calendar.vue";

import type { Ref } from "vue";
import type { Booking, Period } from "./types";

const bookedDates = ref([]);
const bookingColor = ref({
  admin: "#9dc1c9",
  contract: "#a56a0b",
});
const bookingDates: Ref<Booking[]> = ref([
  {
    checkInDate: "2022-07-01",
    checkOutDate: "2022-07-10",
    type: "admin",
  },
  {
    checkInDate: "2022-08-01",
    checkOutDate: "2022-08-20",
    type: "contract",
  },
  {
    checkInDate: "2022-10-01",
    checkOutDate: "2022-10-20",
    type: "contract",
  },
]);
const periodDates: Ref<Period[]> = ref([]);
const checkIn = ref(null);
const checkOut = ref(null);
const nextBookedDates: Ref<Booking[]> = ref([]);

const showYear = ref(false);

const toggleCalendar = () => {
  showYear.value = !showYear.value;
};

const clickOnDate = (day: Date, currentBooking: Booking) => {
  console.log(day, currentBooking);
};

const renderNextMonth = () => {
  if (bookedDates.value.length === 6) {
    bookedDates.value.push(...nextBookedDates);
  }
};
</script>

<template>
  <div class="p-4">
    <h1 class="text-4xl font-bold text-center mb-4">VueCalendar</h1>

    <div class="flex items-center mb-4">
      <p class="font-bold pr-2">Show year:</p>
      <button class="p-2 bg-blue-100" @click="toggleCalendar">
        {{ showYear ? "No" : "Yes" }}
      </button>
    </div>

    <Calendar
      :booked-dates="bookedDates"
      :booking-color="bookingColor"
      :booking-dates="bookingDates"
      :disabled-days-before-day-date="!showYear"
      formatDate="DD-MM-YYYY"
      v-model:checkIn="checkIn"
      v-model:checkOut="checkOut"
      :period-dates="periodDates"
      :show-input-calendar="!showYear"
      :show-year="showYear"
      @render-next-month="renderNextMonth"
      @select-booking-date="clickOnDate"
    />
  </div>
</template>

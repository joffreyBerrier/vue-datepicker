<script setup lang="ts">
import { ref } from "vue";
import BaseCalendar from "./components";

import type { Ref } from "vue";
import type { Booking, Period } from "../../src/types";

const bookedDates = ref(["2022-05-13", "2022-05-12"]);
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

const periodDates: Ref<Period[]> = ref([
  {
    startAt: "2022-08-06",
    endAt: "2022-09-10",
    periodType: "weekly_by_saturday",
    minimumDuration: 2,
  },
  {
    startAt: "2022-09-10",
    endAt: "2022-10-01",
    periodType: "weekly_by_saturday",
    minimumDuration: 2,
  },
  {
    startAt: "2022-10-08",
    endAt: "2022-10-22",
    periodType: "weekly_by_saturday",
    minimumDuration: 2,
  },
  {
    startAt: "2022-10-22",
    endAt: "2022-11-26",
    periodType: "weekly_by_saturday",
    minimumDuration: 3,
  },
  {
    startAt: "2022-12-18",
    endAt: "2023-01-01",
    periodType: "weekly_by_sunday",
    minimumDuration: 1,
  },
  {
    startAt: "2023-01-01",
    endAt: "2023-01-05",
    periodType: "nightly",
    minimumDuration: 3,
  },
  {
    startAt: "2023-01-05",
    endAt: "2023-01-15",
    periodType: "nightly",
    minimumDuration: 7,
  },
  {
    startAt: "2023-01-15",
    endAt: "2023-01-29",
    periodType: "weekly_by_sunday",
    minimumDuration: 1,
  },
  {
    startAt: "2023-01-29",
    endAt: "2023-02-26",
    periodType: "nightly",
    minimumDuration: 10,
  },
  {
    startAt: "2023-02-26",
    endAt: "2023-03-05",
    periodType: "weekly_by_sunday",
    minimumDuration: 1,
  },
  {
    startAt: "2023-03-11",
    endAt: "2023-04-15",
    periodType: "weekly_by_saturday",
    minimumDuration: 3,
  },
  {
    startAt: "2023-04-16",
    endAt: "2023-05-21",
    periodType: "weekly_by_sunday",
    minimumDuration: 1,
  },
  {
    startAt: "2023-05-21",
    endAt: "2023-05-25",
    periodType: "nightly",
    minimumDuration: 2,
  },
  {
    startAt: "2023-05-25",
    endAt: "2023-05-28",
    periodType: "nightly",
    minimumDuration: 3,
  },
  {
    startAt: "2023-05-28",
    endAt: "2023-06-04",
    periodType: "nightly",
    minimumDuration: 7,
  },
  {
    startAt: "2023-11-27",
    endAt: "2023-12-25",
    periodType: "weekly_by_monday",
    minimumDuration: 1,
  },
]);
const checkIn = ref(new Date("2022-07-01"));
const checkOut = ref(new Date("2022-07-10"));
const nextBookedDates: Ref<Booking[]> = ref([]);
const showYear = ref(false);
const placeholder = {
  checkIn: "Check-in",
  checkOut: "Check-out",
};
const clearDates = () => {
  checkIn.value = null;
  checkOut.value = null;
};
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
const pushBookingDates = () => {
  bookingDates.value.push(
    {
      checkInDate: "2022-09-01",
      checkOutDate: "2022-09-10",
      type: "test",
    },
    {
      checkInDate: "2022-09-24",
      checkOutDate: "2022-09-30",
      type: "test",
    }
  );
};
</script>

<template>
  <div class="p-4">
    <p class="text-blue-400">
      What you see comes from the <strong>example folder</strong>
    </p>
    <h1 class="text-4xl font-bold text-center mb-4">VueCalendar</h1>

    <div class="flex items-center mb-4">
      <button
        class="border border-blue-400 bg-blue-200 rounded-full px-3 py-2"
        @click="toggleCalendar"
      >
        {{ showYear ? "Show by month" : "Show by year" }}
      </button>

      <button
        @click="clearDates"
        class="border border-blue-400 bg-blue-200 rounded-full px-3 py-2 mx-4"
      >
        Clear dates
      </button>

      <button
        class="border border-blue-400 bg-blue-200 rounded-full px-3 py-2"
        @click="pushBookingDates"
      >
        Push bookings
      </button>
    </div>

    <BaseCalendar
      :booking-color="bookingColor"
      :booking-dates="bookingDates"
      :period-dates="periodDates"
      :show-year="showYear"
      @toggleCalendar="toggleCalendar"
      v-model:checkIn="checkIn"
      v-model:checkOut="checkOut"
      :placeholder="placeholder"
      @clickOnDate="clickOnDate"
      @renderNextMonth="renderNextMonth"
    />
  </div>
</template>

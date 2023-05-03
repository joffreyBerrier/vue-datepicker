<script setup lang="ts">
import { ref } from "vue";
import BaseCalendar from "./components";

import type { Ref } from "vue";
import type { Booking, Day, Period } from "../../src/types";

const calendar = ref(null);
const bookedDates: Ref<string[]> = ref([
  "2023-09-12",
  "2023-09-13",
  "2023-09-14",
  "2023-09-15",
]);
const bookingColor = ref({
  type1: "#BFD3D9",
  type2: "#ACBA77",
  type3: "#ACB2EE",
  type4: "#E1BB84",
  type5: "#D8BFD9",
  type6: "#BFB380",
  type7: "#DC9898",
}) as Ref<Record<string, string>>;
const bookingDates: Ref<Booking[]> = ref([
  {
    checkInDate: "2023-07-01",
    checkOutDate: "2023-07-10",
    type: "type1",
  },
  {
    checkInDate: "2023-07-10",
    checkOutDate: "2023-07-20",
    type: "type2",
  },
  {
    checkInDate: "2023-07-20",
    checkOutDate: "2023-07-30",
    type: "type3",
  },
  {
    checkInDate: "2023-08-01",
    checkOutDate: "2023-08-20",
    type: "type4",
  },
  {
    checkInDate: "2023-10-01",
    checkOutDate: "2023-10-20",
    type: "type5",
  },
  {
    checkInDate: "2023-10-20",
    checkOutDate: "2023-10-30",
    type: "type6",
  },
  {
    checkInDate: "2023-11-01",
    checkOutDate: "2023-11-12",
    type: "type7",
  },
]);
const periodDates: Ref<Period[]> = ref([
  {
    id: "1",
    endAt: "2023-05-27",
    minimumDuration: 2,
    minimumDurationNights: 14,
    periodType: "weekly_by_saturday",
    startAt: "2023-05-13",
    house: "2812",
  },
  {
    id: "2",
    endAt: "2023-06-25",
    minimumDuration: 1,
    minimumDurationNights: 7,
    periodType: "weekly_by_sunday",
    startAt: "2023-06-04",
    house: "2812",
  },
]);
const checkIn = ref(new Date("2023-05-01"));
const checkOut = ref(new Date("2023-05-10"));
const showAlwaysVisible = ref(false);
const showYear = ref(false);
const placeholder = {
  checkIn: "Check-in",
  checkOut: "Check-out",
};
const clearDates = () => {
  checkIn.value = new Date();
  checkOut.value = new Date();
};
const toggleCalendar = () => {
  showYear.value = !showYear.value;
};
const toggleAlwaysVisible = () => {
  showAlwaysVisible.value = !showAlwaysVisible.value;
};
const clickOnDate = (day: Date, currentBooking: Booking) => {
  console.log(day, currentBooking);
};
const renderNextMonth = () => {
  console.log("renderNextMonth");
};
const selectBookingDate = (day: Day, booking: Booking, e: Event) => {
  console.log(day, booking, e);
};
const pushBookingDates = () => {
  bookingDates.value.push(
    {
      checkInDate: "2022-09-01",
      checkOutDate: "2022-09-10",
      type: "type4",
    },
    {
      checkInDate: "2022-09-24",
      checkOutDate: "2022-09-30",
      type: "type4",
    }
  );
};
</script>

<template>
  <div class="p-4">
    <p class="text-blue-400 py-4 text-[12px]">
      What you see comes from the <strong>Example folder</strong>
    </p>
    <h1 class="text-4xl font-bold text-center mb-4">Vue Calendar</h1>

    <button
      class="px-4 py-3 bg-[#000] text-white hover:bg-[#202020] mb-4"
      @click="toggleAlwaysVisible"
    >
      Show Calendar
    </button>

    <div class="mb-6">
      <p>Check in : {{ checkIn }}</p>
      <p>Check out : {{ checkOut }}</p>
    </div>

    <BaseCalendar
      ref="calendar"
      v-model:checkIn="checkIn"
      v-model:checkOut="checkOut"
      :booking-dates="bookingDates"
      :always-visible="showAlwaysVisible"
      :booked-dates="bookedDates"
      :booking-color="bookingColor"
      :period-dates="periodDates"
      :placeholder="placeholder"
      :show-input-calendar="true"
      has-footer
      :show-year="showYear"
      @click-on-date="clickOnDate"
      @render-next-month="renderNextMonth"
      @select-booking-date="selectBookingDate"
      @toggle-calendar="toggleCalendar"
    >
      <template #header>
        <div class="flex items-center">
          <button
            class="border border-blue-400 bg-blue-200 hover:bg-blue-500 duration-300 rounded-full px-3 py-2"
            @click="toggleCalendar"
          >
            {{ showYear ? "Show by month" : "Show by year" }}
          </button>

          <button
            @click="clearDates"
            class="border border-blue-400 bg-blue-200 hover:bg-blue-500 duration-300 rounded-full px-3 py-2 mx-4"
          >
            Clear dates
          </button>

          <button
            class="border border-blue-400 bg-blue-200 hover:bg-blue-500 duration-300 rounded-full px-3 py-2"
            @click="pushBookingDates"
          >
            Push bookings
          </button>
        </div>
      </template>
    </BaseCalendar>
  </div>
</template>

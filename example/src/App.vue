<script setup lang="ts">
import { ref } from "vue";
import BaseCalendar from "./components";

import type { Ref } from "vue";
import type { Booking, Day, Period } from "../../src/types";

const calendar = ref(null);
const bookedDates = ref(["2022-05-13", "2022-05-12"]);
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
    id: 1,
    checkInDate: "2022-07-01",
    checkOutDate: "2022-07-10",
    type: "type1",
  },
  {
    id: 2,
    checkInDate: "2022-07-10",
    checkOutDate: "2022-07-20",
    type: "type2",
  },
  {
    id: 3,
    checkInDate: "2022-07-20",
    checkOutDate: "2022-07-30",
    type: "type3",
  },
  {
    id: 4,
    checkInDate: "2022-08-01",
    checkOutDate: "2022-08-20",
    type: "type4",
  },
  {
    id: 5,
    checkInDate: "2022-10-01",
    checkOutDate: "2022-10-20",
    type: "type5",
  },
  {
    id: 6,
    checkInDate: "2022-10-20",
    checkOutDate: "2022-10-30",
    type: "type6",
  },
  {
    id: 7,
    checkInDate: "2022-11-01",
    checkOutDate: "2022-11-12",
    type: "type7",
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
const checkIn = ref(new Date("2023-07-01"));
const checkOut = ref(new Date("2023-07-10"));
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
    <p class="text-blue-400">
      What you see comes from the <strong>example folder</strong>
    </p>
    <h1 class="text-4xl font-bold text-center mb-4">VueCalendar</h1>

    <p class="mb-6">Dates : {{ checkIn }} {{ checkOut }}</p>

    <BaseCalendar
      ref="calendar"
      v-model:checkIn="checkIn"
      v-model:checkOut="checkOut"
      :always-visible="true"
      :booking-color="bookingColor"
      :booking-dates="bookingDates"
      :period-dates="periodDates"
      :placeholder="placeholder"
      :show-input-calendar="false"
      :show-year="showYear"
      @toggle-calendar="toggleCalendar"
      @click-on-date="clickOnDate"
      @render-next-month="renderNextMonth"
      @select-booking-date="selectBookingDate"
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

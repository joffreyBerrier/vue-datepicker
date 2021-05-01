<template>
  <div class="px-4">
    <p class="py-4 h-20">
      <template v-if="checkIn">
        {{ checkIn }} - {{ checkOut }}
      </template>
    </p>

    <div class="relative grid grid-cols-2 items-center gap-4">
      <button
        :disabled="activeIndex === 0"
        @click="activeIndex--"
        class="absolute left-0 w-10 h-10 flex items-center justify-center border border-gray-200 focus:outline-none disabled:opacity-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 stroke-current text-gray-800" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <p class="text-center py-2">{{ months[activeIndex].monthName }}</p>
      <p class="text-center py-2">{{ months[activeIndex + 1].monthName }}</p>

      <button
        :disabled="activeIndex >= months.length - 2"
        @click="activeIndex++"
        class="absolute right-0 w-10 h-10 flex items-center justify-center border border-gray-200 focus:outline-none disabled:opacity-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 stroke-current text-gray-800" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div v-for="month in paginate">
        <ul class="grid grid-cols-7 text-center py-6 text-sm">
          <li>Mon</li>
          <li>Tue</li>
          <li>Wed</li>
          <li>Thu</li>
          <li>Fri</li>
          <li>Sat</li>
          <li>Sun</li>
        </ul>
        <div class="grid grid-cols-7">
          <button
            v-for="day in month.days"
            :key="day.formatDay"
            type="button"
            :class="[
              'focus:outline-none relative pb-[100%] border border-gray-200 overflow-hidden',
              { 'pointer-events-none text-gray-300 line-through': !day.belongsToThisMonth },
              { 'border-2 border-green-500' : formatToday === day.formatDay },
              { 'bg-green-500' : checkIn === day.date },
              { 'bg-green-500' : checkOut === day.date },
              { 'bg-green-300' : hoveringDay === day.date },
              { 'bg-gray-100 pointer-events-none' : disabledDates.includes(day.formatDay) },
              { 'bg-gray-100 pointer-events-none': disabledDatesBetweenBookings.includes(day.formatDay) },
              { 'bg-green-300' : hoveringDates.includes(day.formatDay) },
              { 'halfDayCheckIn pointer-events-none' : checkIncheckOutHalfDay[day.formatDay] && checkIncheckOutHalfDay[day.formatDay].checkIn },
              { 'halfDayCheckOut' : checkIncheckOutHalfDay[day.formatDay] && checkIncheckOutHalfDay[day.formatDay].checkOut },
            ]"
            @mouseenter="dayMouseOver(day)"
            @mouseleave="dayMouseLeave"
            @click="dayClicked(day)"
          >
            <span class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              {{ day.dayNumber }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { format } from "fecha";

import { isDateBefore } from "./newHelpers";
import { createMonth, renderMultipleMonth } from './generateMonth'

interface CheckInOrCheckOut {
  checkIn?: boolean;
  checkOut?: boolean;
  dates: string[];
}
interface CheckIncheckOutHalfDay {
  [key: string]: CheckInOrCheckOut;
}
interface Day {
  belongsToThisMonth: boolean;
  date: Date;
  dayNumber: number;
  formatDay: string;
}
interface Month {
  days: Day[];
  monthKey: number;
  monthName: string;
  yearKey: number;
}
interface Booking {
  checkInDate: string
  checkInTime: number
  checkOutDate: string
  checkOutTime: number
  type: string
}

export default defineComponent({
  name: "Calendar",
  props: {
    bookedDates: {
      type: Array,
      default: (): string[] => [],
    },
    bookingDates: {
      type: Array,
      default: (): Booking[] => [],
    },
    checkIn: {
      type: Date,
      default: new Date()
    },
    checkOut: {
      type: Date,
      default: new Date()
    },
    hasDayCheckIn: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeIndex: 0 as number,
      checkIncheckOutHalfDay: {} as CheckIncheckOutHalfDay,
      disabledDates: [] as string[],
      hoveringDates: [] as string[],
      hoveringDay: new Date() as Date,
      months: [] as Month[],
      sortedDisabledDates: [] as Date[],
      disabledDatesBetweenBookings: [] as string[],
      today: new Date as Date,
    };
  },
  beforeMount() {
    // Current month of the current day
    this.months.push(createMonth(this.today));

    // Next 12 month after the current day
    const months = renderMultipleMonth(this.today, 12)
    this.months.push(...months)

    if (this.hasDayCheckIn) {
      this.createHalfDayDates()
    }
  },
  emits: ["update:checkIn", "update:checkOut"],
  computed: {
    formatToday(): string {
      return format(this.today, "YYYY-MM-DD")
    },
    paginate(): Month[] {
      return this.months.slice(this.activeIndex, 2 + this.activeIndex)
    },
  },
  methods: {
    getDayDiff(d1: string, d2: string) {
      const t2 = new Date(d2).getTime();
      const t1 = new Date(d1).getTime();

      return parseInt((t2 - t1) / (24 * 3600 * 1000), 10);
    },
    // Create halfDayDates
    createHalfDayDates() {
      const bookingDates = this.bookingDates.map((booking) => [
        booking.checkInDate,
        booking.checkOutDate,
      ]).reduce((a, b) => {
        return a.concat(b);
      });

      let sortedDates = [] as Date[];
      const checkIncheckOutHalfDay = {} as CheckIncheckOutHalfDay;

      this.bookingDates.forEach((booking: Booking) => {
        checkIncheckOutHalfDay[booking.checkInDate] = {
          checkIn: true,
        };
        checkIncheckOutHalfDay[booking.checkOutDate] = {
          checkOut: true,
        };

        this.disabledDatesBetweenBookings.push(...this.getDatesBetweenTwoDates(new Date(booking.checkInDate), new Date(booking.checkOutDate)))
      });

      const halfDays = Object.keys(checkIncheckOutHalfDay);
      sortedDates = bookingDates.filter(
        (date: any) => !halfDays.includes(date)
      );

      sortedDates = bookingDates.map((date: any) => new Date(date));

      this.sortedDisabledDates = sortedDates.sort((a: Date, b: Date) => a - b);
      this.checkIncheckOutHalfDay = checkIncheckOutHalfDay;
    },
    // Return an array of date between two date with YYYY-MM-DD format
    getDatesBetweenTwoDates(startDate: Date, endDate: Date): string[] {
      let arr = [];

      for (let dt = new Date(startDate); dt <= endDate; dt.setDate(dt.getDate() + 1)) {
        const formatDay = format(new Date(dt), "YYYY-MM-DD")
        const formatStartDate = format(new Date(startDate), "YYYY-MM-DD")
        const formatEndDate = format(new Date(endDate), "YYYY-MM-DD")

        if (
          formatDay != formatStartDate &&
          formatDay != formatEndDate
        ) {
          arr.push(formatDay);
        }
      }

      return arr;
    },
    // Trigger each time the mouseOver is triggered
    dayMouseOver(day: Day) {
      this.hoveringDay = day.date;

      if (this.checkIn && !this.checkOut) {
        this.hoveringDates = this.getDatesBetweenTwoDates(
          this.checkIn,
          this.hoveringDay
        );
      }
    },
    dayMouseLeave() {
      this.hoveringDay = new Date()
    },
    // Trigger each time the click on day is triggered
    dayClicked(day: Day) {
      if (this.checkIn === day.date) {
        this.$emit("update:checkIn", null);
        this.$emit("update:checkOut", null);
        this.disabledDates = [];
        this.hoveringDates = [];
      } else if (this.checkIn && !this.checkOut) {
        this.$emit("update:checkOut", day.date);
        this.disabledDates = [];
      } else if (!this.checkIn) {
        this.$emit("update:checkIn", day.date);
        this.createDisabledDates(day.date);
      } else {
        this.$emit("update:checkIn", day.date);
        this.$emit("update:checkOut", null);
        this.disabledDates = [];
        this.hoveringDates = [];
      }
    },
    // Create an array of disabledTime with YYYY-MM-DD format
    createDisabledDates(date: Date) {
      const checkIn = date;
      const actualMonth = date.getMonth() as number;
      const actualYear = date.getFullYear() as number;
      const monthsIncludeAndBeforeCheckin = this.months.filter(
        (month) => month.monthKey <= actualMonth && month.yearKey === actualYear
      );

      monthsIncludeAndBeforeCheckin.forEach((month) => {
        month.days.forEach((day) => {
          if (isDateBefore(day.date, checkIn)) {
            const formatDay = format(new Date(day.date), "YYYY-MM-DD");

            this.disabledDates.push(formatDay);
          }
        });
      });
    },
  },
});
</script>

<style>
.halfDayCheckIn:before,
.halfDayCheckOut:before {
  content: "";
  z-index: -1;
  border-bottom: 120px solid rgba(243, 244, 246, 1);
  border-left: 120px solid transparent;
  @apply absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-0 w-0 border-b-[120px] border-l-[120px];
}
.halfDayCheckOut:before {
  border-top-color: rgba(243, 244, 246, 1);
  border-right-color: transparent;
  @apply border-t-[120px] border-r-[120px] border-b-0 border-l-0;
}
</style>

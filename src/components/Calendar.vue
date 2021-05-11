<template>
  <div class="w-full relative select-none" ref="Calendar">
    <div
      @click="openCalendar"
      class="flex items-center h-[50px] cursor-pointer px-4 border border-gray-200"
    >
      <base-icon
        name="calendar"
        :color="[
          'mr-4',
          { 'text-gray-300': !checkIn, 'text-gray-700': checkIn },
        ]"
      />

      <p class="flex items-center m-0">
        <span
          :class="[{ 'text-gray-300': !checkIn, 'text-gray-700': checkIn }]"
        >
          <template v-if="checkIn">{{ checkIn }}</template>
          <template v-else>{{ placeholder.checkIn }}</template>
        </span>

        <base-icon
          name="arrowNarrowRight"
          :color="[
            'mx-4',
            { 'text-gray-300': !checkIn, 'text-gray-700': checkIn },
          ]"
        />

        <span
          :class="[{ 'text-gray-300': !checkIn, 'text-gray-700': checkIn }]"
        >
          <template v-if="checkOut">{{ checkOut }}</template>
          <template v-else>{{ placeholder.checkOut }}</template>
        </span>
      </p>
    </div>

    <div
      v-if="showCalendar"
      class="p-4 bg-white shadow-md absolute w-full md:w-[600px] top-[100%]"
    >
      <div class="relative grid grid-cols-2 items-center gap-4">
        <button
          :disabled="activeIndex === 0"
          @click="activeIndex--"
          class="absolute left-0 w-10 h-10 flex items-center justify-center border border-gray-200 focus:outline-none disabled:opacity-50"
        >
          <base-icon name="chevronLeft" />
        </button>

        <p class="text-center py-2">{{ months[activeIndex].monthName }}</p>
        <p class="text-center py-2">{{ months[activeIndex + 1].monthName }}</p>

        <button
          :disabled="activeIndex >= months.length - 2"
          @click="activeIndex++"
          class="absolute right-0 w-10 h-10 flex items-center justify-center border border-gray-200 focus:outline-none disabled:opacity-50"
        >
          <base-icon name="chevronRight" />
        </button>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div v-for="month in paginate">
          <ul class="grid grid-cols-7 text-center py-6 text-sm">
            <li>Mo</li>
            <li>Tu</li>
            <li>We</li>
            <li>Th</li>
            <li>Fr</li>
            <li>Sa</li>
            <li>Su</li>
          </ul>

          <div class="grid grid-cols-7">
            <template v-for="day in month.days" :key="day.formatDay">
              <button
                v-if="day.belongsToThisMonth"
                type="button"
                :class="[
                  // Basic style
                  'focus:outline-none relative pb-[100%] border border-gray-200 overflow-hidden',
                  // Today
                  {
                    'border-2 border-blue-500': formatToday === day.formatDay,
                  },
                  // CheckIn or CheckOut
                  {
                    'bg-blue-500':
                      checkIn === day.date || checkOut === day.date,
                  },
                  // Disabled date
                  {
                    'bg-gray-100 pointer-events-none':
                      isDateBefore(day.date, checkIn) ||
                      bookedDates.includes(day.formatDay) ||
                      disabledDatesBetweenBookings.includes(day.formatDay) ||
                      (checkIn &&
                        nextDisableBookingDate &&
                        isDateAfter(day.date, nextDisableBookingDate)) ||
                      (checkIn &&
                        nextDisabledBookedDate &&
                        isDateAfter(day.date, nextDisabledBookedDate)),
                  },
                  // Hovering date
                  {
                    'bg-blue-300':
                      hoveringDay === day.date ||
                      hoveringDates.includes(day.formatDay),
                  },
                  // Half day checkIn + checkIn
                  {
                    halfDayCheckIn:
                      checkIncheckOutHalfDay[day.formatDay] &&
                      checkIncheckOutHalfDay[day.formatDay].checkIn &&
                      checkIn,
                  },
                  // Half day checkIn + !checkIn
                  {
                    'halfDayCheckIn pointer-events-none':
                      checkIncheckOutHalfDay[day.formatDay] &&
                      checkIncheckOutHalfDay[day.formatDay].checkIn &&
                      !checkIn,
                  },
                  // Half day checkOut
                  {
                    halfDayCheckOut:
                      checkIncheckOutHalfDay[day.formatDay] &&
                      checkIncheckOutHalfDay[day.formatDay].checkOut,
                  },
                ]"
                @mouseenter="dayMouseOver(day)"
                @mouseleave="dayMouseLeave"
                @click="dayClicked(day)"
              >
                <span
                  class="absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                  {{ day.dayNumber }}
                </span>
              </button>
              <span v-else></span>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import { format } from "fecha";

import BaseIcon from "./BaseIcon.vue";

import { createMonth, renderMultipleMonths } from "./generateMonth";
import { isDateAfter, isDateBefore } from "./helpers";
import { nextBookingDate, nextDisabledDate } from "./getNextBookingDate";

import {
  Booking,
  CheckInCheckOutHalfDay,
  Day,
  Month,
  Placeholder,
} from '../types/index'


export default defineComponent({
  name: "Calendar",
  components: {
    BaseIcon,
  },
  props: {
    bookedDates: {
      type: Array as PropType<string[]>,
      default: (): string[] => [],
    },
    bookingDates: {
      type: Array as PropType<Booking[]>,
      default: (): Booking[] => [],
    },
    checkIn: {
      type: Date,
      default: new Date(),
    },
    checkOut: {
      type: Date,
      default: new Date(),
    },
    placeholder: {
      type: Object as PropType<Placeholder>,
      default: (): Placeholder => ({
        checkIn: "Arrivée",
        checkOut: "Départ",
      }),
    },
  },
  data() {
    return {
      activeIndex: 0 as number,
      checkIncheckOutHalfDay: {} as CheckInCheckOutHalfDay,
      disabledDates: [] as string[],
      disabledDatesBetweenBookings: [] as string[],
      formatDay: "YYYY-MM-DD",
      hoveringDates: [] as string[],
      hoveringDay: new Date() as Date,
      months: [] as Month[],
      nextDisableBookingDate: null as Date | null,
      nextDisabledBookedDate: null as Date | null,
      showCalendar: false as boolean,
      sortedDisabledDates: [] as Date[],
      today: new Date() as Date,
    };
  },
  beforeMount() {
    // Current month of the current day
    this.months.push(createMonth(this.today));

    // Next 12 month after the current day
    const months = renderMultipleMonths(this.today, 12);
    this.months.push(...months);

    if (this.bookingDates.length > 0) {
      this.createHalfDayDates();
    }

    document.addEventListener("click", this.handleClickOutside, false);
  },
  unmounted() {
    document.removeEventListener("click", this.handleClickOutside);
  },
  emits: ["update:checkIn", "update:checkOut"],
  computed: {
    formatToday(): string {
      return format(this.today, this.formatDay);
    },
    paginate(): Month[] {
      return this.months.slice(this.activeIndex, 2 + this.activeIndex);
    },
  },
  methods: {
    isDateAfter,
    isDateBefore,
    handleClickOutside(event: Event) {
      const ignoredElement = this.$refs.Calendar as HTMLElement;

      if (ignoredElement && this.showCalendar) {
        const isIgnoredElementClicked = ignoredElement.contains(event.target);

        if (!isIgnoredElementClicked) {
          this.showCalendar = false;
        }
      }
    },
    openCalendar() {
      this.showCalendar = !this.showCalendar;
    },
    // Create halfDayDates
    createHalfDayDates() {
      const bookingDates = this.bookingDates
        .map((booking) => [booking.checkInDate, booking.checkOutDate])
        .reduce((a, b) => {
          return a.concat(b);
        });

      let sortedDates = [] as Date[];
      const checkIncheckOutHalfDay = {} as CheckInCheckOutHalfDay;

      this.bookingDates.forEach((booking: Booking) => {
        checkIncheckOutHalfDay[booking.checkInDate] = {
          checkIn: true,
        };
        checkIncheckOutHalfDay[booking.checkOutDate] = {
          checkOut: true,
        };

        this.disabledDatesBetweenBookings.push(
          ...this.getDatesBetweenTwoDates(
            new Date(booking.checkInDate),
            new Date(booking.checkOutDate)
          )
        );
      });

      const halfDays = Object.keys(checkIncheckOutHalfDay);
      sortedDates = bookingDates
        .filter((date: any) => !halfDays.includes(date))
        .map((date: any) => new Date(date));

      this.sortedDisabledDates = sortedDates.sort((a: Date, b: Date) => a - b);
      this.checkIncheckOutHalfDay = checkIncheckOutHalfDay;
    },
    // Return an array of date between two date with YYYY-MM-DD format
    getDatesBetweenTwoDates(startDate: Date, endDate: Date): string[] {
      let arr = [];

      for (
        let dt = new Date(startDate);
        dt <= endDate;
        dt.setDate(dt.getDate() + 1)
      ) {
        const formatDay = format(new Date(dt), this.formatDay);
        const formatStartDate = format(new Date(startDate), this.formatDay);
        const formatEndDate = format(new Date(endDate), this.formatDay);

        if (formatDay != formatStartDate && formatDay != formatEndDate) {
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
      this.hoveringDay = new Date();
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
        this.getNextBookingDate(day.date);
        this.getNextBookedDate(day.date);
      } else {
        this.$emit("update:checkIn", day.date);
        this.$emit("update:checkOut", null);
        this.disabledDates = [];
        this.hoveringDates = [];
      }
    },
    // Récupère la prochaine date de booking
    getNextBookingDate(date: Date) {
      if (this.bookingDates.length > 0) {
        this.nextDisableBookingDate = nextBookingDate(this.bookingDates, date);
      }
    },
    // Récupère la prochaine date booké
    getNextBookedDate(date: Date) {
      if (this.bookedDates) {
        this.nextDisabledBookedDate = nextDisabledDate(this.bookedDates, date);
      }
    },
  },
});
</script>

<style>
.halfDayCheckIn:before,
.halfDayCheckOut:before {
  content: "";
  z-index: 1;
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

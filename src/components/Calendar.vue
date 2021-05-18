<template>
  <div class="w-full relative select-none" ref="Calendar">
    <div
      @click="openCalendar"
      class="
        flex
        items-center
        h-[50px]
        cursor-pointer
        px-4
        border border-gray-200
      "
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
          <template v-if="checkIn">
            {{ dayFormat(checkIn) }}
          </template>
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
          <template v-if="checkOut">
            {{ dayFormat(checkOut) }}
          </template>
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
          class="
            absolute
            left-0
            w-10
            h-10
            flex
            items-center
            justify-center
            border border-gray-200
            focus:outline-none
            disabled:opacity-50
          "
        >
          <base-icon name="chevronLeft" />
        </button>

        <p class="text-center py-2">{{ months[activeIndex].monthName }}</p>
        <p class="text-center py-2">{{ months[activeIndex + 1].monthName }}</p>

        <button
          :disabled="activeIndex >= months.length - 2"
          @click="activeIndex++"
          class="
            absolute
            right-0
            w-10
            h-10
            flex
            items-center
            justify-center
            border border-gray-200
            focus:outline-none
            disabled:opacity-50
          "
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
                      (disabledDates.includes(day.formatDay) &&
                        !checkIncheckOutHalfDay[day.formatDay]) ||
                      (checkIn &&
                        nextDisableBookingDate &&
                        isDateAfter(day.date, nextDisableBookingDate)),
                  },
                  // Hovering date
                  {
                    'bg-blue-300':
                      !checkIn && checkIn !== day.date && hoveringDay === day.date ||
                      hoveringDates.includes(day.formatDay),
                  },
                  {
                    'bg-blue-500':
                      checkIn && hoveringDay === day.date
                  },
                  // Half day checkIn + checkIn
                  {
                    'half-day_checkin':
                      checkIncheckOutHalfDay[day.formatDay] &&
                      checkIncheckOutHalfDay[day.formatDay].checkIn &&
                      checkIn,
                  },
                  // Half day checkIn + !checkIn
                  {
                    'half-day_checkin pointer-events-none':
                      checkIncheckOutHalfDay[day.formatDay] &&
                      checkIncheckOutHalfDay[day.formatDay].checkIn &&
                      !checkIn,
                  },
                  // Half day checkOut
                  {
                    'half-day_checkOut':
                      checkIncheckOutHalfDay[day.formatDay] &&
                      checkIncheckOutHalfDay[day.formatDay].checkOut,
                  },
                  // Inactive saturday period
                  {
                    'day-period_saturday':
                      saturdayWeeklyPeriods.includes(day.formatDay) &&
                      day.date.getDay() !== 6,
                  },
                  // Inactive sunday period
                  {
                    'day-period_sunday':
                      sundayWeeklyPeriods.includes(day.formatDay) &&
                      day.date.getDay() !== 0,
                  },
                  // CheckIn saturday period
                  {
                    'checkIn-in-period':
                      checkIn !== day.date &&
                      currentPeriod?.periodType === 'weekly_by_saturday' &&
                      currentPeriod?.nextEnableDate > day.date &&
                      saturdayWeeklyPeriods.includes(day.formatDay) &&
                      day.date.getDay() === 6,
                  },
                  // CheckIn sunday period
                  {
                    'checkIn-in-period':
                      checkIn !== day.date &&
                      currentPeriod?.periodType === 'weekly_by_sunday' &&
                      currentPeriod?.nextEnableDate > day.date &&
                      sundayWeeklyPeriods.includes(day.formatDay) &&
                      day.date.getDay() === 0,
                  },
                  // CheckIn nightly period
                  {
                    'checkIn-in-period':
                      checkIn !== day.date &&
                      currentPeriod?.periodType === 'nightly' &&
                      currentPeriod?.nextEnableDate > day.date &&
                      nightlyPeriods.includes(day.formatDay)
                  }
                ]"
                @mouseenter="dayMouseOver(day)"
                @mouseleave="dayMouseLeave"
                @click="dayClicked(day)"
              >
                <span
                  class="
                    absolute
                    z-10
                    top-1/2
                    left-1/2
                    transform
                    -translate-x-1/2 -translate-y-1/2
                  "
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

import {
  isDateAfter,
  getDayDiff,
  isDateBefore,
  addDays,
  validateDateBetweenTwoDates,
} from "./helpers";

import { createMonth, renderMultipleMonths } from "./generateMonth";
import { nextBookingDate } from "./getNextBookingDate";

import {
  Booking,
  CheckInCheckOutHalfDay,
  CurrentPeriod,
  Day,
  Month,
  Period,
  Placeholder,
} from "../types/index";

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
    formatDate: {
      type: String,
      default: 'YYYY-MM-DD'
    },
    periodDates: {
      type: Array as PropType<Period[]>,
      default: (): Period[] => [],
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
      currentPeriod: null as CurrentPeriod | null,
      disabledDates: [] as string[],
      formatDay: "YYYY-MM-DD",
      hoveringDates: [] as string[],
      hoveringDay: new Date() as Date,
      months: [] as Month[],
      nextDisableBookingDate: null as Date | null,
      newBookingDates: [] as Booking[],
      showCalendar: true as boolean,
      today: new Date() as Date,
    };
  },
  beforeMount() {
    // Current month of the current day
    this.months.push(createMonth(this.today));

    // Next 12 month after the current day
    const months = renderMultipleMonths(this.today, 12);
    this.months.push(...months);

    if (this.bookingDates.length > 0 || this.bookedDates.length > 0)
      this.createHalfDayDates();

    document.addEventListener("click", this.handleClickOutside, false);
  },
  unmounted() {
    document.removeEventListener("click", this.handleClickOutside);
  },
  emits: ["update:checkIn", "update:checkOut"],
  computed: {
    saturdayWeeklyPeriods(): string[] {
      if (
        this.periodDates.length > 0 &&
        this.periodDates.some(
          (period) => period.periodType === "weekly_by_saturday"
        )
      ) {
        return this.periodDates
          .filter((period) => period.periodType === "weekly_by_saturday")
          .map((period) => {
            return this.getDatesBetweenTwoDates(
              new Date(period.startAt),
              new Date(period.endAt)
            );
          })[0];
      }

      return [];
    },
    sundayWeeklyPeriods(): string[] {
      if (
        this.periodDates.length > 0 &&
        this.periodDates.some(
          (period) => period.periodType === "weekly_by_sunday"
        )
      ) {
        return this.periodDates
          .filter((period) => period.periodType === "weekly_by_sunday")
          .map((period) => {
            return this.getDatesBetweenTwoDates(
              new Date(period.startAt),
              new Date(period.endAt)
            );
          })[0];
      }

      return [];
    },
    nightlyPeriods(): string[] {
      if (
        this.periodDates.length > 0 &&
        this.periodDates.some(
          (period) => period.periodType === "nightly"
        )
      ) {
        return this.periodDates
          .filter((period) => period.periodType === "nightly")
          .map((period) => {
            return this.getDatesBetweenTwoDates(
              new Date(period.startAt),
              new Date(period.endAt)
            );
          })[0];
      }

      return [];
    },
    formatToday(): string {
      return format(this.today, this.formatDay);
    },
    paginate(): Month[] {
      return this.months.slice(this.activeIndex, 2 + this.activeIndex);
    },
  },
  methods: {
    dayFormat(date: Date): string {
      return format(date, this.formatDate)
    },
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
      const checkIncheckOutHalfDay = {} as CheckInCheckOutHalfDay;

      const disabledDates = [...this.bookedDates];

      for (let i = 0; i < disabledDates.length; i++) {
        const newDate = disabledDates[i];
        const newDateIncrementOne = disabledDates[i + 1];

        if (i === 0) {
          checkIncheckOutHalfDay[newDate] = {
            checkIn: true,
          };
        }

        if (
          !checkIncheckOutHalfDay[newDate] &&
          disabledDates[i + 1] &&
          getDayDiff(newDate, newDateIncrementOne) > 1
        ) {
          checkIncheckOutHalfDay[newDate] = {
            checkOut: true,
          };
          checkIncheckOutHalfDay[newDateIncrementOne] = {
            checkIn: true,
          };
        }

        if (i === disabledDates.length - 1) {
          checkIncheckOutHalfDay[newDate] = {
            checkOut: true,
          };
        }
      }

      this.createBookingDates(checkIncheckOutHalfDay);

      this.bookingDates.forEach((booking: Booking) => {
        checkIncheckOutHalfDay[booking.checkInDate] = {
          checkIn: true,
        };
        checkIncheckOutHalfDay[booking.checkOutDate] = {
          checkOut: true,
        };

        this.disabledDates.push(
          ...this.getDatesBetweenTwoDates(
            new Date(booking.checkInDate),
            new Date(booking.checkOutDate)
          )
        );
      });

      this.disabledDates.push(...disabledDates);
      this.disabledDates.sort((a, b) => {
        const aa = a.split("/").reverse().join();
        const bb = b.split("/").reverse().join();

        return aa < bb ? -1 : aa > bb ? 1 : 0;
      });

      this.checkIncheckOutHalfDay = checkIncheckOutHalfDay;
    },
    createBookingDates(checkIncheckOutHalfDay: CheckInCheckOutHalfDay) {
      // Create bookingDates with bookedDates
      const newBookingDates = new Set() as Set<Booking>;
      let increment = 0 as number;
      let booking = {} as Booking;

      Object.keys(checkIncheckOutHalfDay).forEach((date: string, i: number) => {
        increment = i;

        if (checkIncheckOutHalfDay[date].checkIn) booking.checkInDate = date;
        if (checkIncheckOutHalfDay[date].checkOut) booking.checkOutDate = date;

        if (increment % 2 === 1) {
          newBookingDates.add({
            checkInDate: booking.checkInDate,
            checkOutDate: booking.checkOutDate,
          });
        }
      });

      this.newBookingDates = [...this.bookingDates, ...newBookingDates];
      this.newBookingDates.sort((a, b) => {
        const aa = a.checkInDate.split("/").reverse().join();
        const bb = b.checkInDate.split("/").reverse().join();

        return aa < bb ? -1 : aa > bb ? 1 : 0;
      });
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
        // CheckIn when already CheckIn
        this.$emit("update:checkIn", null);
        this.$emit("update:checkOut", null);
        this.nextDisableBookingDate = null;
        this.currentPeriod = null;
        this.hoveringDates = [];
      } else if (this.checkIn && !this.checkOut) {
        // CheckIn + !ChecKout
        this.$emit("update:checkOut", day.date);
        this.nextDisableBookingDate = null;
        this.currentPeriod = null;
      } else if (!this.checkIn) {
        // CheckIn
        this.$emit("update:checkIn", day.date);
        this.getNextBookingDate(day);
        this.getCurrentPeriod(day);
      } else {
        // CheckIn + CheckOut
        this.$emit("update:checkIn", day.date);
        this.$emit("update:checkOut", null);
        this.getNextBookingDate(day);
        this.getCurrentPeriod(day);
        this.hoveringDates = [];
      }
    },
    // Récupère la prochaine date de booking
    getNextBookingDate(day: Day) {
      if (this.newBookingDates.length > 0) {
        let newDate = day.date;
        if (this.checkIncheckOutHalfDay[day.formatDay]?.checkOut) {
          newDate = addDays(day.date, 1);
        }

        this.nextDisableBookingDate = nextBookingDate(
          this.newBookingDates,
          newDate
        );
      }
    },
    getCurrentPeriod(day: Day) {
      this.periodDates.forEach((period: Period) => {
        if (
          period.endAt !== day.formatDay &&
          (period.startAt === day.formatDay ||
            validateDateBetweenTwoDates(
              period.startAt,
              period.endAt,
              day.formatDay
            ))
        ) {
          const durationType =
            period.periodType === "weekly_by_saturday" ||
            period.periodType === "weekly_by_sunday"
              ? "week"
              : "day"
          const minimumDuration =
            durationType === "week"
              ? period.minimumDuration * 7
              : period.minimumDuration;

          this.currentPeriod = {
            ...period,
            nextEnableDate: addDays(day.date, minimumDuration),
          };
        }
      });
    },
  },
});
</script>

<style>
.half-day_checkin:before,
.half-day_checkOut:before {
  content: "";
  z-index: 1;
  border-bottom: 120px solid rgba(243, 244, 246, 1);
  border-left: 120px solid transparent;
  @apply absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-0 w-0 border-b-[120px] border-l-[120px];
}
.half-day_checkOut:before {
  border-top-color: rgba(243, 244, 246, 1);
  border-right-color: transparent;
  @apply border-t-[120px] border-r-[120px] border-b-0 border-l-0;
}
.day-period_saturday,
.day-period_sunday {
  @apply pointer-events-none font-extralight;
}
.checkIn-in-period {
  @apply pointer-events-none font-extralight;
}
</style>

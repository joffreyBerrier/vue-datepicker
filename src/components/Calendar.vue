<template>
  <div>
    <p>{{checkIn}} - {{checkOut}}</p>
    <div class="px-4 grid grid-cols-2 gap-4">
      <div v-for="month in paginate">
        <div class="text-center">{{ month.monthName }}</div>
        <ul class="grid grid-cols-7 text-center py-4">
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
            type="button"
            :class="[
              'focus:outline-none relative pb-[100%] border border-gray-200 transition-all',
              { 'pointer-events-none text-gray-300 line-through': !day.belongsToThisMonth },
              { 'border-2 border-green-500' : formatToday === day.formatDay },
              { 'bg-green-500' : checkIn === day.date },
              { 'bg-green-500' : checkOut === day.date },
              { 'bg-green-300' : hoveringDay === day.date },
              { 'bg-gray-300' : disabledDates.includes(day.formatDay) },
              { 'bg-green-300' : hoveringDates.includes(day.formatDay) }
            ]"
            v-for="day in month.days"
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

export default defineComponent({
  name: "Calendar",
  props: {
    checkIn: {
      type: Date,
    },
    checkOut: {
      type: Date,
    },
  },
  data() {
    return {
      today: new Date as Date,
      disabledDates: [] as string[],
      hoveringDates: [] as string[],
      hoveringDay: new Date() as Date,
      months: [] as Month[],
    };
  },
  beforeMount() {
    // Current month of the current day
    this.months.push(createMonth(this.today));

    // Next 12 month after the current day
    const months = renderMultipleMonth(this.today, 12)
    this.months.push(...months)
  },
  emits: ["update:checkIn", "update:checkOut"],
  computed: {
    formatToday(): string {
      return format(this.today, "DD/MM/YYYY")
    },
    paginate(): Month[] {
      return this.months.slice(0, 2)
    },
  },
  methods: {
    // Return an array of date between two date with DD/MM/YYYY format
    getDatesBetweenTwoDates(start: Date, end: Date): string[] {
      let arr = [];
      for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
        arr.push(format(new Date(dt), "DD/MM/YYYY"));
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
    // Create an array of disabledTime with DD/MM/YYYY format
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
            const formatDay = format(new Date(day.date), "DD/MM/YYYY");

            this.disabledDates.push(formatDay);
          }
        });
      });
    },
  },
});
</script>

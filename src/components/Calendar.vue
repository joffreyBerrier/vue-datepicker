<template>
  <div
    :class="[
      'datepicker__wrapper',
      {
        'datepicker__wrapper--booking': bookings.length > 0,
        datepicker__fullview: alwaysVisible,
      },
    ]"
    :ref="`DatePicker-${hash}`"
    v-if="show"
  >
    <div
      v-if="isOpen && isMobile"
      @click="closeMobileDatepicker"
      class="datepicker__close-button"
    >
      <i>+</i>
    </div>
    <div
      @click="toggleDatepicker"
      v-if="!alwaysVisible"
      :class="[
        'datepicker__dummy-wrapper',
        { 'datepicker__dummy-wrapper--is-active': isOpen },
      ]"
    >
      <date-group-input
        :checkIn="checkIn"
        :checkOut="checkOut"
        :format="format"
        :i18n="i18n"
        :isOpen="isOpen"
        :singleDaySelection="singleDaySelection"
      />
    </div>
    <div
      class="datepicker__clear-button"
      tabindex="0"
      @click="clearSelection"
      v-if="showClearSelectionButton"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 68 68"
      >
        <path d="M6.5 6.5l55 55M61.5 6.5l-55 55"></path>
      </svg>
    </div>
    <div :class="[
        'datepicker',
        {
          'datepicker--open': isOpen && !alwaysVisible,
          'datepicker--closed': !isOpen && !alwaysVisible,
          'datepicker--right': positionRight,
        },
      ]">
      <div v-if="isOpen && isMobile">
        <div
          @click="toggleDatepicker"
          :class="[
            'datepicker__dummy-wrapper',
            { 'datepicker__dummy-wrapper--is-active': isOpen },
          ]"
        >
          <date-group-input
            :checkIn="checkIn"
            :checkOut="checkOut"
            :format="format"
            :i18n="i18n"
            :isOpen="isOpen"
            :singleDaySelection="singleDaySelection"
          />
        </div>

        <DatePickerWeekRow
          v-if="!alwaysVisible"
          :dayNames="i18n['day-names']"
        />
      </div>

      <div
        v-if="isOpen || alwaysVisible"
        class="datepicker__inner"
      >
        <div
          class="datepicker__header"
          v-if="isDesktop || alwaysVisible"
        >
          <button
            type="button"
            class="datepicker__month-button"
            @click="renderPreviousMonth"
            :tabindex="isOpen ? 0 : -1"
            :disabled="activeMonthIndex === 0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="icon-arrow-left" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div class="wrap_datepicker__month">
            <p class="datepicker__month-name" v-if="months[activeMonthIndex + 0]">
              {{ months[activeMonthIndex + 0].monthName }}
            </p>
            <p class="datepicker__month-name" v-if="months[activeMonthIndex + 1]">
              {{ months[activeMonthIndex + 1].monthName }}
            </p>
          </div>

          <button
            type="button"
            class="datepicker__month-button"
            @click="renderNextMonth"
            :disabled="isPreventedMaxMonth"
            :tabindex="isOpen ? 0 : -1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="icon-arrow-right" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div
          ref="swiperWrapper"
          :class="[
            'datepicker__months',
            { 'datepicker__months--full': showSingleMonth || alwaysVisible },
            {
              'show-tooltip': isMobile && showCustomTooltip && hoveringTooltip,
            },
          ]"
          v-if="
            isDesktop || alwaysVisible || (isMobile && isOpen && !alwaysVisible)
          "
        >
          <template v-if="isMobile">
            <div
              class="datepicker__tooltip--mobile"
              v-if="hoveringTooltip"
            >
              <template v-if="customTooltipMessage">
                {{ cleanString(customTooltipMessage) }}
              </template>
            </div>

            <button
              v-if="!alwaysVisible && activeMonthIndex > 0"
              class="datepicker__button-paginate--mobile datepicker__button-paginate--mobile--top"
              @click="renderPreviousMonth"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon-arrow"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </button>
          </template>

          <!-- Wait for create months -->
          <template v-if="months.length > 0">
            <div
              ref="datepickerMonth"
              class="datepicker__month"
              v-for="(month, monthIndex) in paginate"
              :data-key="activeMonthIndex + month"
              :key="`${datepickerMonthKey}-${month}`"
            >
              <template v-if="months[activeMonthIndex + month]">
                <p class="datepicker__month-name" v-if="!isDesktop">
                  {{ months[activeMonthIndex + month].monthName }}
                </p>

                <DatePickerWeekRow
                  v-if="isDesktop || alwaysVisible"
                  :class="{
                    'datepicker__week-row--always-visible': alwaysVisible,
                  }"
                  :dayNames="i18n['day-names']"
                />

                <div class="container-square">
                  <div
                    :class="[
                      'square',
                      { 'not-in-the-month': !day.belongsToThisMonth },
                    ]"
                    v-for="(day, dayIndex) in months[activeMonthIndex + month]
                      .days"
                    @mouseenter="mouseEnterDay(day)"
                    :key="`${datepickerDayKey}-${monthIndex}-${dayIndex}`"
                  >
                    <Day
                      v-show="day.belongsToThisMonth"
                      :activeMonthIndex="activeMonthIndex"
                      :bookings="sortBookings"
                      :checkIn="checkIn"
                      :checkIncheckOutHalfDay="checkIncheckOutHalfDay"
                      :checkInPeriod="checkInPeriod"
                      :checkOut="checkOut"
                      :date="day.date"
                      :disableCheckoutOnCheckin="disableCheckoutOnCheckin"
                      :duplicateBookingDates="duplicateBookingDates"
                      :hoveringDate="hoveringDate"
                      :hoveringPeriod="hoveringPeriod"
                      :i18n="i18n"
                      :isDesktop="isDesktop"
                      :isOpen="isOpen"
                      :minNightCount="minNightCount"
                      :nextDisabledDate="nextDisabledDate"
                      :nextPeriodDisableDates="nextPeriodDisableDates"
                      :options="$props"
                      :screenSize="screenSize"
                      :showCustomTooltip="showCustomTooltip"
                      :sortedDisabledDates="sortedDisabledDates"
                      :sortedPeriodDates="sortedPeriodDates"
                      :tooltipMessage="customTooltipMessage"
                      @clearSelection="clearSelection"
                      @bookingClicked="handleBookingClicked"
                      @dayClicked="handleDayClick"
                    />
                  </div>
                </div>
              </template>
            </div>
          </template>

          <button
            v-if="!alwaysVisible && isMobile"
            class="datepicker__button-paginate--mobile"
            :disabled="isPreventedMaxMonth"
            @click="renderNextMonth"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon-arrow"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        <slot name="content" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import fecha from "fecha";
import Day from "./Day.vue";
import DateGroupInput from "./DateGroupInput.vue";
import DatePickerWeekRow from "./DatePickerWeekRow.vue";
import Helpers from "./helpers";

interface I18nTooltip {
  halfDayCheckIn: string;
  halfDayCheckOut: string;
  saturdayToSaturday: string;
  sundayToSunday: string;
  minimumRequiredPeriod: string;
}
interface I18n {
  night: string;
  nights: string;
  "day-names": string[];
  "check-in": string;
  "check-out": string;
  "month-names": string[];
  tooltip: I18nTooltip;
  week: string;
  weeks: string;
}
interface FirstDayOfLastMonth {
  belongsToThisMonth: boolean;
  date: Date;
}
interface CheckInCheckOutHalfDay {
  checkIn?: boolean;
  checkOut?: boolean;
}
interface CheckIncheckOutHalfDay {
  [key: string]: CheckInCheckOutHalfDay;
}
interface Style {
  [key: string]: string;
}
interface Period {
  endAt: Date;
  minimumDuration: number;
  periodType: string;
  startAt: string;
}
interface HoveringPeriod {
  endAt: Date | null;
  minimumDuration: number;
  periodType: string;
  startAt: Date | null;
}
interface Booking {
  checkInDate: string;
  checkOutDate: string;
  id: string;
  style: Style;
}
interface Day {
  date: Date;
  belongsToThisMonth: boolean;
}
interface Month {
  monthName: string;
  days: Day[];
}

export default defineComponent({
  name: "DatePicker",
  components: {
    DateGroupInput,
    DatePickerWeekRow,
    Day,
  },
  props: {
    alwaysVisible: {
      type: Boolean,
      default: false,
    },
    bookings: {
      type: Array as PropType<Booking[]>,
      default: (): Booking[] => {
        return [];
      },
    },
    clickOutsideElementId: {
      type: String,
      default: "",
    },
    closeDatepickerOnClickOutside: {
      type: Boolean,
      default: true,
    },
    countOfDesktopMonth: {
      type: Number,
      default: 2,
    },
    countOfMobileMonth: {
      type: Number,
      default: 8,
    },
    countOfTotalMonthByDefault: {
      type: Number,
      default: 12,
    },
    disabledDates: {
      type: Array as PropType<string[]>,
      default: (): string[] => {
        return [];
      },
    },
    disabledDaysOfWeek: {
      type: Array as PropType<string[]>,
      default: (): string[] => {
        return [];
      },
    },
    displayClearButton: {
      type: Boolean,
      default: true,
    },
    disableCheckoutOnCheckin: {
      type: Boolean,
      default: false,
    },
    enableCheckout: {
      type: Boolean,
      default: false,
    },
    endDate: {
      type: [Date, String, Number],
      default: Infinity,
    },
    endingDateValue: {
      type: Date,
      default: null,
    },
    firstDayOfWeek: {
      type: Number,
      default: 0,
    },
    format: {
      type: String,
      default: "YYYY-MM-DD",
    },
    halfDay: {
      type: Boolean,
      default: true,
    },
    hoveringTooltip: {
      default: true,
      type: [Boolean, Function],
    },
    i18n: {
      type: Object as PropType<I18n>,
      default: (): I18n => ({
        night: "Night",
        nights: "Nights",
        "day-names": ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"],
        "check-in": "Check-in",
        "check-out": "Check-out",
        "month-names": [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        tooltip: {
          halfDayCheckIn: "Available CheckIn",
          halfDayCheckOut: "Available CheckOut",
          saturdayToSaturday: "Only Saturday to Saturday",
          sundayToSunday: "Only Sunday to Sunday",
          minimumRequiredPeriod: "%{minNightInPeriod} %{night} minimum.",
        },
        week: "week",
        weeks: "weeks",
      }),
    },
    lastDateAvailable: {
      type: [Number, Date],
      default: Infinity,
    },
    maxNights: {
      type: Number,
      default: null,
    },
    minNights: {
      type: Number,
      default: 1,
    },
    periodDates: {
      type: Array as PropType<Period[]>,
      default: (): Period[] => {
        return [];
      },
    },
    positionRight: {
      type: Boolean,
      default: false,
    },
    showSingleMonth: {
      type: Boolean,
      default: false,
    },
    showYear: {
      type: Boolean,
      default: false,
    },
    singleDaySelection: {
      type: Boolean,
      default: false,
    },
    startDate: {
      type: [Date, String],
      default: () => {
        return new Date();
      },
    },
    startingDateValue: {
      type: Date,
      default: null,
    },
    tooltipMessage: {
      type: String,
      default: null,
    },
    value: {
      type: String,
    },
  },
  emits: [
    "check-in-changed",
    "check-out-changed",
    "booking-clicked",
    "period-selected",
    "day-clicked",
    "height-changed",
    "clear-selection",
    "render-next-month",
    "handle-check-incheck-out-half-day",
  ],
  data() {
    return {
      activeMonthIndex: 0 as number,
      checkIn: this.startingDateValue as Date | null,
      checkIncheckOutHalfDay: {},
      checkInPeriod: {},
      checkOut: this.endingDateValue as Date | null,
      customTooltip: "" as string,
      customTooltipHalfday: "" as string,
      datepickerDayKey: 0 as number,
      datepickerMonthKey: 0 as number,
      dynamicNightCounts: null as number | null,
      hash: Date.now(),
      hoveringDate: null as Date | null,
      hoveringPeriod: {} as HoveringPeriod,
      isOpen: false as boolean,
      months: [] as Month[],
      nextDisabledDate: null as Date | number | null,
      nextPeriodDisableDates: [] as Date[],
      screenSize: "" as string,
      show: true as boolean,
      showCustomTooltip: false as boolean,
      sortedDisabledDates: null,
    };
  },
  computed: {
    isMobile(): boolean {
      return this.screenSize !== "desktop";
    },
    isDesktop(): boolean {
      return this.screenSize === "desktop";
    },
    sortBookings(): Booking[] {
      if (this.bookings.length > 0) {
        const bookings = [...this.bookings];

        return bookings.sort((a, b) => {
          const aa = a.checkInDate.split("/").reverse().join();
          const bb = b.checkOutDate.split("/").reverse().join();

          // eslint-disable-next-line no-nested-ternary
          return aa < bb ? -1 : aa > bb ? 1 : 0;
        });
      }

      return [];
    },
    duplicateBookingDates(): string[] {
      return this.baseHalfDayDates.filter(
        ((newArr) => (date: string) => newArr.has(date) || !newArr.add(date))(
          new Set()
        )
      );
    },
    baseHalfDayDates(): string[] {
      if (this.sortBookings.length > 0) {
        const bookings = this.sortBookings.map((x) => [
          x.checkInDate,
          x.checkOutDate,
        ]);

        return bookings.reduce((a, b) => {
          return a.concat(b);
        });
      }

      return this.disabledDates;
    },
    paginate(): number[] {
      if (this.isDesktop) {
        return this.paginateDesktop;
      }

      return this.paginateMobile;
    },
    paginateDesktop(): number[] {
      if (this.showSingleMonth) {
        return [0];
      }

      return this.numberToArr(this.countOfDesktopMonth);
    },
    paginateMobile(): number[] {
      if (this.showSingleMonth || this.alwaysVisible) {
        return [0];
      }

      return this.numberToArr(this.countOfMobileMonth);
    },
    customTooltipMessage(): string {
      let tooltip = "";
      const currentDate = this.hoveringDate || this.checkIn;

      if (currentDate && (this.customTooltip || this.customTooltipHalfday)) {
        if (this.customTooltip && this.customTooltipHalfday) {
          tooltip = `${this.customTooltipHalfday}. <br/> ${this.customTooltip}`;
        } else if (this.customTooltipHalfday && !this.customTooltip) {
          tooltip = this.customTooltipHalfday;
        } else {
          tooltip = this.customTooltip;
        }

        return tooltip;
      }

      return this.tooltipMessage;
    },
    sortedPeriodDates(): Period[] {
      if (this.periodDates) {
        const periodDates = [...this.periodDates];

        return periodDates.sort((a: Period, b: Period) => {
          const aa = a.startAt.split("/").reverse().join();
          const bb = b.startAt.split("/").reverse().join();

          return aa < bb ? -1 : aa > bb ? 1 : 0;
        });
      }

      return this.periodDates;
    },
    isPreventedMaxMonth(): boolean {
      const lastIndexMonthAvailable = this.getMonthDiff(
        this.startDate,
        this.lastDateAvailable
      );

      if (this.isDesktop) {
        return this.activeMonthIndex >= lastIndexMonthAvailable - 1;
      }

      return (
        this.activeMonthIndex + this.countOfMobileMonth >=
        lastIndexMonthAvailable + 1
      );
    },
    minNightCount(): number {
      return this.dynamicNightCounts || this.minNights;
    },
    showClearSelectionButton(): boolean {
      return Boolean(
        (this.checkIn || this.checkOut) && this.displayClearButton
      );
    },
  },
  watch: {
    bookings() {
      this.createHalfDayDates(this.baseHalfDayDates);
    },
    disabledDates(newVal) {
      this.createHalfDayDates(newVal);
    },
    isOpen(value) {
      if (this.isMobile && !this.alwaysVisible) {
        const body = document.querySelector("body");

        if (value) {
          body.style.overflow = "hidden";

          this.$nextTick(() => {
            if (this.checkIn && this.checkOut) {
              const { swiperWrapper } = this.$refs;
              const currentSelectionIndex = this.checkOut
                ? this.getMonthDiff(new Date(), this.checkOut)
                : 0;

              if (currentSelectionIndex > 1) {
                const currentMonth = document.querySelectorAll(
                  `div[data-key="${currentSelectionIndex}"]`
                )[0];

                if (currentMonth)
                  swiperWrapper.scrollTop = currentMonth.offsetTop;
              }
            }
          });
        } else {
          body.style.overflow = "";
        }
      }
    },
    checkIn(newDate) {
      this.$emit("check-in-changed", newDate);
    },
    checkOut(newDate) {
      if (this.checkOut !== null) {
        this.hoveringDate = null;
        this.nextDisabledDate = null;
        this.createHalfDayDates(this.baseHalfDayDates);
        this.reRender();
        this.showCustomTooltip = false;
        this.isOpen = false;
      }

      this.$emit("check-out-changed", newDate);
    },
  },
  created() {
    if (this.isDateBefore(this.checkIn, this.startDate)) {
      this.checkIn = null;
      this.checkOut = null;
    }

    fecha.i18n = {
      dayNames: this.i18n["day-names"],
      dayNamesShort: this.shortenString(this.i18n["day-names"], 3),
      monthNames: this.i18n["month-names"],
      monthNamesShort: this.shortenString(this.i18n["month-names"], 3),
      amPm: ["am", "pm"],
      // D is the day of the month, function returns something like...  3rd or 11th
      DoFn(D) {
        return (
          D +
          ["th", "st", "nd", "rd"][
            D % 10 > 3 ? 0 : ((D - (D % 10) !== 10) * D) % 10
          ]
        );
      },
    };
  },
  mounted() {
    this.handleWindowResize();
    this.constructMonth();

    window.addEventListener("resize", this.handleWindowResize);

    if (this.isDesktop) {
      document.addEventListener("click", this.handleClickOutside, false);
      document.addEventListener("keyup", this.escFunction, false);
    }

    this.onElementHeightChange(document.body, () => {
      this.emitHeighChangeEvent();
    });

    this.createHalfDayDates(this.baseHalfDayDates);
  },
  unmounted() {
    window.removeEventListener("resize", this.handleWindowResize);

    if (this.isDesktop) {
      document.removeEventListener("keyup", this.escFunction, false);
      document.removeEventListener("click", this.handleClickOutside);
    }
  },
  methods: {
    ...Helpers,
    constructMonth() {
      const startDate = new Date(this.startDate);
      const diffMonthBetweenStarDateAndCheckOut = this.getMonthDiff(
        this.startDate,
        this.checkOut
      );
      const countOfMonth = this.isDesktop
        ? this.countOfDesktopMonth
        : this.countOfMobileMonth;

      // Create StartDate month
      this.createMonth(startDate);

      // If checkIn && checkOut && difference between startDate and checkOut
      if (
        this.checkIn &&
        this.checkOut &&
        diffMonthBetweenStarDateAndCheckOut > countOfMonth
      ) {
        // Create each month to nextMonthStartDate to checkOut date
        this.renderMultipleMonth(
          this.startDate,
          diffMonthBetweenStarDateAndCheckOut
        );
        const activeIndex = this.isDesktop ? 1 : this.countOfMobileMonth - 1;

        // Set the activeMonthIndex depend to device
        this.activeMonthIndex = Math.abs(
          diffMonthBetweenStarDateAndCheckOut - activeIndex
        );
      } else {
        // Create each month depending to countOfTotalMonthByDefault
        this.renderMultipleMonth(
          this.startDate,
          this.countOfTotalMonthByDefault - 1
        );
      }
    },
    numberToArr(count: number): number[] {
      const arr = [];

      for (let i = 0; i <= count - 1; i++) {
        arr.push(i);
      }

      // return [0, 1, 2...]
      return arr;
    },
    renderMultipleMonth(date: string, max: number) {
      let nextMonth = new Date(date);
      const dates = [];

      for (let countMonth = 0; countMonth < max; countMonth++) {
        const tempNextMonth = this.getNextMonth(nextMonth);

        dates.push(tempNextMonth);
        nextMonth = tempNextMonth;
      }

      this.createMultipleMonth(dates);
    },
    getMonthName(day: Date) {
      const currentMonth = this.i18n["month-names"][fecha.format(day, "M") - 1];
      const currentYear = this.showYear ? fecha.format(day, " YYYY") : "";

      return `${currentMonth} ${currentYear}`;
    },
    createMonth(date: Date) {
      const firstDayOfMonth = this.getFirstDayOfMonth(date);
      const firstDay = this.getFirstDay(date, this.firstDayOfWeek);
      const month = {
        monthName: this.getMonthName(firstDayOfMonth),
        days: [],
      } as Month;

      for (let i = 0; i < 42; i++) {
        const day = this.addDays(firstDay, i);

        month.days.push({
          date: day,
          belongsToThisMonth: day.getMonth() === date.getMonth(),
        });
      }

      this.months.push(month);
    },
    createMultipleMonth(dates: Date[]) {
      const months = [];

      for (let d = 0; d < dates.length; d++) {
        const currentDate = dates[d] as Date;
        const firstDayOfMonth = this.getFirstDayOfMonth(currentDate);
        const firstDay = this.getFirstDay(currentDate, this.firstDayOfWeek);
        const month = {
          monthName: this.getMonthName(firstDayOfMonth),
          days: [],
        } as Month;

        for (let i = 0; i < 42; i++) {
          const day = this.addDays(firstDay, i);

          month.days.push({
            date: day,
            belongsToThisMonth: day.getMonth() === currentDate.getMonth(),
          });
        }

        months.push(month);
      }

      this.months.push(...months);
    },
    handleBookingClicked(event: Event, date: Date, currentBooking: Booking) {
      this.$emit("booking-clicked", event, date, currentBooking);
    },
    escFunction(e: KeyboardEvent) {
      const escTouch = 27;

      if (e.keyCode === escTouch && this.isOpen && this.checkIn) {
        this.clearSelection();
      }
    },
    formatDate(date: Date): Date | string {
      return this.dateFormater(date, this.format);
    },
    cleanString(str: string): string {
      return str.replace(/\<br\/>/g, "");
    },
    dateIsInCheckInCheckOut(date: Date): Period | null {
      const compareDate = this.dateFormater(date);
      let currentPeriod = null;

      this.sortedPeriodDates.forEach((d: Period) => {
        if (
          d.endAt !== compareDate &&
          (d.startAt === compareDate ||
            this.validateDateBetweenTwoDates(d.startAt, d.endAt, compareDate))
        ) {
          currentPeriod = d;
        }
      });

      return currentPeriod;
    },
    dayIsDisabled(date: Date): boolean {
      if (
        this.checkIn &&
        !this.checkOut &&
        !this.isDateBefore(date, this.nextDisabledDate) &&
        this.nextDisabledDate !== Infinity
      ) {
        return true;
      }

      if (
        this.checkIn &&
        !this.checkOut &&
        this.isDateBefore(date, this.checkIn)
      ) {
        return true;
      }

      return false;
    },
    mouseEnterDay(day: Day) {
      if (day.belongsToThisMonth) {
        const formatDate = this.dateFormater(day.date) as string;
        const halfDays = Object.keys(this.checkIncheckOutHalfDay);
        const disableDays = this.disabledDates
          .filter((disableDate) => !halfDays.includes(disableDate))
          .includes(formatDate);

        if (!this.dayIsDisabled(day.date) && !disableDays && this.isDesktop) {
          this.setCustomTooltipOnHover(day);
        }
      }
    },
    setCustomTooltipOnHover(day: Day) {
      const { date } = day;
      this.hoveringDate = date;
      if (this.showCustomTooltip) this.showCustomTooltip = false;
      this.setCurrentPeriod(date, "hover");

      if (Object.keys(this.hoveringPeriod).length > 0) {
        // Create tooltip
        this.createTooltip(date);
      } else {
        this.hoveringPeriod = {};
      }
      if (this.halfDay) this.createHalfDayTooltip(day.date);
    },
    setCurrentPeriod(date: Date, eventType: string) {
      let currentPeriod = {} as HoveringPeriod;

      if (this.sortedPeriodDates.length > 0) {
        this.sortedPeriodDates.forEach((d) => {
          if (
            eventType === "click" &&
            (d.startAt === this.dateFormater(date) ||
              (d.endAt !== this.dateFormater(date) &&
                this.validateDateBetweenTwoDates(d.startAt, d.endAt, date)))
          ) {
            currentPeriod = d;
          } else if (
            eventType === "hover" &&
            (d.startAt === this.dateFormater(date) ||
              this.validateDateBetweenTwoDates(d.startAt, d.endAt, date))
          ) {
            currentPeriod = d;
          }
        });

        if (Object.keys(currentPeriod).length > 0) {
          this.hoveringPeriod = currentPeriod;
        } else if (this.minNightCount > 0 && this.checkIn) {
          this.hoveringPeriod = {
            periodType: "nightly",
            minimumDuration: this.minNightCount,
            startAt: this.checkIn,
            endAt: this.addDays(this.checkIn, this.minNightCount),
          };
        } else {
          this.hoveringPeriod = {
            periodType: "nightly",
            minimumDuration: this.minNightCount,
            startAt: this.checkIn,
            endAt: this.addDays(this.checkIn, this.minNightCount),
          };
        }
      } else if (this.minNightCount > 0) {
        this.hoveringPeriod = {
          periodType: "nightly",
          minimumDuration: this.minNightCount,
          startAt: this.checkIn,
          endAt: this.addDays(this.checkIn, this.minNightCount),
        };
      }
    },
    createTooltip(date) {
      if (this.hoveringPeriod.periodType === "weekly_by_saturday") {
        const dayCode = 6;
        const text = this.i18n.tooltip.saturdayToSaturday;
        this.createTooltipWeekly(date, dayCode, text);
      } else if (this.hoveringPeriod.periodType === "weekly_by_sunday") {
        const dayCode = 0;
        const text = this.i18n.tooltip.sundayToSunday;
        this.createTooltipWeekly(date, dayCode, text);
      } else if (this.hoveringPeriod.periodType === "nightly") {
        this.createTooltipNightly(date);
      } else {
        // Clean tooltip
        this.showCustomTooltip = false;
        this.customTooltip = "";
      }
    },
    handleDayClick(
      event: Event,
      date: Date,
      formatDate: string,
      resetCheckin: boolean
    ) {
      this.nextPeriodDisableDates = [];

      if (resetCheckin) {
        this.clearSelection();
        this.$nextTick(() => {
          this.handleDayClick(event, date, formatDate, false);
        });

        return;
      }

      let nextDisabledDate =
        (this.maxNights ? this.addDays(date, this.maxNights) : null) ||
        this.getNextDate(this.sortedDisabledDates, date) ||
        this.nextDateByDayOfWeekArray(this.disabledDaysOfWeek, date) ||
        this.nextBookingDate(date) ||
        (Infinity as Date | number | null);

      this.dynamicNightCounts = null;

      if (this.enableCheckout) {
        nextDisabledDate = Infinity;
      }

      if (this.checkIn == null && this.singleDaySelection === false) {
        this.checkIn = date;
        this.setMinimumDuration(date);
      } else if (this.singleDaySelection === true) {
        this.checkIn = date;
        this.checkOut = date;
      } else if (this.checkIn !== null && this.checkOut == null) {
        this.checkOut = date;
        this.$emit("period-selected", event, this.checkIn, this.checkOut);
      } else {
        this.checkOut = null;
        this.checkIn = date;
        this.setMinimumDuration(date);
      }

      if (this.checkIn && !this.checkOut) {
        this.setCurrentPeriod(date, "click");
        // Create tooltip + half day tooltip
        this.createTooltip(date);
        if (this.halfDay) this.createHalfDayTooltip(date);

        this.checkInPeriod = this.hoveringPeriod;
      }

      this.nextDisabledDate = nextDisabledDate;
      this.$emit("day-clicked", date, formatDate, nextDisabledDate);
    },
    nextBookingDate(date: Date) {
      let closest = Infinity as string | number;

      if (this.sortBookings.length > 0) {
        const nextDateFormated = this.dateFormater(this.addDays(date, 1));
        const nextBooking = this.sortBookings.find(
          (booking) =>
            this.validateDateBetweenDate(
              booking.checkInDate,
              nextDateFormated
            ) ||
            this.validateDateBetweenTwoDates(
              booking.checkInDate,
              booking.checkOutDate,
              nextDateFormated
            )
        );

        closest = nextBooking ? nextBooking.checkInDate : Infinity;
      }

      return closest;
    },
    createTooltipWeekly(date: Date, dayCode: number, text: string) {
      const countDaysBetweenCheckInCurrentDay = this.countDays(
        this.checkIn,
        date
      );
      const notOnPeriodDayType = date.getDay() !== dayCode;
      const isCheckInCheckOut = this.checkIn && this.checkOut;
      const notCheckInNotPeriodDayType = !this.checkIn && notOnPeriodDayType;
      const isCheckInNotCheckOut = this.checkIn && !this.checkOut;
      const isNotBetweenCheckInAndCheckOut = !this.validateDateBetweenTwoDates(
        this.checkIn,
        this.checkOut,
        date
      );
      const notAllowDaysBetweenCheckInAndNextValidDate =
        this.hoveringPeriod.nextValidDate &&
        this.validateDateBetweenTwoDates(
          this.checkIn,
          this.hoveringPeriod.nextValidDate,
          this.hoveringDate
        ) &&
        this.dateFormater(this.checkIn) !==
          this.dateFormater(this.hoveringDate) &&
        this.dateFormater(this.hoveringPeriod.nextValidDate) !==
          this.dateFormater(this.hoveringDate);
      const hasHalfDayOnWeeklyPeriod =
        Object.keys(this.checkIncheckOutHalfDay).length > 0 &&
        this.checkIncheckOutHalfDay[this.dateFormater(date)] &&
        this.checkIncheckOutHalfDay[this.dateFormater(date)].checkIn;

      // Show tooltip on not-allowed day
      if (notCheckInNotPeriodDayType) {
        this.showCustomTooltip = true;
        this.customTooltip = text;
      } else {
        this.showCustomTooltip = false;
        this.customTooltip = "";
      }

      // Show tooltip when CheckIn
      if (isCheckInNotCheckOut) {
        const nextDayValid = this.addDays(this.checkIn, this.minNightCount);
        const isDateAfterMinimumDuration =
          this.getDayDiff(date, nextDayValid) <= 0;

        if (isDateAfterMinimumDuration && notOnPeriodDayType) {
          this.showCustomTooltip = true;
          this.customTooltip = text;
        } else if (
          notOnPeriodDayType ||
          notAllowDaysBetweenCheckInAndNextValidDate
        ) {
          if (
            this.checkInPeriod &&
            this.checkInPeriod.periodType === "nightly"
          ) {
            this.showCustomTooltip = false;
            this.customTooltip = "";
          } else {
            // Show default message on currentDay
            const night = this.pluralize(this.minNightCount, "week");

            this.showCustomTooltip = true;
            this.customTooltip = this.completeTrad(
              this.i18n.tooltip.minimumRequiredPeriod,
              { minNightInPeriod: this.minNightCount / 7, night }
            );
          }
        } else if (hasHalfDayOnWeeklyPeriod) {
          // Show the correct wording in comparison to periodType of this.checkInPeriod equal to "nightly" / "weekly"
          if (this.checkInPeriod.periodType !== "nightly") {
            this.customTooltip = `${
              countDaysBetweenCheckInCurrentDay / 7
            } ${this.pluralize(this.minNightCount, "week")}`;
          } else if (this.checkInPeriod.periodType === "nightly") {
            this.customTooltip = `${countDaysBetweenCheckInCurrentDay} ${
              countDaysBetweenCheckInCurrentDay !== 1
                ? this.i18n.nights
                : this.i18n.night
            }`;
          }
        } else {
          // Clean tooltip
          this.showCustomTooltip = false;
          this.customTooltip = "";
        }
        // Show tooltip when CheckIn & CheckOut on all the days that are not between checkIn and CheckOut
      } else if (
        isCheckInCheckOut &&
        notOnPeriodDayType &&
        isNotBetweenCheckInAndCheckOut
      ) {
        this.showCustomTooltip = true;
        this.customTooltip = text;
      }
    },
    createTooltipNightly(date: Date) {
      if (this.checkIn && !this.checkOut) {
        const nextDayValid = this.addDays(this.checkIn, this.minNightCount);
        const isDateAfterMinimumDuration =
          this.getDayDiff(date, nextDayValid) <= 0;
        const countOfDays = this.countDays(this.checkIn, date);
        const night = this.pluralize(Math.max(this.minNightCount, countOfDays));

        if (!isDateAfterMinimumDuration) {
          const minNightInPeriod = this.hoveringPeriod.minimumDuration;

          this.showCustomTooltip = true;
          this.customTooltip = this.completeTrad(
            this.i18n.tooltip.minimumRequiredPeriod,
            { minNightInPeriod, night }
          );
        } else {
          this.customTooltip = `${countOfDays} ${night}`;
        }
      } else {
        this.customTooltip = "";
      }
    },
    createHalfDayTooltip(date: Date) {
      this.customTooltipHalfday = "";
      const formatedHoveringDate = this.dateFormater(date);

      if (this.checkIncheckOutHalfDay[formatedHoveringDate]) {
        this.showCustomTooltip = true;

        if (this.checkIncheckOutHalfDay[formatedHoveringDate].checkIn) {
          this.customTooltipHalfday = this.i18n.tooltip.halfDayCheckOut;
        } else if (this.checkIncheckOutHalfDay[formatedHoveringDate].checkOut) {
          this.customTooltipHalfday = this.i18n.tooltip.halfDayCheckIn;
        }
      }
    },
    completeTrad(translation: any, keys: any) {
      let newT = translation;
      const keysTranslations = Object.keys(keys);

      keysTranslations.forEach((key) => {
        newT = newT.replace(`%{${key}}`, keys[key]);
      });

      return newT;
    },
    handleClickOutside(event: Event) {
      const ignoredElement = this.$refs[
        `DatePicker-${this.hash}`
      ] as HTMLElement;
      const ignoredOutsideElement =
        document.getElementById(this.clickOutsideElementId) || false;

      if (ignoredElement) {
        const target = event.target as HTMLInputElement;
        const isIgnoredElementClicked = ignoredElement.contains(target);
        let isIgnoredOutsideElementClicked = false;

        if (ignoredOutsideElement) {
          isIgnoredOutsideElementClicked = ignoredOutsideElement.contains(
            target
          );
        }

        if (!isIgnoredElementClicked && !isIgnoredOutsideElementClicked) {
          this.hideDatepicker();
        }
      }
    },
    handleWindowResize() {
      if (window.innerWidth >= 768) {
        this.screenSize = "desktop";
      } else {
        this.screenSize = "not-desktop";
      }

      return this.screenSize;
    },
    onElementHeightChange(el: HTMLElement, callback) {
      let lastHeight = el.clientHeight;
      let newHeight = lastHeight;
      const newEl = el;

      (function run() {
        newHeight = el.clientHeight;

        if (lastHeight !== newHeight) {
          callback();
        }

        lastHeight = newHeight;

        if (newEl.onElementHeightChangeTimer) {
          clearTimeout(el.onElementHeightChangeTimer);
        }

        newEl.onElementHeightChangeTimer = setTimeout(run, 1000);
      })();
    },
    emitHeighChangeEvent() {
      this.$emit("height-changed");
    },
    reRender() {
      this.datepickerDayKey += 1;
      this.datepickerMonthKey += 1;
    },
    clearSelection() {
      this.hoveringDate = null;
      this.checkIn = null;
      this.checkOut = null;
      this.nextDisabledDate = null;
      this.nextPeriodDisableDates = [];
      this.showCustomTooltip = false;
      this.hoveringPeriod = {};
      this.checkInPeriod = {};
      this.createHalfDayDates(this.baseHalfDayDates);
      this.reRender();
      this.$emit("clear-selection");
    },
    closeMobileDatepicker() {
      this.hideDatepicker();
    },
    hideDatepicker() {
      this.clearCheckIn();

      this.isOpen = false;
    },
    showDatepicker() {
      this.isOpen = true;
    },
    toggleDatepicker() {
      this.clearCheckIn();

      this.isOpen = !this.isOpen;
    },
    clearCheckIn() {
      if (this.checkIn && !this.checkOut) {
        this.clearSelection();
      }
    },
    clickOutside() {
      if (this.show && this.closeDatepickerOnClickOutside) {
        this.hideDatepicker();
      }
    },
    setMinimumDuration(date: Date) {
      if (this.sortedPeriodDates) {
        let nextPeriod = {} as Period;
        let currentPeriod = {} as Period;
        const compareDate = this.dateFormater(date);

        this.sortedPeriodDates.forEach((d) => {
          if (
            d.endAt !== compareDate &&
            (d.startAt === compareDate ||
              this.validateDateBetweenTwoDates(d.startAt, d.endAt, date))
          ) {
            currentPeriod = d;
          }
        });

        if (Object.keys(currentPeriod).length > 0) {
          this.sortedPeriodDates.forEach((period: Period) => {
            if (period.startAt === currentPeriod.endAt) {
              nextPeriod = period;
            }
          });

          if (this.checkIn && !this.checkOut && nextPeriod) {
            const endNextPeriod = this.addDays(
              nextPeriod.startAt,
              nextPeriod.minimumDuration - 1
            );
            const startNextPeriodPlusOne = this.addDays(nextPeriod.startAt, 1);
            const newDisablesDates = this.getDaysArray(
              startNextPeriodPlusOne,
              endNextPeriod
            );

            this.nextPeriodDisableDates = newDisablesDates;
          }

          if (
            currentPeriod.periodType === "nightly" &&
            currentPeriod.endAt !== date
          ) {
            this.dynamicNightCounts = currentPeriod.minimumDuration;
          }

          if (
            currentPeriod.periodType === "weekly_by_saturday" ||
            currentPeriod.periodType === "weekly_by_sunday"
          ) {
            const minimumDuration = currentPeriod.minimumDuration * 7;

            this.dynamicNightCounts = minimumDuration;
          }
        } else {
          this.dynamicNightCounts = 0;
        }
      }
    },
    renderPreviousMonth() {
      if (this.activeMonthIndex >= 1) {
        this.activeMonthIndex--;
      }
    },
    renderNextMonth() {
      this.$emit("render-next-month");

      const countOfDesktopMonth = this.isDesktop
        ? this.countOfDesktopMonth
        : this.countOfMobileMonth;

      if (this.activeMonthIndex < this.months.length - countOfDesktopMonth) {
        this.activeMonthIndex++;

        return;
      }

      let firstDayOfLastMonth = {} as FirstDayOfLastMonth;

      if (this.isMobile && !this.alwaysVisible) {
        firstDayOfLastMonth = this.months[this.months.length - 1].days.find(
          (day) => day.belongsToThisMonth === true
        ) as FirstDayOfLastMonth;
      } else {
        firstDayOfLastMonth = this.months[this.activeMonthIndex + 1].days.find(
          (day) => day.belongsToThisMonth === true
        ) as FirstDayOfLastMonth;
      }

      if (this.endDate !== Infinity) {
        if (
          fecha.format(firstDayOfLastMonth.date, "YYYYMM") ===
          fecha.format(new Date(this.endDate), "YYYYMM")
        ) {
          return;
        }
      }

      this.createMonth(this.getNextMonth(firstDayOfLastMonth.date));
      this.activeMonthIndex++;
    },
    setCheckIn(date: Date) {
      this.checkIn = date;
    },
    setCheckOut(date: Date) {
      this.checkOut = date;
    },
    createHalfDayDates(baseHalfDayDates: string[]) {
      // Copy of baseHalfDayDates
      let sortedDates = [] as Date[];
      const newBaseHalfDayDates = JSON.parse(JSON.stringify(baseHalfDayDates));
      const checkIncheckOutHalfDay = {} as CheckIncheckOutHalfDay;

      // Sorted disabledDates
      newBaseHalfDayDates.sort((a: string, b: string) => {
        const aa = a.split("/").reverse().join();
        const bb = b.split("/").reverse().join();

        // eslint-disable-next-line no-nested-ternary
        return aa < bb ? -1 : aa > bb ? 1 : 0;
      });

      if (this.sortBookings.length === 0) {
        for (let i = 0; i < newBaseHalfDayDates.length; i++) {
          const newDate = newBaseHalfDayDates[i];

          if (this.halfDay) {
            const newDateIncrementOne = newBaseHalfDayDates[i + 1];

            if (i === 0) {
              checkIncheckOutHalfDay[newDate] = {
                checkIn: true,
              };
            }

            if (
              !checkIncheckOutHalfDay[newDate] &&
              newBaseHalfDayDates[i + 1] &&
              this.getDayDiff(newDate, newDateIncrementOne) > 1
            ) {
              checkIncheckOutHalfDay[newDate] = {
                checkOut: true,
              };
              checkIncheckOutHalfDay[newDateIncrementOne] = {
                checkIn: true,
              };
            }

            if (i === newBaseHalfDayDates.length - 1) {
              checkIncheckOutHalfDay[
                newBaseHalfDayDates[newBaseHalfDayDates.length - 1]
              ] = {
                checkOut: true,
              };
            }
          }

          sortedDates[i] = newBaseHalfDayDates[i];
        }
      } else {
        this.sortBookings.forEach((booking) => {
          checkIncheckOutHalfDay[booking.checkInDate] = {
            checkIn: true,
          };
          checkIncheckOutHalfDay[booking.checkOutDate] = {
            checkOut: true,
          };
        });
      }

      if (this.halfDay) {
        const halfDays = Object.keys(checkIncheckOutHalfDay);

        sortedDates = sortedDates.filter(
          (date: any) => !halfDays.includes(date)
        );
      }

      sortedDates = sortedDates.map((date: any) => new Date(date));
      this.sortedDisabledDates = sortedDates.sort((a: Date, b: Date) => a - b);
      this.checkIncheckOutHalfDay = checkIncheckOutHalfDay;
      this.$emit(
        "handle-check-incheck-out-half-day",
        this.checkIncheckOutHalfDay
      );
    },
  },
});
</script>

<style>
/* NEW STYLE */
.datepicker__dummy-wrapper {
  @apply border border-solid border-gray-200 cursor-pointer flex flex-wrap items-center w-full h-full lg:h-[50px] transition-all;
  user-select:none;
  -moz-user-select:none;
  -webkit-user-select:none;
  -webkit-touch-callout:none;
}
.datepicker__dummy-wrapper--is-active {
  @apply border-gray-300;
}
.datepicker__header {
  @apply flex items-center justify-between;
}
.container-square {
  @apply grid grid-cols-7;
}
.square {
  @apply relative;
}
.datepicker__button-paginate--mobile {
  @apply w-full border-0 h-[50px] border-t border-gray-100 bg-white mt-8 relative;
}
.icon-arrow {
  @apply w-[50px] h-[50px];
}
.datepicker__button-paginate--mobile[disabled="disabled"] {
  @apply opacity-50;
}
.datepicker__button-paginate--mobile--top {
  @apply m-0 border-t-0 border-b border-gray-100;
}
.icon-arrow-left,
.icon-arrow-right {
  @apply w-5 h-5 stroke-current text-gray-800;
}
.datepicker__months {
  @apply w-full flex flex-wrap h-[calc(100%-90px)] overflow-y-scroll overflow-x-hidden lg:h-auto lg:overflow-y-hidden lg:grid lg:w-[650px] lg:grid-cols-2 lg:gap-4;
}
.wrap_datepicker__month {
  @apply w-full grid grid-cols-2 items-center -mx-10;
}
.datepicker__month-button {
  @apply w-10 h-10 bg-transparent relative z-10 shadow-none outline-none border border-solid border-gray-100 focus:outline-none cursor-pointer flex items-center justify-center hover:opacity-40 transition-opacity;
}
.datepicker__months--full {
  @apply w-full;
}
.datepicker__month {
  @apply box-border w-full;
}
.datepicker__month-day {
  @apply text-xs;
}
/* NEW STYLE */

.datepicker {
  transition: all 0.2s ease-in-out;
  background-color: #fff;
  font-size: 16px;
  line-height: 14px;
  overflow: hidden;
  top: 50px;
  position: absolute;
  z-index: 999;
}

.datepicker--right {
  right: 0;
}

.datepicker button.next--mobile {
  background: none;
  border: 1px solid #eaeaea;
  float: none;
  height: 50px;
  width: 100%;
  position: relative;
  background-position: 50%;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  overflow: hidden;
  position: fixed;
  bottom: 0;
  left: 0;
  outline: none;
  box-shadow: 0 5px 30px 10px rgba(0, 0, 0, 0.08);
  background: #fff;
}

.datepicker button.next--mobile:after {
  background: transparent url(img/ic-arrow-right-green.regular.83ed3b6c.svg)
    no-repeat 50%/8px;
  transform: rotate(90deg);
  content: "";
  position: absolute;
  width: 200%;
  height: 200%;
  top: -50%;
  left: -50%;
}

.datepicker--closed {
  box-shadow: 0 15px 30px 10px transparent;
  max-height: 0;
}

.datepicker--open {
  box-shadow: 0 15px 30px 10px rgba(0, 0, 0, 0.08);
  max-height: 900px;
}

@media screen and (max-width: 767px) {
  .datepicker--open {
    box-shadow: none;
    height: 100%;
    left: 0;
    right: 0;
    bottom: 0;
    -webkit-overflow-scrolling: touch !important;
    position: fixed;
    top: 0;
    width: 100%;
  }
}
.datepicker__wrapper {
  position: relative;
}

.datepicker__wrapper .square .datepicker__month-day {
  border: 1px solid #eaeaea;
  margin: -1px 0 0 -1px;
}

.datepicker__wrapper--booking .datepicker__month-day-wrapper span {
  text-align: right;
  padding-top: 10px;
  padding-right: 10px;
  right: 0;
  top: 0;
  transform: none;
}

.datepicker__wrapper--booking .datepicker__month-day:before {
  display: none;
}

.datepicker__fullview {
  background: none;
  height: auto;
}

.datepicker__fullview .datepicker {
  position: relative;
  top: 0;
}

.datepicker__fullview .square.not-in-the-month {
  height: 0;
  padding-bottom: 100%;
}

.datepicker__input {
  background: transparent;
  height: 48px;
  display: flex;
  align-items: center;
  font-size: 12px;
  outline: none;
  word-spacing: 5px;
  border: 0;
}

.datepicker__input--first {
  @apply pl-4;
}

.datepicker__input:focus {
  outline: none;
}

.datepicker__input:-moz-placeholder,
.datepicker__input:-ms-input-placeholder,
.datepicker__input::-moz-placeholder,
.datepicker__input::-webkit-input-placeholder {
  color: #35343d;
}

.datepicker__input {
  color: #35343d;
  font-size: 14px;
}

@media screen and (max-width: 479px) {
  .datepicker__input {
    text-align: center;
  }
}

.datepicker__input--is-active {
  color: #195252;
}

.datepicker__input--is-active::placeholder {
  color: #195252;
}

.datepicker__input--is-active::-moz-placeholder {
  color: #195252;
}

.datepicker__input--is-active:-ms-input-placeholder {
  color: #195252;
}

.datepicker__input--is-active:-moz-placeholder {
  color: #195252;
}

.datepicker__input--single-date:first-child {
  width: 100%;
  background: none;
  text-align: left;
}

.datepicker__month-day-wrapper {
  height: 0;
  padding-top: calc(100% - 1px);
}

.datepicker__month-day-wrapper span {
  z-index: 1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.datepicker__month-day {
  visibility: visible;
  text-align: center;
  color: #195252;
  cursor: pointer;
}

.datepicker__month-day:focus {
  outline: none;
}

.datepicker__month-day--today {
  border: 0;
}

.datepicker__month-day--today .datepicker__month-day-wrapper {
  border: 2px solid #195252;
  padding-top: calc(100% - 5px);
}

.datepicker__month-day--invalid-range {
  background-color: rgba(25, 82, 82, 0.3);
  color: #f3f5f8;
  cursor: not-allowed;
  position: relative;
}

.datepicker__month-day--invalid {
  cursor: not-allowed;
  pointer-events: none;
}

.datepicker__month-day--allowed-checkout:hover,
.datepicker__month-day--valid:hover {
  background-color: #195252;
  color: #fff;
}

.datepicker__month-day--disabled {
  opacity: 1;
  background: #f5f7f8;
  color: #d8d8d8;
  cursor: not-allowed;
  pointer-events: none;
  font-weight: 400;
  position: relative;
}

.datepicker__month-day--disabled span {
  text-decoration: line-through;
}

.datepicker__month-day--not-allowed.currentDay,
.datepicker__month-day--valid.datepicker__month-day--not-allowed,
.datepicker__month-day--valid.datepicker__month-day--not-allowed:hover {
  color: #195252;
  font-weight: 400;
  cursor: default;
  background: transparent;
}

.datepicker__month-day--not-allowed.currentDay span,
.datepicker__month-day--valid.datepicker__month-day--not-allowed:hover span,
.datepicker__month-day--valid.datepicker__month-day--not-allowed span {
  text-decoration: none;
}

.datepicker__month-day--hovering.datepicker__month-day--not-allowed:hover {
  cursor: pointer;
}

.datepicker__month-day--halfCheckIn,
.datepicker__month-day--halfCheckOut {
  position: relative;
  overflow: hidden;
}

.datepicker__month-day--halfCheckIn:before,
.datepicker__month-day--halfCheckOut:before {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  content: "";
  z-index: -1;
  height: 0;
  width: 0;
  border-bottom: 120px solid #f5f7f8;
  border-left: 120px solid transparent;
}

.datepicker__month-day--halfCheckOut:before {
  border-top: 120px solid #f5f7f8;
  border-bottom: 0;
  border-left: 0;
  border-right: 120px solid transparent;
}

.datepicker__month-day--selected {
  background-color: rgba(25, 82, 82, 0.7);
  color: #fff;
}

.datepicker__month-day--selected span {
  text-decoration: none;
}

.datepicker__month-day--selected:hover {
  font-weight: 700;
  background-color: #195252;
  color: #fff;
  z-index: 1;
}

.datepicker__month-day--hovering {
  background-color: rgba(25, 82, 82, 0.7);
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}

.datepicker__month-day--hovering span {
  text-decoration: none;
}

.datepicker__month-day--first-day-selected,
.datepicker__month-day--last-day-selected {
  background: #195252;
  color: #fff;
  cursor: pointer;
  font-weight: 700;
  pointer-events: auto;
}

.datepicker__month-day--first-day-selected span,
.datepicker__month-day--last-day-selected span {
  text-decoration: none;
}

.datepicker__month-day--allowed-checkout {
  color: #424b53;
}

.datepicker__month-day--out-of-range {
  color: #f3f5f8;
  cursor: not-allowed;
  font-weight: 400;
  position: relative;
  pointer-events: none;
}

.datepicker__month-day--out-of-range span {
  text-decoration: none;
}

.datepicker__month-day--valid {
  cursor: pointer;
  font-weight: 700;
}

.datepicker__month-day--valid.datepicker__month-day--halfCheckIn.datepicker__month-day--last-day-selected {
  color: #fff;
}

.datepicker__month-day--hidden {
  opacity: 0;
  pointer-events: none;
}

.datepicker__month-button[disabled] {
  opacity: 0.2;
  cursor: not-allowed;
  pointer-events: none;
}

.datepicker__inner {
  padding: 1.5rem 2.5rem;
}

@media screen and (max-width: 767px) {
  .datepicker__inner {
    padding: 0;
    height: 100%;
  }
}

.datepicker.show-tooltip .datepicker__months {
  height: calc(100% - 140px);
}

.datepicker.show-tooltip .datepicker__tooltip--mobile {
  height: auto;
  opacity: 1;
  padding: 15px;
  visibility: visible;
}

.datepicker__month-caption {
  height: 2.5em;
  vertical-align: middle;
}

.datepicker__month-name {
  font-size: 16px;
  font-weight: 700;
  pointer-events: none;
  text-align: center;
}

@media screen and (max-width: 767px) {
  .datepicker__month-name {
    padding: 0 0 3rem;
    margin: 0 auto;
    width: 100%;
  }
  .datepicker__month-name:last-of-type {
    padding: 2rem 0 2.5rem;
  }
}

.datepicker__week-days {
  height: 2em;
  vertical-align: middle;
}

.datepicker__week-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  align-items: center;
  margin: 2rem auto 1.5rem;
}

@media screen and (max-width: 767px) {
  .datepicker__week-row {
    height: 40px;
    align-items: center;
    margin: 0;
    border-bottom: 1px solid #f5f7f8;
  }
}

@media screen and (max-width: 767px) {
  .datepicker__week-row--always-visible {
    border: 0;
  }
}

.datepicker__week-name {
  font-size: 12px;
  font-weight: 400;
  color: #424b53;
  text-align: center;
}

.datepicker__close-button {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: transparent;
  border: 0;
  color: #195252;
  cursor: pointer;
  font-size: 21px;
  font-weight: 700;
  margin-top: 0;
  outline: 0;
  z-index: 10000;
  position: fixed;
  right: 15px;
  top: 0;
  height: 48px;
  line-height: 48px;
}

.datepicker__close-button i {
  display: block;
  font-style: inherit;
  transform: rotate(45deg);
}

.datepicker__clear-button {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: transparent;
  border: 0;
  cursor: pointer;
  font-size: 25px;
  font-weight: 700;
  height: 100%;
  margin: 0;
  padding: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: 40px;
}

.datepicker__clear-button svg {
  fill: none;
  stroke-linecap: round;
  stroke-width: 8px;
  stroke: #424b53;
  width: 20px;
  width: 14px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.datepicker__clear-button:focus {
  outline: none;
}

.datepicker__tooltip {
  background-color: #2d3047;
  border-radius: 2px;
  color: #fff;
  font-size: 11px;
  padding: 5px 10px;
  position: absolute;
  z-index: 50;
  left: 50%;
  bottom: 100%;
  white-space: nowrap;
  transform: translateX(-50%);
  text-align: center;
}

.datepicker__tooltip--mobile {
  height: 0;
  opacity: 0;
  visibility: hidden;
  padding: 0 1rem;
  border-bottom: 1px solid #d7d9e2;
  border-top: 1px solid #d7d9e2;
  font-size: 14px;
  line-height: 1.4;
  transition: all 0.2s ease;
}

.datepicker__tooltip:after {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #2d3047;
  bottom: -4px;
  content: "";
  left: 50%;
  margin-left: -4px;
  position: absolute;
}

.-is-hidden {
  display: none;
}

.parent-bullet {
  top: 50%;
  height: 100%;
  display: block;
  z-index: -1;
}

.parent-bullet,
.parent-bullet .bullet {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
}

.parent-bullet .bullet {
  top: 60%;
  height: 4px;
  transition: opacity 0.3s ease;
}

@media screen and (min-width: 768px) {
  .parent-bullet .bullet {
    top: 50%;
  }
}

.parent-bullet .bullet.checkIn,
.parent-bullet .bullet.checkInCheckOut,
.parent-bullet .bullet.checkOut {
  width: 8px;
  height: 18px;
  border-radius: 10px;
}

.parent-bullet .bullet.checkIn.bullet--small,
.parent-bullet .bullet.checkInCheckOut.bullet--small,
.parent-bullet .bullet.checkOut.bullet--small {
  height: 6px;
  width: 14px;
}

.parent-bullet .bullet.checkInCheckOut {
  left: calc(50% - 15px);
}

.parent-bullet .pipe {
  display: block;
  width: 100%;
  height: 4px;
  position: absolute;
  top: 60%;
  transform: translateY(-50%);
  transition: opacity 0.3s ease;
}

@media screen and (min-width: 768px) {
  .parent-bullet .pipe {
    top: 50%;
  }
}

.parent-bullet .pipe.pipe--small {
  height: 3px;
}

.parent-bullet .pipe.checkIn {
  left: calc(50% + 4px);
  width: calc(50% - 4px);
}

.parent-bullet .pipe.checkOut {
  left: 0;
  width: calc(50% - 4px);
}

.parent-bullet .pipe.checkInCheckOut {
  width: calc(50% - 19px);
}
</style>

<template>
  <div>
    <div
      class="datepicker__tooltip"
      v-html="tooltipMessageDisplay"
      v-if="showTooltip && options.hoveringTooltip"
    />
    <div
      @click.prevent.stop="dayClicked($event, date)"
      :class="[
        'datepicker__month-day',
        dayClass,
        checkinCheckoutClass,
        bookingClass,
        { 'datepicker__month-day--today': isToday },
      ]"
      :tabindex="tabIndex"
      ref="day"
    >
      <div class="datepicker__month-day-wrapper">
        <span>{{ dayNumber }}</span>
      </div>
    </div>

    <BookingBullet
      v-if="currentBooking && !isDisabled"
      :currentBooking="currentBooking"
      :duplicateBookingDates="duplicateBookingDates"
      :formatDate="formatDate"
      :previousBooking="previousBooking"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import fecha from "fecha";
import Helpers from "./helpers";
import BookingBullet from "./BookingBullet.vue";

interface CheckIncheckOut {
  checkIn: string;
  checkOut: string;
}
interface CheckIncheckOutHalfDay {
  string?: CheckIncheckOut;
}
interface Period {
  endAt: string;
  minimumDuration: number;
  nextValidDate: string;
  periodType: string;
  startAt: string;
  type: string;
}
interface I18nTooltip {
  halfDayCheckIn: string;
  halfDayCheckOut: string;
  minimumRequiredPeriod: string;
  saturdayToSaturday: string;
  sundayToSunday: string;
}
interface I18n {
  "check-in": string;
  "check-out": string;
  "day-names": string[];
  "month-names": string[];
  night: string;
  nights: string;
  tooltip: I18nTooltip;
  week: string;
  weeks: string;
}
interface Options {
  disabledDaysOfWeek: string[];
  enableCheckout: boolean;
  endDate: string;
  hoveringTooltip: boolean;
  startDate: string;
}
interface Style {
  string: [string];
}
interface Booking {
  id: string;
  checkInDate: string;
  checkOutDate: string;
  style: Style;
}

export default defineComponent({
  name: "Day",
  components: {
    BookingBullet,
  },
  props: {
    activeMonthIndex: {
      type: Number,
      default: 0,
    },
    bookings: {
      type: Array,
      default: (): Booking[] => [],
    },
    checkIn: {
      type: Date,
      default: new Date(),
    },
    checkIncheckOutHalfDay: {
      type: Object,
      default: (): CheckIncheckOutHalfDay => ({}),
    },
    checkInPeriod: {
      type: Object,
      default: (): Period => ({}),
    },
    checkOut: {
      type: Date,
      default: new Date(),
    },
    date: {
      type: Date,
      default: new Date(),
    },
    disableCheckoutOnCheckin: {
      type: Boolean,
      default: false,
    },
    duplicateBookingDates: {
      type: Array,
      default: (): Booking[] => [],
    },
    hoveringDate: {
      type: Date,
    },
    hoveringPeriod: {
      type: Object,
      default: (): Period => ({}),
    },
    hoveringTooltip: {
      default: true,
      type: Boolean,
    },
    i18n: {
      type: Object,
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
    isDesktop: {
      type: Boolean,
      required: false,
    },
    isOpen: {
      type: Boolean,
      required: true,
    },
    minNightCount: {
      type: Number,
      default: 0,
    },
    nextDisabledDate: {
      type: [Date, Number, String],
      default: new Date(),
    },
    nextPeriodDisableDates: {
      type: Array,
      default: (): string[] => [],
    },
    options: {
      type: Object,
      default: (): Options => ({
        disabledDaysOfWeek: [],
        enableCheckout: false,
        endDate: "",
        hoveringTooltip: true,
        startDate: "",
      }),
    },
    screenSize: {
      type: String,
      default: "",
    },
    showCustomTooltip: {
      default: false,
      type: Boolean,
    },
    sortedDisabledDates: {
      type: Array,
      default: (): string[] => [],
    },
    sortedPeriodDates: {
      type: Array,
      default: (): Period[] => [],
    },
    tooltipMessage: {
      default: null,
      type: String,
    },
  },
  data() {
    return {
      currentDate: new Date() as Date,
      isDisabled: false as boolean,
      isHighlighted: false as boolean,
    };
  },
  computed: {
    previousBooking(): Booking[] {
      let previousBooking = {} as Booking | undefined;

      if (
        this.currentBooking &&
        this.duplicateBookingDates.includes(this.currentBooking.checkInDate)
      ) {
        previousBooking = this.bookings.find(
          (booking: Booking | undefined) =>
            booking.checkOutDate === this.formatDate &&
            this.duplicateBookingDates.includes(booking.checkOutDate)
        );
      }

      return previousBooking;
    },
    currentBooking(): Booking | undefined {
      const asDuplicateBookingDates = this.duplicateBookingDates.includes(
        this.formatDate
      ) as boolean;

      return this.bookings.find(
        (booking: Booking | undefined) =>
          (asDuplicateBookingDates &&
            booking.checkInDate === this.formatDate) ||
          (!asDuplicateBookingDates &&
            this.validateDateBetweenTwoDates(
              booking.checkInDate,
              booking.checkOutDate,
              this.formatDate
            ))
      );
    },
    dayNumber(): string {
      return fecha.format(this.date, "D");
    },
    halfDayClass(): string | boolean {
      if (Object.keys(this.checkIncheckOutHalfDay).length > 0) {
        const keyDate = this.dateFormater(this.date);

        if (
          this.checkIncheckOutHalfDay[keyDate] &&
          this.checkIncheckOutHalfDay[keyDate].checkIn
        ) {
          if (this.checkIn && !this.checkOut) {
            return "datepicker__month-day--halfCheckIn datepicker__month-day--valid";
          }

          return "datepicker__month-day--halfCheckIn datepicker__month-day--invalid";
        }

        if (
          this.checkIncheckOutHalfDay[keyDate] &&
          this.checkIncheckOutHalfDay[keyDate].checkOut
        ) {
          return "datepicker__month-day--halfCheckOut datepicker__month-day--valid";
        }
      }

      return false;
    },
    bookingClass(): string {
      if (this.bookings.length > 0 && this.currentBooking) {
        if (
          !this.isDisabled &&
          this.validateDateBetweenTwoDates(
            this.currentBooking.checkInDate,
            this.currentBooking.checkOutDate,
            this.hoveringDate
          )
        ) {
          if (this.checkIncheckOutHalfDay[this.formatDate]) {
            if (this.checkIn && !this.checkOut) {
              return "datepicker__month-day--not-allowed datepicker__month-day--hovering";
            }

            if (this.checkIncheckOutHalfDay[this.formatDate].checkOut) {
              return "datepicker__month-day--not-allowed datepicker__month-day--hovering";
            }

            return "datepicker__month-day--not-allowed datepicker__month-day--invalid";
          }

          if (this.checkIn && !this.checkOut) {
            return "datepicker__month-day--not-allowed datepicker__month-day--invalid";
          }

          return "datepicker__month-day--not-allowed datepicker__month-day--hovering";
        }

        if (
          this.checkIncheckOutHalfDay[this.formatDate] &&
          this.checkIncheckOutHalfDay[this.formatDate].checkOut &&
          !this.duplicateBookingDates.includes(this.formatDate)
        ) {
          if (!this.checkIn) {
            return "datepicker__month-day--not-allowed datepicker__month-day--hovering";
          }

          if (
            (this.checkIn && this.checkIn === this.date) ||
            (this.checkIn && this.checkOut)
          ) {
            return "datepicker__month-day--not-allowed datepicker__month-day--hovering";
          }
        }

        if (this.checkIn && !this.checkOut && this.hoveringDate === this.date) {
          return "datepicker__month-day--not-allowed datepicker__month-day--hovering";
        }

        return "datepicker__month-day--not-allowed datepicker__month-day--invalid";
      }

      return "";
    },
    dayClass(): string {
      // If the calendar has a minimum number of nights && !checkOut
      const nextValidDate = this.addDays(this.checkIn, this.minNightCount);
      const isDateAfterMinimumDuration =
        this.getDayDiff(this.hoveringDate, nextValidDate) <= 0;

      if (
        !isDateAfterMinimumDuration &&
        !this.checkOut &&
        !this.isDisabled &&
        this.compareDay(this.date, this.checkIn) === 1 &&
        this.minNightCount > 0 &&
        this.compareDay(
          this.date,
          this.addDays(this.checkIn, this.minNightCount)
        ) === -1
      ) {
        return "datepicker__month-day--valid datepicker__month-day--disabled datepicker__month-day--not-allowed minimumDurationUnvalidDay";
      }

      // Current Day
      if (
        !this.isDisabled &&
        this.date === this.hoveringDate &&
        this.checkIn !== null &&
        this.checkOut == null
      ) {
        return "datepicker__month-day--selected datepicker__month-day--hovering currentDay";
      }

      // Highlight the selected dates and prevent the user from selecting
      // the same date for checkout and checkin
      if (
        this.checkIn !== null &&
        this.dateFormater(this.checkIn) === this.dateFormater(this.date)
      ) {
        if (this.minNightCount === 0) {
          return "datepicker__month-day--first-day-selected checkIn";
        }

        // Good
        return "datepicker__month-day--disabled datepicker__month-day--first-day-selected checkIn";
      }

      // Checkout day
      if (this.checkOut !== null) {
        if (this.dateFormater(this.checkOut) === this.dateFormater(this.date)) {
          if (this.halfDayClass) {
            return `datepicker__month-day--disabled datepicker__month-day--last-day-selected ${this.halfDayClass} checkOut`;
          }

          return "datepicker__month-day--disabled datepicker__month-day--last-day-selected checkOut";
        }
      }

      // Only highlight dates that are not disabled
      if (this.isHighlighted && !this.isDisabled) {
        if (
          this.options.disabledDaysOfWeek.some(
            (i: string) => i === fecha.format(this.date, "dddd")
          )
        ) {
          return "datepicker__month-day--selected datepicker__month-day--disabled afterMinimumDurationValidDay";
        }

        if (
          Object.keys(this.checkInPeriod).length > 0 &&
          this.checkInPeriod.periodType.includes("weekly") &&
          this.hoveringDate &&
          ((this.checkInPeriod.periodType === "weekly_by_saturday" &&
            this.hoveringDate.getDay() === 6) ||
            (this.checkInPeriod.periodType === "weekly_by_sunday" &&
              this.hoveringDate.getDay() === 0)) &&
          this.isDateBefore(this.date, this.hoveringDate)
        ) {
          // If currentPeriod has a minimumDuration 1
          if (this.checkInPeriod.minimumDuration === 1) {
            return "datepicker__month-day--selected afterMinimumDurationValidDay";
          }

          // If currentPeriod has a minimumDuration superior to 1
          if (
            this.getDayDiff(
              this.hoveringDate,
              this.checkInPeriod.nextValidDate
            ) <= 0
          ) {
            return "datepicker__month-day--selected afterMinimumDurationValidDay";
          }
        } else if (
          Object.keys(this.checkInPeriod).length > 0 &&
          this.checkInPeriod.periodType === "nightly" &&
          this.hoveringDate &&
          this.hoveringPeriod.periodType.includes("weekly") &&
          ((this.hoveringPeriod.periodType === "weekly_by_saturday" &&
            this.hoveringDate.getDay() === 6) ||
            (this.hoveringPeriod.periodType === "weekly_by_sunday" &&
              this.hoveringDate.getDay() === 0 &&
              this.isDateBefore(this.date, this.hoveringDate)))
        ) {
          return "datepicker__month-day--selected afterMinimumDurationValidDay";
        }

        if (
          this.hoveringPeriod.periodType === "nightly" &&
          this.isDateBefore(this.date, this.hoveringDate)
        ) {
          return "datepicker__month-day--selected afterMinimumDurationValidDay";
        }

        if (this.checkIn && this.checkOut) {
          return "datepicker__month-day--selected";
        }
      }

      // Good
      if (
        this.isDisabled ||
        this.options.disabledDaysOfWeek.some(
          (i: string) => i === fecha.format(this.date, "dddd")
        )
      ) {
        return "datepicker__month-day--disabled";
      }

      if (this.halfDayClass) {
        return `${this.halfDayClass}`;
      }

      return "datepicker__month-day--valid";
    },
    checkinCheckoutClass(): string {
      let currentPeriod = {} as Period;

      this.sortedPeriodDates.forEach((date) => {
        const d = date as Period;
        if (
          d.endAt !== this.formatDate &&
          (d.startAt === this.formatDate ||
            this.validateDateBetweenTwoDates(
              d.startAt,
              d.endAt,
              this.formatDate
            ))
        ) {
          currentPeriod = d;
        }
      });

      if (
        this.nextPeriodDisableDates
          ? this.nextPeriodDisableDates.some(
              (i) => this.compareDay(i, this.date) === 0
            )
          : null
      ) {
        return "datepicker__month-day--disabled datepicker__month-day--not-allowed nightly";
      }

      if (currentPeriod) {
        if (currentPeriod.periodType === "nightly" && !this.isDisabled) {
          if (
            ((!this.checkIn && !this.checkOut) ||
              (this.checkIn && this.checkOut)) &&
            this.notAllowedDayDueToNextPeriod(currentPeriod)
          ) {
            return "datepicker__month-day--disabled datepicker__month-day--not-allowed nightly";
          }

          return "nightly";
        }

        // date.getDay() === 6 => saturday
        if (
          currentPeriod.periodType === "weekly_by_saturday" &&
          currentPeriod.startAt !== this.formatDate &&
          currentPeriod.endAt !== this.formatDate &&
          this.date.getDay() !== 6
        ) {
          return "datepicker__month-day--disabled datepicker__month-day--not-allowed weekly_by_saturday";
        }

        // Disable date between checkIn and nextDate, if minimumDuration is superior to 1
        if (this.notAllowDaysBetweenCheckInAndNextValidDate(6)) {
          return "datepicker__month-day--disabled datepicker__month-day--not-allowed weekly_by_saturday";
        }

        // date.getDay() === 0 => sunday
        if (
          currentPeriod.periodType === "weekly_by_sunday" &&
          currentPeriod.startAt !== this.formatDate &&
          currentPeriod.endAt !== this.formatDate &&
          this.date.getDay() !== 0
        ) {
          return "datepicker__month-day--disabled datepicker__month-day--not-allowed weekly_by_sunday";
        }

        // Disable date between checkIn and nextDate, if minimumDuration is superior to 1
        if (this.notAllowDaysBetweenCheckInAndNextValidDate(0)) {
          return "datepicker__month-day--disabled datepicker__month-day--not-allowed weekly_by_sunday";
        }

        return "";
      }

      return "";
    },
    formatDate(): string {
      return this.dateFormater(this.date);
    },
    tabIndex(): number {
      if (!this.isOpen || this.isDisabled || !this.isClickable()) {
        return -1;
      }

      return 0;
    },
    nightsCount(): number {
      return this.countDays(this.checkIn, this.hoveringDate);
    },
    tooltipMessageDisplay(): string {
      const dateIsInPeriod = this.validateDateBetweenTwoDates(
        this.hoveringPeriod.startAt,
        this.hoveringPeriod.endAt,
        this.date
      );
      const checkInIsInPeriod = this.validateDateBetweenTwoDates(
        this.hoveringPeriod.startAt,
        this.hoveringPeriod.endAt,
        this.checkIn
      );

      if (this.tooltipMessage) {
        return this.tooltipMessage;
      }
      if (
        this.hoveringPeriod &&
        this.hoveringPeriod.type !== "nightly" &&
        dateIsInPeriod &&
        checkInIsInPeriod &&
        this.nightsCount >= 7
      ) {
        return `${this.nightsCount / 7} ${this.pluralize(
          this.nightsCount,
          "week"
        )}`;
      }

      if (this.nightsCount >= 1) {
        return `${this.nightsCount} ${
          this.nightsCount !== 1 ? this.i18n.nights : this.i18n.night
        }`;
      }

      return "";
    },
    showTooltip(): boolean {
      if (this.screenSize === "desktop" || this.screenSize === "tablet") {
        const showCustomTooltip =
          this.showCustomTooltip && this.date === this.hoveringDate;
        const showDefaultTooltip =
          !this.isDisabled &&
          this.date === this.hoveringDate &&
          this.tooltipMessageDisplay.length > 0 &&
          this.checkIn !== null &&
          this.checkOut === null;

        return showCustomTooltip || showDefaultTooltip;
      }

      return false;
    },
    isToday(): boolean {
      return this.compareDay(this.currentDate, this.date) === 0;
    },
  },
  watch: {
    hoveringDate() {
      if (
        this.checkIn !== null &&
        this.checkOut == null &&
        this.isDisabled === false
      ) {
        if (
          this.isDateBefore(this.checkIn, this.date) &&
          this.isDateBefore(this.date, this.hoveringDate)
        ) {
          this.isHighlighted = true;
        } else {
          this.isHighlighted = false;
        }
      }
    },
    activeMonthIndex() {
      this.checkIfDisabled();
      this.checkIfHighlighted();

      if (this.checkIn !== null && this.checkOut !== null) {
        if (
          this.isDateBefore(this.checkIn, this.date) &&
          this.isDateBefore(this.date, this.checkOut)
        ) {
          this.isHighlighted = true;
        } else {
          this.isHighlighted = false;
        }
      } else if (this.checkIn !== null && this.checkOut === null) {
        this.disableNextDays();
      }
    },
    nextDisabledDate() {
      this.disableNextDays();
    },
  },
  beforeMount() {
    this.checkIfDisabled();
    this.checkIfHighlighted();
  },
  methods: {
    ...Helpers,
    notAllowDaysBetweenCheckInAndNextValidDate(dayCode: number) {
      return (
        this.checkIn &&
        !this.checkOut &&
        this.date.getDay() === dayCode &&
        Object.keys(this.hoveringPeriod).length > 0 &&
        this.validateDateBetweenTwoDates(
          this.checkIn,
          this.hoveringPeriod.nextValidDate,
          this.date
        ) &&
        this.dateFormater(this.checkIn) !== this.formatDate &&
        this.dateFormater(this.hoveringPeriod.nextValidDate) !== this.formatDate
      );
    },
    notAllowedDayDueToNextPeriod(currentPeriod: Period) {
      // Check if the next period is directly after the current period
      const date = new Date(currentPeriod.endAt);
      let nextPeriod = {} as Period;

      this.sortedPeriodDates.forEach((period) => {
        const p = period as Period;
        const dateA = new Date(p.startAt).setHours(0, 0, 0, 0);
        const dateB = new Date(date).setHours(0, 0, 0, 0);

        if (dateA === dateB) {
          nextPeriod = p;
        }
      });

      if (nextPeriod) {
        // Subtract the startAt nextPeriod to the currentPeriod minimumDuration
        const subtractTimestamp = new Date(nextPeriod.startAt).setHours(
          0,
          0,
          0,
          0
        );
        const subtractDate = new Date(subtractTimestamp);
        const resultDate = new Date(
          subtractDate.setDate(
            subtractDate.getDate() - currentPeriod.minimumDuration
          )
        );

        if (
          !this.validateDateBetweenTwoDates(
            currentPeriod.startAt,
            resultDate,
            this.date
          )
        ) {
          return true;
        }
      }

      return false;
    },
    isClickable(): boolean {
      if (this.$refs && this.$refs.day) {
        return getComputedStyle(this.$refs.day).pointerEvents !== "none";
      }

      return true;
    },
    dayClicked(event: Event, date: Date) {
      let resetCheckin = false;
      let disableCheckoutOnCheckin = !this.disableCheckoutOnCheckin;

      if (
        !this.checkIncheckOutHalfDay[this.formatDate] &&
        this.currentBooking
      ) {
        this.$emit("bookingClicked", event, date, this.currentBooking);

        return;
      }

      if (this.disableCheckoutOnCheckin) {
        if (this.checkIn && this.checkIn === date) {
          if (this.checkOut) {
            disableCheckoutOnCheckin = true;
            resetCheckin = true;
          } else {
            disableCheckoutOnCheckin = false;
            this.$emit("clearSelection");
          }
        } else {
          disableCheckoutOnCheckin = true;
        }
      }

      if (disableCheckoutOnCheckin) {
        if (!this.isDisabled || this.isClickable()) {
          const formatDate = this.dateFormater(date);

          this.$emit("dayClicked", event, date, formatDate, resetCheckin);
        } else {
          this.$emit("clearSelection");
          this.dayClicked(event, date);
        }
      }
    },
    compareEndDay(): boolean {
      if (this.options.endDate !== Infinity) {
        return this.compareDay(this.date, this.options.endDate) === 1;
      }

      return false;
    },
    checkIfDisabled() {
      this.isDisabled =
        // If this day is equal any of the disabled dates
        (this.sortedDisabledDates
          ? this.sortedDisabledDates.some(
              (i) => this.compareDay(i, this.date) === 0
            )
          : null) ||
        // Or is before the start date
        this.compareDay(this.date, this.options.startDate) === -1 ||
        // Or is after the end date
        this.compareEndDay() ||
        // Or is in one of the disabled days of the week
        this.options.disabledDaysOfWeek.some(
          (i: string) => i === fecha.format(this.date, "dddd")
        );

      // Handle checkout enabled
      if (this.options.enableCheckout) {
        if (
          this.compareDay(this.date, this.checkIn) === 1 &&
          this.compareDay(this.date, this.checkOut) === -1
        ) {
          this.isDisabled = false;
        }
      }
    },
    checkIfHighlighted() {
      if (
        this.checkIn !== null &&
        this.checkOut !== null &&
        this.isDisabled === false
      ) {
        if (
          this.isDateBefore(this.checkIn, this.date) &&
          this.isDateBefore(this.date, this.checkOut)
        ) {
          this.isHighlighted = true;
        } else {
          this.isHighlighted = false;
        }
      }
    },
    disableNextDays() {
      if (
        !this.isDateBefore(this.date, this.nextDisabledDate) &&
        this.nextDisabledDate !== Infinity
      ) {
        this.isDisabled = true;
      } else if (this.isDateBefore(this.date, this.checkIn)) {
        this.isDisabled = true;
      }

      if (
        this.compareDay(this.date, this.checkIn) === 0 &&
        this.minNightCount === 0
      ) {
        this.isDisabled = false;
      }

      if (
        this.isDateBefore(this.checkIn, this.date) &&
        this.options.enableCheckout
      ) {
        this.isDisabled = false;
      }
    },
  },
});
</script>

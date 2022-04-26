<script lang="ts">
export default {
  name: "VueCalendar",
};
</script>

<script setup lang="ts">
import { computed, ref, onBeforeMount, onUnmounted } from "vue";
import type { ComputedRef, PropType, Ref } from "vue";

import { format } from "fecha";

import BaseIcon from "./BaseIcon.vue";
import CalendarDays from "./CalendarDays.vue";
import CalendarHeader from "./CalendarHeader.vue";
import CalendarInput from "./CalendarInput.vue";

import {
  addDays,
  getDatesBetweenTwoDates,
  getMonthDiff,
  isDateAfter,
  isDateBefore,
  validateDateBetweenTwoDates,
} from "./helpers";

import {
  useBookingStyle,
  useCheckIncheckOutHalfDay,
  useCreateHalfDayDates,
  useCreateMonth,
  useCreateMultipleMonths,
  useFlatBooking,
  useGetNextBookingDate,
  useGetPeriod,
  useToggleCalendar,
} from "./compose";

import type {
  Booking,
  BookingColor,
  CurrentPeriod,
  Day,
  FlatBooking,
  Month,
  Period,
  Placeholder,
} from "~/types";

const props = defineProps({
  bookingColor: {
    type: Object as PropType<BookingColor>,
    default: () => ({}),
  },
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
    default: null,
  },
  checkOut: {
    type: Date,
    default: null,
  },
  disabledDaysBeforeDayDate: {
    type: Boolean,
    default: true,
  },
  startDate: {
    type: Date,
    default: new Date(new Date().getFullYear() - 2, 0, 1),
  },
  endDate: {
    type: Date,
    default: new Date(new Date().getFullYear() + 2, 0, 1),
  },
  formatDate: {
    type: String,
    default: "YYYY-MM-DD",
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
  showYear: {
    type: Boolean,
    default: false,
  },
  showInputCalendar: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits([
  "update:checkIn",
  "update:checkOut",
  "select-booking-date",
  "renderPreviousMonth",
  "renderNextMonth",
]);

const formattingFormat = ref("YYYY-MM-DD");
const today = ref(new Date());
const months = ref([]) as Ref<Month[]>;

const createStartActiveIndex = () => {
  if (props.showYear) {
    return getMonthDiff(props.startDate, new Date()) - new Date().getMonth();
  }

  return getMonthDiff(props.startDate, new Date()) - 1;
};

const activeIndex = ref(createStartActiveIndex());

// Current month of the current day
months.value.push(useCreateMonth(props.startDate));

// Next 12 month after the current day
const countOfMonth = getMonthDiff(props.startDate, props.endDate) + 11;
const multipleMonths = useCreateMultipleMonths(props.startDate, countOfMonth);
months.value.push(...multipleMonths);

const {
  addClickOusideListener,
  calendarRef,
  openCalendar,
  removeClickOusideListener,
  showCalendar,
} = useToggleCalendar(props);

onBeforeMount(() => {
  if (!props.showYear) addClickOusideListener();
});

onUnmounted(() => {
  if (!props.showYear) removeClickOusideListener();
});

// Create array of disabledDates for each types of period
const saturdayWeeklyPeriods = computed(() => {
  return useGetPeriod(props.periodDates, "weekly_by_saturday", formattingFormat.value);
});
const sundayWeeklyPeriods = computed(() => {
  return useGetPeriod(props.periodDates, "weekly_by_sunday", formattingFormat.value);
});
const nightlyPeriods = computed(() => {
  return useGetPeriod(props.periodDates, "nightly", formattingFormat.value);
});

const bookingDatesT = (props.bookingDates as unknown) as Booking[];
const bookedDatesT = (props.bookedDates as unknown) as string[];
const bookingColorT = (props.bookingColor as unknown) as BookingColor;

let { disabledDates, newBookingDates } = useCreateHalfDayDates(
  bookingDatesT,
  bookedDatesT,
  bookingColorT,
  formattingFormat
);
const bookingStyle = useBookingStyle(bookingDatesT, bookingColorT, formattingFormat);
const flatBookingDates = useFlatBooking(bookingDatesT, bookingColorT, formattingFormat);
const checkIncheckOutHalfDay = useCheckIncheckOutHalfDay(bookingDatesT, bookedDatesT);

// Add style on days
months.value.forEach((m) => {
  m.days.forEach((day: Day) => {
    day.style = {
      background: !checkIncheckOutHalfDay.value[day.formatDay]
        ? bookingStyle.value[day.formatDay]
        : "",
    };
  });
});

const currentYear: ComputedRef<number> = computed(() => {
  return months.value[activeIndex.value].yearKey;
});

const disabledPagination: ComputedRef<{ left: boolean; right: boolean }> = computed(
  () => {
    const diff = props.showYear ? 12 : 2;

    return {
      left: activeIndex.value <= 0,
      right: activeIndex.value >= months.value.length - diff,
    };
  }
);

const paginate = (operator: string) => {
  const count = props.showYear ? 12 : 1;

  if (operator === "-") {
    activeIndex.value -= count;
    emit("renderPreviousMonth");
  }
  if (operator === "+") {
    activeIndex.value += count;
    emit("renderNextMonth");
  }

  if (operator === "+" || props.showYear) {
    const res = useCreateHalfDayDates(
      bookingDatesT,
      bookedDatesT,
      bookingColorT,
      formattingFormat
    );

    disabledDates = res.disabledDates;
    newBookingDates = res.newBookingDates;
  }
};

// Old data
const currentPeriod: Ref<CurrentPeriod | null> = ref(null);
const hoveringDates: Ref<string[]> = ref([]);
const hoveringDay: Ref<Date | null> = ref(new Date());
const hoveringPeriod: Ref<CurrentPeriod> | null = ref(null);
const nextDisableBookingDate: Ref<Date | null> = ref(null);

// Old computed
const tooltipText: ComputedRef<string> = computed(() => {
  if (hoveringPeriod.value) {
    const { periodType } = hoveringPeriod.value;
    const { minimumDuration } = hoveringPeriod.value;

    if (periodType === "weekly_by_saturday") {
      return "Du samedi au samedi<br/> uniquement";
    }
    if (periodType === "weekly_by_sunday") {
      return "Du dimanche au dimanche<br/> uniquement";
    }
    if (periodType === "nightly") {
      return `Un minimum de ${minimumDuration}<br/> nuit est requis.`;
    }
  }

  return "";
});

const slicedMonths: ComputedRef<Month[]> = computed(() => {
  const count = props.showYear ? 12 : 2;

  return months.value.slice(activeIndex.value, count + activeIndex.value);
});

const formatToday: ComputedRef<string> = computed(() => {
  return format(today.value, formattingFormat.value);
});

// Methods
const dayFormat = (date: Date): string => {
  return format(date, props.formatDate);
};

// Trigger each time the mouseOver is triggered
const inWeeklyPeriods = (day: Day) => {
  return (
    (saturdayWeeklyPeriods.value.includes(day.formatDay) && day.date.getDay() !== 6) ||
    (sundayWeeklyPeriods.value.includes(day.formatDay) && day.date.getDay() !== 0)
  );
};

const inWeeklyPeriodsCheckin = (day: Day) => {
  return (
    props.checkIn !== day.date &&
    currentPeriod.value?.nextEnableDate > day.date &&
    (currentPeriod.value?.periodType === "weekly_by_saturday" ||
      currentPeriod.value?.periodType === "weekly_by_sunday") &&
    (saturdayWeeklyPeriods.value.includes(day.formatDay) ||
      sundayWeeklyPeriods.value.includes(day.formatDay)) &&
    (day.date.getDay() === 6 || day.date.getDay() === 0)
  );
};

const inNightlyPeriod = (day: Day) => {
  return (
    props.checkIn !== day.date &&
    currentPeriod.value?.nextEnableDate > day.date &&
    currentPeriod.value?.periodType === "nightly" &&
    nightlyPeriods.value.includes(day.formatDay)
  );
};

const inDisabledDay = (day: Day) => {
  return (
    (props.disabledDaysBeforeDayDate &&
      day.formatDay !== formatToday.value &&
      today.value > day.date) ||
    isDateBefore(day.date, props.checkIn) ||
    (disabledDates.value.includes(day.formatDay) &&
      !checkIncheckOutHalfDay.value[day.formatDay]) ||
    (props.checkIn &&
      nextDisableBookingDate.value &&
      isDateAfter(day.date, nextDisableBookingDate.value))
  );
};

const dayMouseOver = (day: Day) => {
  hoveringDay.value = day.date;
  if (inWeeklyPeriods(day) || inNightlyPeriod(day)) {
    hoveringPeriod.value = getCurrentPeriod(day);
  }
  if (props.checkIn && !props.checkOut) {
    hoveringDates.value = getDatesBetweenTwoDates(
      props.checkIn,
      hoveringDay.value,
      formattingFormat.value
    );
  }
};
const dayMouseLeave = () => {
  hoveringDay.value = new Date();
  hoveringPeriod.value = null;
};

// Trigger each time the click on day is triggered
const dayClicked = (day: Day): void => {
  if (isInBookingDates(day)) {
    emit("select-booking-date", day, getBooking(day));
  } else if (props.checkIn === day.date) {
    // CheckIn when already CheckIn
    emit("update:checkIn", null);
    emit("update:checkOut", null);
    nextDisableBookingDate.value = null;
    currentPeriod.value = null;
    hoveringDates.value = [];
    hoveringDay.value = null;
  } else if (props.checkIn && !props.checkOut) {
    // CheckIn + !ChecKout
    emit("update:checkOut", day.date);
    currentPeriod.value = null;
    nextDisableBookingDate.value = null;
    hoveringDay.value = null;

    if (!props.showYear) showCalendar.value = false;
  } else if (!props.checkIn) {
    // CheckIn
    emit("update:checkIn", day.date);
    getNextBookingDate(day);
    currentPeriod.value = getCurrentPeriod(day);
  } else {
    // CheckIn + CheckOut
    emit("update:checkIn", day.date);
    emit("update:checkOut", null);
    getNextBookingDate(day);
    currentPeriod.value = getCurrentPeriod(day);
    hoveringDates.value = [];
  }
};
// // Récupère la prochaine date de booking
const getNextBookingDate = (day: Day) => {
  if (newBookingDates.length > 0) {
    let newDate = day.date;
    if (checkIncheckOutHalfDay.value[day.formatDay]?.checkOut) {
      newDate = addDays(day.date, 1);
    }

    nextDisableBookingDate.value = useGetNextBookingDate(newBookingDates, newDate);
  }
};

const getCurrentPeriod = (day: Day) => {
  const currentPeriod = props.periodDates.find((period: Period) => {
    if (
      period.endAt !== day.formatDay &&
      (period.startAt === day.formatDay ||
        validateDateBetweenTwoDates(period.startAt, period.endAt, day.formatDay))
    ) {
      return period;
    }
  });

  if (currentPeriod) {
    const durationType =
      currentPeriod.periodType === "weekly_by_saturday" ||
      currentPeriod.periodType === "weekly_by_sunday"
        ? "week"
        : "day";
    const minimumDuration =
      durationType === "week"
        ? currentPeriod.minimumDuration * 7
        : currentPeriod.minimumDuration;

    return {
      ...currentPeriod,
      nextEnableDate: addDays(day.date, minimumDuration),
    };
  }

  return null;
};
const isInBookingDates = (day: Day) => {
  return (
    flatBookingDates.value.some((x) => x.value.includes(day.formatDay)) &&
    day.belongsToThisMonth &&
    !isInCheckoutHalfDay(day)
  );
};
const isInCheckinHalfDayAndCheckin = (day: Day) => {
  return checkIncheckOutHalfDay.value[day.formatDay]?.checkIn && props.checkIn;
};
const isInCheckinHalfDayAndNotCheckin = (day: Day) => {
  return checkIncheckOutHalfDay.value[day.formatDay]?.checkIn && !props.checkIn;
};
const isInCheckoutHalfDay = (day: Day) => {
  return checkIncheckOutHalfDay.value[day.formatDay]?.checkOut;
};
const getBooking = (day: Day): FlatBooking | null => {
  if (
    flatBookingDates.value.some((b) => b.value.includes(day.formatDay)) &&
    day.belongsToThisMonth
  ) {
    const flatBooking = flatBookingDates.value.find((b) =>
      b.value.includes(day.formatDay)
    );

    if (flatBooking) {
      return flatBooking;
    }
  }

  return null;
};
const getBookingType = (day: Day): string | null => {
  return getBooking(day)?.key || null;
};
</script>

<template>
  <div ref="calendarRef" class="calendar">
    <CalendarInput
      v-if="showInputCalendar"
      :placeholder="placeholder"
      :check-in="checkIn"
      :check-out="checkOut"
      :day-format="dayFormat"
      @open-calendar="openCalendar"
    />

    <div v-if="showYear" class="calendar_paginate-wrapper">
      <button
        type="button"
        :disabled="disabledPagination.left"
        class="calendar_paginate-button"
        @click="paginate('-')"
      >
        <base-icon name="chevronLeft" />
      </button>
      <span class="calendar_paginate-year">{{ currentYear }}</span>
      <button
        type="button"
        :disabled="disabledPagination.right"
        class="calendar_paginate-button"
        @click="paginate('+')"
      >
        <base-icon name="chevronRight" />
      </button>
    </div>

    <div
      v-if="showCalendar"
      :class="['calendar_wrapper', { 'calendar_wrapper--year': showYear }]"
    >
      <CalendarHeader
        v-if="!showYear"
        :active-index="activeIndex"
        :months="months"
        @paginate="paginate"
      />

      <div class="calendar_wrapper_content">
        <div v-for="month in slicedMonths" :key="month.monthKey">
          <span v-if="showYear" class="font-bold">{{ month.monthName }}</span>

          <CalendarDays />

          <div class="calendar_wrapper_content-days">
            <div
              v-for="day in month.days"
              :key="day.formatDay"
              :class="[
                'calendar_day-wrap',
                // Color date
                `calendar_day--${getBookingType(day)}`,
                { 'calendar_day-wrap--no-border': !day.belongsToThisMonth },
                {
                  'calendar_day-wrap--disabled':
                    inDisabledDay(day) && !isInBookingDates(day),
                },
              ]"
              @mouseenter="dayMouseOver(day)"
              @mouseleave="dayMouseLeave"
            >
              <div
                v-if="
                  day.belongsToThisMonth && hoveringDay === day.date && hoveringPeriod
                "
                class="calendar_tooltip"
                v-html="tooltipText"
              />

              <button
                v-if="day.belongsToThisMonth"
                type="button"
                :style="day.style"
                :class="[
                  // Basic style
                  'calendar_day z-10',
                  // Today
                  {
                    'calendar_day--today': formatToday === day.formatDay,
                  },
                  // CheckIn or CheckOut
                  {
                    'calendar_day--checkIn-checkOut':
                      checkIn === day.date || checkOut === day.date,
                  },
                  // Booking date
                  {
                    'calendar_day--booking':
                      isInBookingDates(day) &&
                      !isInCheckinHalfDayAndCheckin(day) &&
                      !isInCheckinHalfDayAndNotCheckin(day) &&
                      !isInCheckoutHalfDay(day),
                  },
                  // Disabled date
                  {
                    'calendar_day--disabled':
                      inDisabledDay(day) && !isInBookingDates(day),
                  },
                  // Hovering date
                  {
                    'calendar_day--hovering':
                      (!checkIn && checkIn !== day.date && hoveringDay === day.date) ||
                      hoveringDates.includes(day.formatDay),
                  },
                  {
                    'calendar_day--hovering-checkIn': checkIn && hoveringDay === day.date,
                  },
                  // Inactive saturday period
                  {
                    'calendar_day--in-period': inWeeklyPeriods(day),
                  },
                  // CheckIn saturday / sunday period
                  {
                    'calendar_day--in-period-checkIn': inWeeklyPeriodsCheckin(day),
                  },
                  // CheckIn nightly period
                  {
                    'calendar_day--in-period-checkIn': inNightlyPeriod(day),
                  },
                ]"
                @click="dayClicked(day)"
              >
                <i
                  v-if="
                    isInCheckoutHalfDay(day) ||
                    isInCheckinHalfDayAndCheckin(day) ||
                    isInCheckinHalfDayAndNotCheckin(day)
                  "
                  :style="{ background: bookingStyle[day.formatDay] }"
                  :class="[
                    'calendar_day_haldDay',
                    {
                      'calendar_day_haldDay--checkIn':
                        isInCheckinHalfDayAndCheckin(day) ||
                        isInCheckinHalfDayAndNotCheckin(day),
                      'calendar_day_haldDay--checkOut': isInCheckoutHalfDay(day),
                    },
                  ]"
                />

                <span class="calendar_day--day-number">
                  {{ day.dayNumber }}
                </span>
              </button>
              <span v-else></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
body {
  --calendar-wrapper: #fff;
  --calendar-tooltip-bg: #fff;
  --calendar-tooltip-border: #ececec;

  --calendar-input-bg: #fff;
  --calendar-input-border: #eee;

  --calendar-paginate-bg: rgb(236 252 203);
  --calendar-paginate-text-color: rgb(163 230 53);
  --calendar-paginate-border-color: rgb(163 230 53);

  --calendar-paginate-hover-bg: rgb(163 230 53);
  --calendar-paginate-hover-border: rgb(163 230 53);
  --calendar-paginate-hover-text: #ffffff;

  --calendar-paginate-disabled-bg: rgba(101, 163, 13, 0.5);
  --calendar-paginate-disabled-border: rgb(101 163 13);
  --calendar-paginate-disabled-text: #ffffff;

  --day-disabled: rgb(241 245 249);

  --day-border: rgb(226 232 240);
  --day-range-days: rgb(236 252 203);
  --day-hovering-with-checkIn: rgb(163 230 53);

  --day-checkIn-checkOut: rgb(190 242 100);

  --day-today: rgb(217 249 157);
}

@tailwind base;
@tailwind components;
@tailwind utilities;

.calendar {
  @apply w-full relative select-none;
}
.calendar_wrapper {
  @apply w-full md:w-[600px];
  background-color: var(--calendar-wrapper);
}
.calendar_wrapper:not(.calendar_wrapper--year) {
  @apply p-4 shadow-md absolute top-[100%];
}
.calendar_wrapper_content {
  @apply grid grid-cols-2 gap-4;
}
.calendar_wrapper_content-days {
  @apply grid grid-cols-7;
}
.calendar_day-wrap {
  @apply relative h-0 pb-[100%] border-[.5px];
  border-color: var(--day-border);
}
.calendar_day-wrap--no-border {
  @apply border-0 pointer-events-none;
}
.calendar_day-wrap--disabled {
  @apply pointer-events-none;
}
.calendar_tooltip {
  @apply absolute top-full left-1/2 transform -translate-x-1/2 shadow-sm border p-3 text-xs z-20 text-center w-max;
  border-color: var(--calendar-tooltip-border);
  background-color: var(--calendar-tooltip-bg);
}
.calendar_day {
  @apply w-full left-0 right-0 h-full text-sm absolute focus:outline-none overflow-hidden;
}
.calendar_day--today {
  @apply border-2;
  border-color: var(--day-today);
}
.calendar_day--checkIn-checkOut.calendar_day--hovering {
  background-color: var(--day-checkIn-checkOut);
}
.calendar_day--disabled {
  background-color: var(--day-disabled);
  @apply pointer-events-none font-extralight;
}
.calendar_day--hovering {
  background-color: var(--day-range-days);
}
.calendar_day--hovering-checkIn {
  background-color: var(--day-hovering-with-checkIn);
}
.calendar_day--in-period {
  @apply pointer-events-none font-extralight;
}
.calendar_day--in-period-checkIn {
  @apply pointer-events-none font-extralight;
}
.calendar_day--day-number {
  @apply absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2;
}
.event-none {
  @apply pointer-events-none;
}
/* Year calendar */
.calendar_wrapper--year {
  @apply w-full;
}
.calendar_wrapper--year .calendar_wrapper_content {
  @apply grid grid-cols-4 gap-x-6 gap-y-2;
}

.calendar_paginate-wrapper {
  @apply mb-4;
}
.calendar_paginate-button {
  @apply p-4 duration-300;
  border-width: 1px;
  border-style: solid;
  background-color: var(--calendar-paginate-bg);
  border-color: var(--calendar-paginate-border-color);
  color: var(--calendar-paginate-text-color);
}
.calendar_paginate-button:hover {
  background-color: var(--calendar-paginate-hover-bg);
  border-color: var(--calendar-paginate-hover-border);
  color: var(--calendar-paginate-hover-text);
}
.calendar_paginate-button:disabled {
  background-color: var(--calendar-paginate-disabled-bg);
  border-color: var(--calendar-paginate-disabled-border);
  color: var(--calendar-paginate-disabled-text);
}
.calendar_paginate-year {
  @apply w-20 inline-block text-center font-bold;
}

.calendar_day--booking {
  @apply opacity-80;
}
/* New */
.calendar_day_haldDay {
  @apply w-[200%] h-[200%] absolute transform rotate-45;
}
.calendar_day_haldDay--checkIn {
  top: 0px;
  right: -140%;
}
.calendar_day_haldDay--checkOut {
  top: -140%;
  right: 0;
}
</style>

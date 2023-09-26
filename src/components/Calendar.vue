<script lang="ts">
export default {
  name: "VueCalendar",
};
</script>

<script setup lang="ts">
import {
  computed,
  ref,
  onBeforeMount,
  onUnmounted,
  provide,
  watch,
  watchEffect,
  toRef,
  nextTick,
} from "vue";
import type { ComputedRef, PropType, Ref } from "vue";

import {
  dayjs,
  format,
  formatUtc,
  getMonth,
  getYear,
  isAfterOrEqual,
} from "../plugins/day";

import BaseIcon from "./BaseIcon.vue";
import CalendarDays from "./CalendarDays.vue";
import CalendarFooter from "./CalendarFooter.vue";
import CalendarHalfDay from "./CalendarHalfDay.vue";
import CalendarHeader from "./CalendarHeader.vue";
import CalendarInput from "./CalendarInput.vue";
import CalendarTooltip from "./CalendarTooltip.vue";

import {
  addDays,
  convertHexToRGBA,
  deviceIsMobile,
  getDatesBetweenTwoDates,
  getDatesBetweenTwoDatesDiff,
  getDaysArray,
  getMonthDiff,
  getNextDay,
  isDateAfter,
  isDateBefore,
  isDateBeforeOrEqual,
  substractDays,
  toCamelCase,
  validateDateBetweenTwoDates,
} from "./helpers";

import {
  useBookingStyle,
  useCheckIncheckOutHalfDay,
  useCreateHalfDayDates,
  useCreateMonth,
  useCreateMultipleMonths,
  useFlatBooking,
  useGetFlattenedPeriods,
  useGetNextBookingDate,
  useGetPeriod,
  useToggleCalendar,
} from "./compose";

import type {
  Booking,
  BookingColor,
  CheckInCheckOutHalfDay,
  CurrentPeriod,
  Day,
  FlatBooking,
  Month,
  Period,
  Placeholder,
} from "../types";

const props = defineProps({
  alwaysVisible: {
    type: Boolean,
    default: false,
  },
  bookedDates: {
    type: Array as PropType<string[]>,
    default: (): string[] => [],
  },
  bookingColor: {
    type: Object as PropType<BookingColor>,
    default: () => ({}),
  },
  bookingDates: {
    type: Array as PropType<Booking[]>,
    default: (): Booking[] => [],
  },
  checkIn: {
    type: [Date, String],
    default: null,
  },
  checkOut: {
    type: [Date, String],
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  disabledDaysAfterDayDate: {
    type: Boolean,
    default: false,
  },
  disabledDaysBeforeDayDate: {
    type: Boolean,
    default: true,
  },
  endDate: {
    type: Date,
    default: new Date(new Date().getFullYear() + 2, 11, 1),
  },
  formatDate: {
    type: String,
    default: "YYYY-MM-DD",
  },
  isAffixed: {
    type: Boolean,
    default: false,
  },
  hasFooter: {
    type: Boolean,
    default: false,
  },
  hasHeader: {
    type: Boolean,
    default: false,
  },
  locale: {
    type: String,
    default: "fr",
  },
  minNights: {
    type: Number,
    default: 1,
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
  position: {
    type: String,
    default: "left",
  },
  showInputCalendar: {
    type: Boolean,
    default: true,
  },
  showYear: {
    type: Boolean,
    default: false,
  },
  singleCalendar: {
    type: Boolean,
    default: false,
  },
  startDate: {
    type: Date,
    default: new Date(new Date().getFullYear() - 2, 0, 1),
  },
  translations: {
    type: Object,
    default: () => ({
      fr: {
        clearDates: "Effacer les dates",
        close: "Fermer",
        days: {
          monday: "Lun",
          tuesday: "Mar",
          wednesday: "Mer",
          thursday: "Jeu",
          friday: "Ven",
          saturday: "Sam",
          sunday: "Dim",
        },
        today: "Aujourd'hui",
        periodType: {
          weeklyBySaturday:
            "%{minimumDuration} semaine min. du samedi au samedi || %{minimumDuration} semaines min. du samedi au samedi",
          weeklyBySunday:
            "%{minimumDuration} semaine min. du dimanche au dimanche || %{minimumDuration} semaines min. du dimanche au dimanche",
          weeklyByMonday:
            "%{minimumDuration} semaine min. du lundi au lundi || %{minimumDuration} semaines min. du lundi au lundi",
          nightly:
            "Un minimum de %{minimumDuration} nuit est requis || Un minimum de %{minimumDuration} nuits est requis",
        },
        halfDay: {
          checkIn: "Fin de séjour possible",
          checkOut: "Début de séjour possible",
        },
      },
      en: {
        clearDates: "Clear dates",
        close: "Close",
        days: {
          monday: "Mo",
          tuesday: "Tu",
          wednesday: "We",
          thursday: "Th",
          friday: "Fr",
          saturday: "Sa",
          sunday: "Su",
        },
        today: "Today",
        periodType: {
          weeklyBySaturday: "From Saturday to Saturday",
          weeklyBySunday: "From Sunday to Sunday",
          weeklyByMonday: "From Monday to Monday",
          nightly: "A minimum of %{minimumDuration} night is required",
        },
        halfDay: {
          checkIn: "Possible end of stay",
          checkOut: "Possible start of stay",
        },
      },
    }),
  },
  timezone: {
    type: String,
    default: "Europe/Paris",
  },
});

dayjs.tz.setDefault(props.timezone);
dayjs.locale(props.locale);

const isClient = typeof window !== "undefined";

const t = (key: string, minimumDuration: number | null = null): string => {
  const translation = props.translations[props.locale];

  if (key.includes(".")) {
    const a = key.split(".");
    const translationValue = translation[a[0]][a[1]];

    if (translationValue.includes("||")) {
      const translationPlurial = translationValue.split("||");

      if (minimumDuration === 1) {
        return translationPlurial[0].replace(
          "%{minimumDuration}",
          minimumDuration
        );
      }

      return translationPlurial[1].replace(
        "%{minimumDuration}",
        minimumDuration
      );
    }

    if (translationValue.includes("%{minimumDuration}")) {
      return translationValue.replace("%{minimumDuration}", minimumDuration);
    }

    return translationValue;
  } else {
    return translation[key];
  }
};

provide("t", t);

const emits = defineEmits([
  "clear-dates",
  "close-date-picker",
  "render-next-date",
  "render-previous-date",
  "select-booking-date",
  "update:checkIn",
  "update:checkOut",
]);

const activeIndex = ref(0);
const activeMobileIndex = ref(0);
const calendarWrapperContent: Ref<HTMLTextAreaElement | null> = ref(null);
const checkInPeriod = ref({});
const currentPeriod: Ref<CurrentPeriod | null> = ref(null);
const dynamicNightCounts = ref(0);
const formattingFormat = ref("YYYY-MM-DD");
const heightOfCalendarMonth = ref(0);
const hoveringDates: Ref<string[]> = ref([]);
const hoveringDay: Ref<Day | null> = ref(null);
const hoveringPeriod: Ref<CurrentPeriod | null> = ref(null);
const lastEnableDaysOfPeriod: Ref<Date | null> = ref(null);
const months = ref([]) as Ref<Month[]>;
const nextDisableBookingDate: Ref<Date | null> = ref(null);
const nextPeriod: Ref<Period | null> = ref(null);
const nextPeriodDisableDates: Ref<string[]> = ref([]);
const today = ref(new Date());

// Format checkIn, checkOut with correct UTC
if (props.checkIn && props.checkOut) {
  emits("update:checkIn", formatUtc(props.checkIn), false);
  emits("update:checkOut", formatUtc(props.checkOut), false);
}

const calculIndex = (date: Date): number => {
  const todayMonth = getMonth(date);
  const currentYear = getYear(date);
  const startYear = getYear(props.startDate);

  const numberOfYears =
    currentYear - startYear > 0 ? currentYear - startYear : 0;

  const numberOfMonth = props.showYear
    ? numberOfYears * 12
    : numberOfYears * 12 + todayMonth;

  return Math.floor(numberOfMonth);
};

// Desktop
const paginateToTodayDesktop = (date: Date | string): void => {
  const numberOfMonth = calculIndex(new Date(date));

  activeIndex.value = Math.floor(numberOfMonth);
};

if (props.checkIn && props.checkOut) {
  paginateToTodayDesktop(props.checkIn);
} else {
  paginateToTodayDesktop(today.value);
}

// Active index for mobile
activeMobileIndex.value = calculIndex(today.value);

// Current month of the current day
months.value.push(useCreateMonth(props.startDate));

// Next 12 month after the current day
const countOfMonth = getMonthDiff(props.startDate, props.endDate);
const multipleMonths = useCreateMultipleMonths(props.startDate, countOfMonth);

months.value.push(...multipleMonths);

const {
  addClickOusideListener,
  calendarRef,
  closeCalendar,
  openCalendar,
  removeClickOusideListener,
  showCalendar,
  toggleCalendar,
} = useToggleCalendar(props);

// Sorted periods
const sortedPeriodDates: ComputedRef<Period[]> = computed(() => {
  if (props.periodDates) {
    const periodDates = [...props.periodDates];

    return periodDates
      .sort((a, b) => {
        const aa = a.startAt.split("/").reverse().join();
        const bb = b.startAt.split("/").reverse().join();

        // eslint-disable-next-line no-nested-ternary
        return aa < bb ? -1 : aa > bb ? 1 : 0;
      })
      .map((period) => {
        const minimumDurationNights = period.periodType.includes("weekly")
          ? period.minimumDuration * 7
          : period.minimumDuration;

        return {
          ...period,
          minimumDurationNights,
        };
      });
  }

  return [];
});
// Create array of disabledDates for each types of period
const saturdayWeeklyPeriods = computed(() => {
  return useGetFlattenedPeriods(
    sortedPeriodDates,
    "weekly_by_saturday",
    formattingFormat.value
  );
});
const sundayWeeklyPeriods = computed(() => {
  return useGetFlattenedPeriods(
    sortedPeriodDates,
    "weekly_by_sunday",
    formattingFormat.value
  );
});
const mondayWeeklyPeriods = computed(() => {
  return useGetFlattenedPeriods(
    sortedPeriodDates,
    "weekly_by_monday",
    formattingFormat.value
  );
});
const nightlyPeriods = computed(() => {
  return useGetFlattenedPeriods(
    sortedPeriodDates,
    "nightly",
    formattingFormat.value
  );
});

const isMobile = computed(() => {
  return deviceIsMobile();
});
const isDesktop = computed(() => {
  return !isMobile.value;
});

const bookingDatesT = toRef(props, "bookingDates") as unknown as Ref<Booking[]>;
const bookedDatesT = toRef(props, "bookedDates") as unknown as Ref<string[]>;
const bookingColorT = toRef(
  props,
  "bookingColor"
) as unknown as Ref<BookingColor>;

const disabledDates = computed(() => {
  return useCreateHalfDayDates(
    bookingDatesT.value,
    bookedDatesT.value,
    bookingColorT.value,
    formattingFormat
  ).disabledDates;
});
const newBookingDates = computed(() => {
  return useCreateHalfDayDates(
    bookingDatesT.value,
    bookedDatesT.value,
    bookingColorT.value,
    formattingFormat
  ).newBookingDates;
});
const flatBookingDates = computed(() => {
  return useFlatBooking(
    bookingDatesT.value,
    bookingColorT.value,
    formattingFormat
  );
});

let checkIncheckOutHalfDay = ref({}) as Ref<CheckInCheckOutHalfDay>;
checkIncheckOutHalfDay = useCheckIncheckOutHalfDay(
  bookingDatesT.value,
  bookedDatesT.value
);

const bookingStyle = computed(() => {
  return useBookingStyle(
    bookingDatesT.value,
    bookingColorT.value,
    formattingFormat,
    checkIncheckOutHalfDay
  );
});

watchEffect(() => {
  checkIncheckOutHalfDay = useCheckIncheckOutHalfDay(
    bookingDatesT.value,
    bookedDatesT.value
  );

  months.value.forEach((m) => {
    m.days.forEach((day: Day) => {
      const bookingColor = bookingStyle.value.value[day.formatDay] as string;

      day.style = {
        background: !checkIncheckOutHalfDay.value[day.formatDay]
          ? convertHexToRGBA(bookingColor, 50)
          : "",
      };
    });
  });
});

const currentYear: ComputedRef<number> = computed(() => {
  return months.value[activeIndex.value].yearKey;
});

const disabledPagination: ComputedRef<{ left: boolean; right: boolean }> =
  computed(() => {
    const diff = props.showYear ? 12 : 2;

    return {
      left: activeIndex.value <= 0,
      right: activeIndex.value >= months.value.length - diff,
    };
  });

const paginate = (operator: string) => {
  const count = props.showYear ? 12 : 1;

  if (activeIndex.value > 0 && operator === "-") {
    activeIndex.value -= count;
    emits("render-previous-date", currentYear.value);
  }
  if (operator === "+") {
    activeIndex.value += count;
    emits("render-next-date", currentYear.value);
  }
};

const minNightCount = computed(() => {
  return dynamicNightCounts.value || props.minNights;
});

const datesBetweenCheckInCheckOutDates: ComputedRef<string[]> = computed(() => {
  if (props.checkIn && props.checkOut) {
    return getDatesBetweenTwoDates(
      addDays(props.checkIn, 1),
      substractDays(props.checkOut, 1),
      formattingFormat.value
    );
  }

  return [];
});

// Watch checkIn and checkOut props dates
const checkInDate = toRef(props, "checkIn");
const checkOutDate = toRef(props, "checkOut");
watch([checkInDate, checkOutDate], () => {
  if (!checkInDate.value && !checkOutDate.value) {
    clearDataWhenDateIsNull();
  }
});

const clearMinimumDurationDate = () => {
  nextPeriod.value = null;
  lastEnableDaysOfPeriod.value = null;
  nextPeriodDisableDates.value = [];
};

const setMinimumDuration = (date: Date) => {
  clearMinimumDurationDate();

  if (sortedPeriodDates.value.length) {
    const nextPeriodIsPriority = (
      currentPeriod: CurrentPeriod | null,
      minimumDurationNights: number
    ) => {
      if (nextPeriod.value?.minimumDurationNights) {
        // If NextPeriod is a weekly period
        if (
          currentPeriod?.periodType === "nightly" &&
          nextPeriod.value.periodType.includes("weekly")
        ) {
          return true;
        }

        // If NextPeriod is a nightly period
        return nextPeriod.value.minimumDurationNights > minimumDurationNights;
      }

      // If NextPeriod doesn't exist
      return false;
    };

    const getEnableNextDate = () => {
      let enableNextDate = addDays(date, dynamicNightCounts.value - 1);

      if (
        lastEnableDaysOfPeriod.value &&
        nextPeriod.value?.periodType.includes("weekly") &&
        !isDateBeforeOrEqual(date, lastEnableDaysOfPeriod.value)
      ) {
        // weekly by sunday
        let constraintPeriod = 0;

        if (nextPeriod.value.periodType === "weekly_by_saturday")
          constraintPeriod = 6;
        if (nextPeriod.value.periodType === "weekly_by_monday")
          constraintPeriod = 1;

        enableNextDate = substractDays(
          getNextDay(enableNextDate, constraintPeriod),
          1
        );
      }

      return enableNextDate;
    };

    const setDisabledDays = () => {
      const startDateCheckin = addDays(date, 1);
      const enableNextDate = getEnableNextDate();
      let nextPeriodDisabledDates: string[] = [];
      const newDisablesDates: string[] = getDaysArray(
        startDateCheckin,
        enableNextDate
      ).map((d) => format(d, formattingFormat.value));

      nextPeriodDisableDates.value.push(...newDisablesDates);

      // CheckIn + nextPeriod.minimumDuration + contrainte
      if (nextPeriod.value?.periodType.includes("weekly")) {
        let nextPeriodEnableDay = addDays(
          date,
          nextPeriod.value.minimumDurationNights
        );
        // weekly by sunday
        let constraintPeriod = 0;

        if (nextPeriod.value.periodType === "weekly_by_saturday")
          constraintPeriod = 6;
        if (nextPeriod.value.periodType === "weekly_by_monday")
          constraintPeriod = 1;

        if (nextPeriodEnableDay.getDay() !== constraintPeriod) {
          nextPeriodEnableDay = getNextDay(
            nextPeriodEnableDay,
            constraintPeriod
          );

          nextPeriodDisabledDates = getDaysArray(
            addDays(nextPeriod.value.startAt, 1),
            substractDays(nextPeriodEnableDay, 1)
          ).map((d) => format(d, formattingFormat.value));
        }
      }

      // Filled nextPeriodDisabledDates
      nextPeriodDisableDates.value.push(
        ...newDisablesDates,
        ...nextPeriodDisabledDates
      );
      nextPeriodDisableDates.value = [...new Set(nextPeriodDisableDates.value)];
      nextPeriodDisableDates.value = nextPeriodDisableDates.value.map((x) =>
        formatUtc(x)
      );
      nextPeriodDisableDates.value = nextPeriodDisableDates.value.map((x) =>
        format(x, formattingFormat.value)
      );
    };

    const getPeriod = (currentDate: Date): CurrentPeriod | null => {
      const compareDate = format(currentDate, formattingFormat.value);
      let day = null;

      sortedPeriodDates.value.forEach((d) => {
        if (
          d.endAt !== compareDate &&
          (d.startAt === compareDate ||
            validateDateBetweenTwoDates(d.startAt, d.endAt, currentDate))
        ) {
          day = d;
        }
      });

      return day;
    };

    const currentPeriod = getPeriod(date);

    // If currentPeriod
    if (currentPeriod) {
      lastEnableDaysOfPeriod.value = substractDays(
        currentPeriod.endAt,
        currentPeriod.minimumDurationNights
      );

      const currentPeriodIndex = sortedPeriodDates.value.findIndex(
        (p) => p.startAt === currentPeriod.startAt
      );

      if (sortedPeriodDates.value.length > currentPeriodIndex) {
        nextPeriod.value = sortedPeriodDates.value[currentPeriodIndex + 1];
      }

      // Calculate dynamic minimum nights with nextPeriod
      if (
        lastEnableDaysOfPeriod.value &&
        !isDateBeforeOrEqual(date, lastEnableDaysOfPeriod.value) &&
        nextPeriodIsPriority(currentPeriod, currentPeriod.minimumDurationNights)
      ) {
        dynamicNightCounts.value = nextPeriod.value?.minimumDurationNights || 0;
        checkInPeriod.value = { ...nextPeriod.value };
        setDisabledDays();
      } else {
        checkInPeriod.value = { ...currentPeriod };
        dynamicNightCounts.value = currentPeriod.minimumDurationNights;
        setDisabledDays();
      }

      // Else !currentPeriod
    } else {
      const checkInWithMinimumDuration = addDays(date, minNightCount.value - 1);

      nextPeriod.value = getPeriod(checkInWithMinimumDuration);

      if (nextPeriodIsPriority(null, minNightCount.value)) {
        dynamicNightCounts.value = nextPeriod.value?.minimumDurationNights || 0;
        checkInPeriod.value = { ...nextPeriod.value };

        setDisabledDays();
      } else {
        dynamicNightCounts.value = 0;
      }
    }
  }
};

const tooltipText: ComputedRef<string> = computed(() => {
  // Hovering periof
  if (hoveringPeriod.value) {
    const { minimumDuration, periodType } = hoveringPeriod.value;

    if (periodType === "weekly_by_saturday") {
      return t("periodType.weeklyBySaturday", minimumDuration);
    }
    if (periodType === "weekly_by_sunday") {
      return t("periodType.weeklyBySunday", minimumDuration);
    }
    if (periodType === "weekly_by_monday") {
      return t("periodType.weeklyByMonday", minimumDuration);
    }
    if (periodType === "nightly") {
      return t("periodType.nightly", minimumDuration);
    }
  }

  // Hovering day
  if (hoveringDay.value) {
    if (
      isInCheckinHalfDayAndNotCheckin(hoveringDay.value) ||
      isInCheckinHalfDayAndCheckin(hoveringDay.value)
    ) {
      return t("halfDay.checkIn");
    } else if (isInCheckoutHalfDay(hoveringDay.value)) {
      const period = useGetPeriod(
        sortedPeriodDates,
        hoveringDay.value.formatDay
      );

      if (period?.periodType && period?.minimumDuration) {
        return `${t("halfDay.checkOut")} \n ${t(
          `periodType.${toCamelCase(period.periodType)}`,
          period.minimumDuration
        )}`;
      }

      return t("halfDay.checkOut");
    }
  }

  return "";
});

const slicedMonthsForDesktop: ComputedRef<Month[]> = computed(() => {
  const count = props.showYear ? 12 : 2;

  return months.value.slice(activeIndex.value, count + activeIndex.value);
});
const slicedMonthsForMobile: ComputedRef<Month[]> = computed(() => {
  if (props.isAffixed) {
    return months.value.slice(activeMobileIndex.value, 12 + activeIndex.value);
  }

  return months.value.slice(activeIndex.value, 1 + activeIndex.value);
});
const slicedMonths: ComputedRef<Month[]> = computed(() => {
  if (!props.singleCalendar) {
    return isMobile.value
      ? slicedMonthsForMobile.value
      : slicedMonthsForDesktop.value;
  }

  return slicedMonthsForMobile.value;
});
const formatToday: ComputedRef<string> = computed(() => {
  return format(today.value, formattingFormat.value);
});

// Methods
const setClassForTootip = (dayIndex: number): string => {
  const tooltipClass = {
    1: "tooltip--left",
    2: "tooltip--left",
    3: "tooltip--center",
    4: "tooltip--center",
    5: "tooltip--center",
    6: "tooltip--right",
    0: "tooltip--right",
  } as { [key: number]: string };

  return tooltipClass[dayIndex];
};
const dayFormat = (date: Date): string => {
  return format(date, props.formatDate);
};

const activeDayInWeeklyPeriods = (day: Day) => {
  return (
    (saturdayWeeklyPeriods.value.includes(day.formatDay) &&
      day.date.getDay() === 6) ||
    (sundayWeeklyPeriods.value.includes(day.formatDay) &&
      day.date.getDay() === 0) ||
    (mondayWeeklyPeriods.value.includes(day.formatDay) &&
      day.date.getDay() === 1)
  );
};

const inWeeklyPeriods = (day: Day) => {
  return (
    (saturdayWeeklyPeriods.value.includes(day.formatDay) &&
      day.date.getDay() !== 6) ||
    (sundayWeeklyPeriods.value.includes(day.formatDay) &&
      day.date.getDay() !== 0) ||
    (mondayWeeklyPeriods.value.includes(day.formatDay) &&
      day.date.getDay() !== 1)
  );
};

const inNightlyPeriod = (day: Day) => {
  if (currentPeriod.value?.nextEnableDate) {
    const isAfterNexteEnableDate = isAfterOrEqual(
      day.date,
      currentPeriod.value?.nextEnableDate
    );

    return (
      props.checkIn !== day.date &&
      !isAfterNexteEnableDate &&
      currentPeriod.value?.periodType === "nightly" &&
      nightlyPeriods.value.includes(day.formatDay)
    );
  }
};

const inDisabledDay = (day: Day) => {
  return (
    (props.disabledDaysBeforeDayDate &&
      day.formatDay !== formatToday.value &&
      isDateBeforeOrEqual(day.date, today.value)) ||
    (props.disabledDaysAfterDayDate &&
      day.formatDay !== formatToday.value &&
      isDateAfter(day.date, today.value)) ||
    (props.checkIn &&
      !props.checkOut &&
      isDateBefore(day.date, props.checkIn)) ||
    (disabledDates.value.value.includes(day.formatDay) &&
      !checkIncheckOutHalfDay.value[day.formatDay]) ||
    (props.checkIn &&
      nextDisableBookingDate.value &&
      isDateAfter(day.date, nextDisableBookingDate.value))
  );
};

// Hovering data
const defineHoveringData = (day: Day) => {
  hoveringDay.value = day;

  if (inWeeklyPeriods(day) || inNightlyPeriod(day)) {
    hoveringPeriod.value = getCurrentPeriod(day);
  }
  if (props.checkIn && !props.checkOut) {
    hoveringDates.value = getDatesBetweenTwoDates(
      props.checkIn,
      hoveringDay.value.date,
      formattingFormat.value
    );
  }
};
const mobileClick = (day: Day) => {
  if (isMobile.value && !props.singleCalendar) defineHoveringData(day);
};
const desktopHover = (day: Day) => {
  if (isDesktop.value && !props.singleCalendar) defineHoveringData(day);
};

const removeTooltip = () => {
  hoveringPeriod.value = null;
  hoveringDay.value = null;
};
const dayMouseLeave = () => {
  hoveringDay.value = null;
  removeTooltip();
};

const setCheckIn = (day: Day) => {
  if (props.singleCalendar) {
    emits("update:checkIn", day.date);
    closeDatePicker();
  } else {
    emits("update:checkIn", day.date);
    getNextBookingDate(day);
    setMinimumDuration(day.date);
    const cp = getCurrentPeriod(day);
    currentPeriod.value = cp;
    hoveringDates.value = [];
    hoveringPeriod.value = cp;
  }
};
const setCheckOut = (day: Day) => {
  emits("update:checkOut", day.date);
  currentPeriod.value = null;
  hoveringDates.value = [];
  hoveringPeriod.value = null;
};

const clearHoveringDates = () => {
  hoveringPeriod.value = null;
  hoveringDates.value = [];
  hoveringDay.value = null;
};

const clearDataWhenDateIsNull = () => {
  clearMinimumDurationDate();
  currentPeriod.value = null;
  clearHoveringDates();
  nextDisableBookingDate.value = null;
};

// Trigger each time the click on day is triggered
const dayClicked = (day: Day, e: Event): void => {
  if (getSelectedBooking(day)) {
    emits(
      "select-booking-date",
      day,
      getSelectedBooking(day),
      checkIncheckOutHalfDay.value[day.formatDay],
      e
    );
  }

  const disabledClicked =
    Boolean(checkIncheckOutHalfDay.value[day.formatDay]?.checkIn) &&
    Boolean(props.checkIn) &&
    !props.checkOut;

  const disabledClickedIfCheckInCheckOutHalfday =
    checkIncheckOutHalfDay.value[day.formatDay]?.checkIn &&
    checkIncheckOutHalfDay.value[day.formatDay]?.checkOut;

  if (disabledClickedIfCheckInCheckOutHalfday) return;

  if (isInBookingDates(day) && !disabledClicked) return;

  if (props.singleCalendar) {
    if (props.checkIn === day.date) {
      emits("update:checkIn", null);
    } else {
      setCheckIn(day);
    }
  } else {
    if (props.checkIn === day.date) {
      // CheckIn when already CheckIn
      emits("update:checkIn", null);
      emits("update:checkOut", null);
      clearDataWhenDateIsNull();
    } else if (
      (props.checkIn && !props.checkOut) ||
      (isInBookingDates(day) &&
        isInCheckinHalfDayAndCheckin(day) &&
        props.checkIn)
    ) {
      // CheckIn + !ChecKout
      setCheckOut(day);

      currentPeriod.value = null;
      nextDisableBookingDate.value = null;
      hoveringDay.value = null;

      if (!props.alwaysVisible) showCalendar.value = false;
    } else if (!props.checkIn) {
      // CheckIn
      setCheckIn(day);
    } else {
      // CheckIn + CheckOut
      setCheckIn(day);
      emits("update:checkOut", null);
    }
  }
};
// Récupère la prochaine date de booking
const getNextBookingDate = (day: Day) => {
  if (newBookingDates.value.length) {
    let newDate = day.date;
    if (checkIncheckOutHalfDay.value[day.formatDay]?.checkOut) {
      newDate = addDays(day.date, 1);
    }

    nextDisableBookingDate.value = useGetNextBookingDate(
      newBookingDates,
      newDate
    );
  }
};

const getCurrentPeriod = (day: Day) => {
  const currentPeriod = props.periodDates.find((period: Period) => {
    if (
      period.endAt !== day.formatDay &&
      (period.startAt === day.formatDay ||
        validateDateBetweenTwoDates(
          period.startAt,
          period.endAt,
          day.formatDay
        ))
    ) {
      return period;
    }
  });

  if (currentPeriod) {
    const durationType =
      currentPeriod.periodType === "weekly_by_saturday" ||
      currentPeriod.periodType === "weekly_by_sunday" ||
      currentPeriod.periodType === "weekly_by_monday"
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

const isInFlattenBookingDates = (day: Day) => {
  return flatBookingDates.value.value.some((x) =>
    x.value.includes(day.formatDay)
  );
};
const isInBookingDates = (day: Day) => {
  return (
    day.belongsToThisMonth &&
    isInFlattenBookingDates(day) &&
    !isInCheckoutHalfDay(day)
  );
};
const isInCheckinHalfDayAndCheckin = (day: Day): boolean => {
  return (
    Boolean(props.checkIn) &&
    Boolean(checkIncheckOutHalfDay.value[day.formatDay]?.checkIn)
  );
};
const isInCheckinHalfDayAndNotCheckin = (day: Day): boolean => {
  return (
    Boolean(!props.checkIn) &&
    Boolean(checkIncheckOutHalfDay.value[day.formatDay]?.checkIn)
  );
};
const isInCheckinHalfDayAndNotCheckinAndNotCheckOut = (day: Day): boolean => {
  const isInCheckinHalfDayAndCheckin =
    Boolean(checkIncheckOutHalfDay.value[day.formatDay]?.checkIn) &&
    !props.checkIn;
  const isInCheckinHalfDayAndNotCheckinAndNotCheckOut =
    Boolean(checkIncheckOutHalfDay.value[day.formatDay]?.checkIn) &&
    Boolean(props.checkIn) &&
    Boolean(props.checkOut);

  return (
    isInCheckinHalfDayAndCheckin ||
    isInCheckinHalfDayAndNotCheckinAndNotCheckOut
  );
};
const isInCheckoutHalfDay = (day: Day): boolean => {
  return Boolean(checkIncheckOutHalfDay.value[day.formatDay]?.checkOut);
};
const getSelectedBooking = (day: Day) => {
  // If day is between checkInDate and checkOutDate of a Booking
  if (
    bookingDatesT.value.some((d) =>
      validateDateBetweenTwoDates(d.checkInDate, d.checkOutDate, day.formatDay)
    )
  ) {
    return {
      ...bookingDatesT.value.find((d) =>
        validateDateBetweenTwoDates(
          d.checkInDate,
          d.checkOutDate,
          day.formatDay
        )
      ),
      ...getBooking(day),
    };
  }

  // If day is on two bookings
  if (
    bookingDatesT.value.some((d) => d.checkInDate === day.formatDay) &&
    bookingDatesT.value.some((d) => d.checkOutDate === day.formatDay)
  ) {
    return {
      1: bookingDatesT.value.find((d) => d.checkInDate === day.formatDay),
      2: bookingDatesT.value.find((d) => d.checkOutDate === day.formatDay),
    };
  }

  // If day is a checkInDate of a Booking
  if (bookingDatesT.value.some((d) => d.checkInDate === day.formatDay)) {
    return {
      ...bookingDatesT.value.find((d) => d.checkInDate === day.formatDay),
      ...getBooking(day),
    };
  }

  // If day is a checkOutDate of a Booking
  if (bookingDatesT.value.some((d) => d.checkOutDate === day.formatDay)) {
    return {
      ...bookingDatesT.value.find((d) => d.checkOutDate === day.formatDay),
      ...getBooking(day),
    };
  }

  return null;
};

const getBooking = (day: Day): FlatBooking | null => {
  if (
    flatBookingDates.value.value.some((b) => b.value.includes(day.formatDay)) &&
    day.belongsToThisMonth
  ) {
    const flatBooking = flatBookingDates.value.value.find((b) =>
      b.value.includes(day.formatDay)
    );

    if (flatBooking) {
      return flatBooking;
    }
  }

  return null;
};
const closeDatePicker = () => {
  showCalendar.value = false;
  emits("close-date-picker");
};
const clearDates = () => {
  emits("update:checkIn", null);
  emits("update:checkOut", null);

  emits("clear-dates");
};
const resizeContainer = () => {
  if (isClient) {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }
};

const visibleMobileMonth: ComputedRef<number> = computed(() => {
  const monthBeforeToday = getMonthDiff(props.startDate, today.value) + 1;

  return countOfMonth - monthBeforeToday;
});

const scrollToPaginateMobile = (e: Event) => {
  const height = heightOfCalendarMonth.value * (slicedMonths.value.length - 4);
  const { scrollTop } = e.target as HTMLTextAreaElement;

  if (
    height < scrollTop &&
    slicedMonths.value.length <= visibleMobileMonth.value
  ) {
    activeIndex.value = activeIndex.value + 6;
    emits("render-next-date", currentYear.value);
  } else if (slicedMonths.value.length === visibleMobileMonth.value) {
    return null;
  }
};

const scrollToCheckIn = () => {
  const count = activeIndex.value - activeMobileIndex.value;

  if (calendarWrapperContent.value) {
    calendarWrapperContent.value.scrollTo({
      top: heightOfCalendarMonth.value * count,
    });
  }
};

watch(
  () => props.showYear,
  () => {
    paginateToTodayDesktop(today.value);
  }
);

watch(
  () => showCalendar.value,
  (val) => {
    if (val) {
      nextTick(() => {
        heightOfCalendarMonth.value =
          document
            .querySelector(".calendar_wrap_month")
            ?.getBoundingClientRect()?.height || 0;

        if (props.checkIn && props.checkOut) {
          scrollToCheckIn();
        }
      });
    }
  }
);

onBeforeMount(() => {
  if (!props.alwaysVisible) addClickOusideListener();

  if (isClient && isMobile.value) {
    window.addEventListener("resize", resizeContainer);
    resizeContainer();
  }
});

onUnmounted(() => {
  if (!props.alwaysVisible) removeClickOusideListener();

  if (isClient && isMobile.value) {
    window.removeEventListener("resize", resizeContainer);
  }
});

defineExpose({
  activeIndex,
  clearDates,
  closeCalendar,
  closeDatePicker,
  openCalendar,
  showCalendar,
  toggleCalendar,
});
</script>

<template>
  <div
    ref="calendarRef"
    :class="['vue-calendar', { 'vue-calendar--disabled': disabled }]"
  >
    <CalendarInput
      v-if="showInputCalendar"
      :class="{ 'calendar_input-open': showCalendar }"
      :placeholder="placeholder"
      :single-calendar="singleCalendar"
      :check-in="checkIn"
      :check-out="checkOut"
      :day-format="dayFormat"
      @open-calendar="openCalendar"
      @clear-dates="clearDates"
    />
    <div>
      <div v-if="alwaysVisible" class="calendar_paginate-wrapper">
        <div class="calendar_paginate-wrapper--left-content">
          <button
            data-testid="calendar_paginate-prev--button"
            type="button"
            :disabled="disabledPagination.left"
            class="calendar_paginate-button"
            @click="paginate('-')"
          >
            <base-icon name="chevronLeft" />
          </button>
          <div class="calendar_paginate-year">
            <span>{{ currentYear }}</span>
          </div>
          <button
            data-testid="calendar_paginate-next--button"
            type="button"
            :disabled="disabledPagination.right"
            class="calendar_paginate-button"
            @click="paginate('+')"
          >
            <base-icon name="chevronRight" />
          </button>

          <button
            type="button"
            class="calendar_today-button"
            @click="paginateToTodayDesktop(today)"
          >
            {{ t("today") }}
          </button>
        </div>

        <slot name="header" />
      </div>
    </div>

    <div
      v-if="showCalendar"
      :class="[
        'calendar_wrapper',
        `calendar_wrapper--${position}`,
        {
          'calendar_wrapper--year': alwaysVisible,
          'calendar_wrapper--affix': isAffixed,
          'calendar_wrapper--single': singleCalendar,
        },
      ]"
    >
      <CalendarHeader
        v-if="!alwaysVisible && !isAffixed"
        :active-index="activeIndex"
        :show-header="isMobile || singleCalendar"
        :months="months"
        @paginate="paginate"
      />

      <CalendarFooter
        v-if="hasHeader && isMobile"
        :is-mobile="isMobile"
        :locale="locale"
        @close-date-picker="closeDatePicker"
        @clear-dates="clearDates"
      >
        <template #footer>
          <slot
            name="calendar-header-mobile"
            :clear-dates="clearDates"
            :close-date-picker="closeDatePicker"
          />
        </template>
      </CalendarFooter>

      <div
        ref="calendarWrapperContent"
        @scroll="scrollToPaginateMobile"
        :class="[
          'calendar_wrapper_content',
          {
            'calendar_wrapper_content--year': showYear,
          },
        ]"
      >
        <div
          v-for="month in slicedMonths"
          :key="month.monthKey"
          class="calendar_wrap_month"
        >
          <span
            v-if="isDesktop && alwaysVisible"
            class="calendar_wrapper_month"
          >
            {{ month.monthName }}
          </span>

          <!-- Mobile header -->
          <CalendarDays v-if="isDesktop" :locale="locale" />
          <div v-if="isAffixed" class="calendar_wrapper_month">
            <span>{{ month.monthName }}</span>
          </div>
          <!-- Mobile header -->

          <div class="calendar_wrapper_content-days">
            <div
              v-for="day in month.days"
              :key="day.formatDay"
              :class="[
                'calendar_day-wrap',
                // Tooltip
                `calendar_day-wrap-${setClassForTootip(day.dayIndex)}`,
                {
                  'calendar_day-wrap--no-border': !day.belongsToThisMonth,
                  'calendar_day-wrap--disabled': inDisabledDay(day),
                },
              ]"
              :data-testid="`daywrap-${format(day.date, formattingFormat)}`"
              @mouseenter="desktopHover(day)"
              @mouseleave="dayMouseLeave"
              @click="mobileClick(day)"
            >
              <CalendarTooltip
                v-if="
                  day.belongsToThisMonth &&
                  hoveringDay &&
                  hoveringDay.date === day.date &&
                  hoveringPeriod
                "
                :tooltip-text="tooltipText"
                @remove-tooltip="removeTooltip"
              />
              <CalendarTooltip
                v-else-if="
                  !isInCheckinHalfDayAndNotCheckinAndNotCheckOut(day) &&
                  day.belongsToThisMonth &&
                  hoveringDay &&
                  hoveringDay.date === day.date &&
                  (isInCheckinHalfDayAndNotCheckin(day) ||
                    isInCheckoutHalfDay(day) ||
                    isInCheckinHalfDayAndCheckin(day))
                "
                :tooltip-text="tooltipText"
                @remove-tooltip="removeTooltip"
              />

              <button
                v-if="day.belongsToThisMonth"
                type="button"
                :style="day.style"
                :class="[
                  // Basic style
                  'calendar_day z-5',
                  // Today
                  {
                    'calendar_day--today': formatToday === day.formatDay,
                  },
                  // CheckIn
                  {
                    'calendar_day--checkIn':
                      format(checkIn, formattingFormat) ===
                      format(day.date, formattingFormat),
                  },
                  // singleCalendar
                  {
                    'calendar_day--checkIn--single':
                      singleCalendar &&
                      format(checkIn, formattingFormat) ===
                        format(day.date, formattingFormat),
                  },
                  // CheckOut
                  {
                    'calendar_day--checkOut':
                      format(checkOut, formattingFormat) ===
                      format(day.date, formattingFormat),
                  },
                  // Booking date
                  {
                    'calendar_day--booking':
                      isInBookingDates(day) &&
                      !isInCheckinHalfDayAndCheckin(day) &&
                      !isInCheckinHalfDayAndNotCheckin(day) &&
                      !isInCheckoutHalfDay(day),
                  },
                  // Hovering date
                  {
                    'calendar_day--hovering':
                      isDesktop &&
                      ((!checkIn &&
                        hoveringDay &&
                        format(checkIn, formattingFormat) !==
                          format(day.date, formattingFormat) &&
                        hoveringDay.date === day.date) ||
                        hoveringDates.includes(day.formatDay)),
                  },
                  {
                    'calendar_day_between--checkIn-checkOut':
                      getDatesBetweenTwoDatesDiff(checkIn, checkOut) >= 2 &&
                      datesBetweenCheckInCheckOutDates.includes(day.formatDay),
                  },
                  {
                    'calendar_day--hovering-checkIn':
                      isDesktop &&
                      hoveringDay &&
                      checkIn &&
                      hoveringDay.date === day.date,
                  },
                  // Inactive saturday / sunday / monday period
                  {
                    'calendar_day--in-period event-none':
                      (inWeeklyPeriods(day) && !isInBookingDates(day)) ||
                      (nextPeriodDisableDates.includes(day.formatDay) &&
                        !isInBookingDates(day)),
                  },
                  // Inactive saturday / sunday / monday period
                  {
                    'calendar_day--is-a-day-period':
                      activeDayInWeeklyPeriods(day),
                  },
                  // halfDay checkIn
                  {
                    'calendar_day-in-half-day--checkIn':
                      !isInFlattenBookingDates(day) &&
                      isInCheckinHalfDayAndNotCheckinAndNotCheckOut(day),
                  },
                  {
                    'calendar_day-in-half-day--checkOut':
                      !isInFlattenBookingDates(day) && isInCheckoutHalfDay(day),
                  },
                ]"
                :data-testid="`day-${format(day.date, formattingFormat)}`"
                @click="dayClicked(day, $event)"
              >
                <!-- Half day for CheckIn -->
                <CalendarHalfDay
                  v-if="
                    !singleCalendar &&
                    format(checkIn, formattingFormat) ===
                      format(day.date, formattingFormat)
                  "
                  :day="day"
                  :is-check-in="true"
                  :is-check-out="false"
                />
                <!-- Half day for CheckOut -->
                <CalendarHalfDay
                  v-if="
                    !singleCalendar &&
                    format(checkOut, formattingFormat) ===
                      format(day.date, formattingFormat)
                  "
                  :day="day"
                  :is-check-in="false"
                  :is-check-out="true"
                />
                <!-- Half day for Booking and Periods  -->
                <CalendarHalfDay
                  v-if="
                    !singleCalendar &&
                    isInFlattenBookingDates(day) &&
                    (isInCheckinHalfDayAndCheckin(day) ||
                      isInCheckinHalfDayAndNotCheckin(day))
                  "
                  :booking-style="bookingStyle"
                  :day="day"
                  :is-check-in="true"
                  :is-check-out="false"
                />
                <CalendarHalfDay
                  v-if="
                    !singleCalendar &&
                    isInFlattenBookingDates(day) &&
                    isInCheckoutHalfDay(day)
                  "
                  :booking-style="bookingStyle"
                  :day="day"
                  :is-check-in="false"
                  :is-check-out="true"
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

      <CalendarFooter
        v-if="isDesktop && hasFooter"
        :is-mobile="isMobile"
        :locale="locale"
        @close-date-picker="closeDatePicker"
        @clear-dates="clearDates"
      >
        <template #footer>
          <slot
            name="calendar-footer"
            :clear-dates="clearDates"
            :close-date-picker="closeDatePicker"
          />
        </template>
      </CalendarFooter>
    </div>
  </div>
</template>

<style>
.vue-calendar {
  --calendar-vh: 1vh;

  --calendar-wrapper: #fff;

  --calendar-tooltip-bg: #202020;
  --calendar-tooltip-border: #202020;
  --calendar-tooltip-text: #fff;

  --calendar-half-day-color: #757575;
  --calendar-half-day-color-active: #222;

  --calendar-text-color: #202020;
  --calendar-header-days-color: #757575;

  --day-border: #fff;
  --day-checkIn-checkOut: #8ebbbb;
  --day-disabled: #aaa;
  --day-hovering-with-checkIn: #8ebbbb;
  --day-range-days: #daebeb;

  --calendar-disabled-opacity: 0.5;

  --calendar-mobile-header-border-bottom-days: #eee;

  --calendar-input-bg: #fff;
  --calendar-input-border: #f0f2f6;
  --calendar-input-shadow: 0 0 0 0.2rem #eee;

  --calendar-paginate-bg: #fff;
  --calendar-paginate-text-color: #202020;
  --calendar-paginate-border-color: #f0f2f6;

  --calendar-paginate-hover-bg: #fff;
  --calendar-paginate-hover-text: #202020;
  --calendar-paginate-hover-border: #202020;

  --calendar-paginate-disabled-bg: #ffffff;
  --calendar-paginate-disabled-border: #f0f2f6;
  --calendar-paginate-disabled-text: #f0f2f6;

  --day-today: #264646;
}

@tailwind base;
@tailwind components;

/* Global Style */
.vue-calendar {
  @apply w-full relative select-none;
}
.vue-calendar .calendar_input-open {
  box-shadow: var(--calendar-input-shadow);
}
.vue-calendar .calendar_wrapper {
  background-color: var(--calendar-wrapper);
  @apply z-20;
}
.vue-calendar .calendar_wrapper:not(.calendar_wrapper--year) {
  @apply p-6 md:shadow-md md:absolute md:top-[100%];
}
.vue-calendar
  .calendar_wrapper:not(.calendar_wrapper--affix)
  .calendar_wrapper_content {
  @apply grid md:grid-cols-2 md:gap-12;
}
.vue-calendar .calendar_wrapper_content-days {
  @apply grid grid-cols-7;
}
.vue-calendar .calendar_day-wrap {
  @apply relative h-0 pb-[100%] border-[.5px];
  border-color: var(--day-border);
}
.vue-calendar .calendar_day-wrap--no-border {
  @apply border-0 pointer-events-none;
}
.vue-calendar .calendar_day-wrap--disabled {
  @apply pointer-events-none;
}
.vue-calendar .calendar_day {
  @apply w-full left-0 right-0 h-full text-[16px] absolute focus:outline-none overflow-hidden;
}
.vue-calendar .calendar_day--today:after {
  content: "";
  @apply block w-1 h-1 rounded-full absolute bottom-1 left-0 right-0 mx-auto;
  background-color: var(--day-today);
}
.vue-calendar .calendar_day--hovering:not(.calendar_day--checkIn),
.vue-calendar .calendar_day_between--checkIn-checkOut {
  background-color: var(--day-range-days);
}
.vue-calendar .calendar_day-in-half-day--checkIn {
  @apply pointer-events-none hover:bg-white;
}
.vue-calendar .calendar_day-in-half-day--checkIn .calendar_day--day-number,
.vue-calendar
  .calendar_day-in-half-day--checkOut:not(.calendar_day--checkIn)
  .calendar_day--day-number {
  @apply font-bold;
  color: var(--calendar-half-day-color);
}
.vue-calendar .calendar_day--checkIn--single {
  background-color: var(--day-range-days);
}
.vue-calendar
  .calendar_day--hovering-checkIn:not(.calendar_day-in-half-day--checkIn) {
  background-color: var(--day-hovering-with-checkIn);
}
.vue-calendar
  .calendar_day--hovering-checkIn.calendar_day-in-half-day--checkIn {
  background-color: var(--day-hovering-with-checkIn);
}
.vue-calendar .calendar_day--is-a-day-period {
  font-weight: bold;
  color: #202020;
}
.vue-calendar .calendar_day--day-number {
  @apply absolute z-[6] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2;
  color: var(--calendar-text-color);
}
.vue-calendar
  .calendar_day-wrap--disabled
  .calendar_day:not(.calendar_day--booking)
  .calendar_day--day-number {
  @apply pointer-events-none font-[400] line-through;
  color: var(--day-disabled);
}
.vue-calendar
  .calendar_day-wrap--disabled
  .calendar_day.calendar_day--booking
  .calendar_day--day-number {
  @apply pointer-events-none font-[400];
}
.vue-calendar .calendar_day--in-period .calendar_day--day-number {
  @apply pointer-events-none font-[400];
  color: var(--day-disabled);
}
.vue-calendar .event-none {
  @apply pointer-events-none;
}
/* Year calendar */
.vue-calendar .calendar_wrapper--year {
  @apply w-full;
}
.vue-calendar .calendar_wrapper_content--year {
  @apply grid grid-cols-4 gap-x-6 gap-y-6;
}

.vue-calendar .calendar_paginate-wrapper {
  @apply my-8 flex items-center;
}
.vue-calendar .calendar_paginate-wrapper--left-content {
  @apply flex items-center;
}
.vue-calendar .calendar_paginate-button {
  @apply duration-300 w-[48px] h-[48px] border flex items-center justify-center;
  background-color: var(--calendar-paginate-bg);
  border-color: var(--calendar-paginate-border-color);
  color: var(--calendar-paginate-text-color);
}
.vue-calendar .calendar_paginate-button:disabled {
  background-color: var(--calendar-paginate-disabled-bg);
  border-color: var(--calendar-paginate-disabled-border);
  color: var(--calendar-paginate-disabled-text);
}
.vue-calendar .calendar_paginate-year {
  @apply w-20 h-[48px] flex text-center font-bold px-4 border border-gray-200 mx-3 items-center justify-center;
}
.vue-calendar .calendar_today-button {
  @apply h-[48px] flex text-center font-bold px-4 border border-gray-200 mx-3 items-center justify-center;
}
.vue-calendar .calendar_day-wrap--disabled .calendar_day--booking {
  @apply pointer-events-auto line-through;
}

/* Position */
.vue-calendar .calendar_wrapper--right {
  @apply right-0 left-auto;
}
.vue-calendar .calendar_wrapper--left {
  @apply right-auto left-auto;
}

/* Single */
.vue-calendar .calendar_wrapper--single .calendar_wrapper_content {
  @apply block;
}

/* Disabled */
.vue-calendar--disabled {
  opacity: var(--calendar-disabled-opacity);
  @apply pointer-events-none;
}
.calendar_wrapper_month {
  @apply pb-6 text-center text-[14px] md:py-0 font-bold capitalize;
}
/* Desktop style */
@screen md {
  .vue-calendar
    .calendar_wrapper:not(.calendar_wrapper--year):not(
      .calendar_wrapper--affix
    ) {
    @apply w-[780px];
  }
  .vue-calendar .calendar_wrapper.calendar_wrapper--single {
    @apply w-[380px];
  }
  .vue-calendar .calendar_today-button:hover {
    background-color: var(--calendar-paginate-hover-bg);
    border-color: var(--calendar-paginate-hover-border);
    color: var(--calendar-today-text);
  }
  .vue-calendar .calendar_paginate-button:hover {
    background-color: var(--calendar-paginate-hover-bg);
    border-color: var(--calendar-paginate-hover-border);
    color: var(--calendar-paginate-hover-text);
  }
  .vue-calendar
    .calendar_wrapper:not(.calendar_wrapper--affix)
    .calendar_wrap_month:first-child {
    @apply relative
    after:content-['']
    after:block
    after:h-[calc(100%+1.5rem)]
    after:w-px
    after:bg-gray-200
    after:absolute
    after:bottom-0
    after:left-[calc(100%+1.5rem)]
    after:-translate-x-1/2;
  }
}

/* Affix style */
.vue-calendar .calendar_wrapper.calendar_wrapper--affix {
  @apply p-0 fixed top-0 left-0 right-0;
  min-height: calc(var(--vh, 1vh) * 100);
}
.vue-calendar
  .calendar_wrapper.calendar_wrapper--affix
  .calendar_wrapper_content {
  height: calc(100vh - 100px - var(--vh, 1vh));
}
.vue-calendar
  .calendar_wrapper.calendar_wrapper--affix
  .calendar_wrapper_content {
  @apply overflow-y-auto p-4;
}
</style>

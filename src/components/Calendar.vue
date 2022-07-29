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
  watch,
  watchEffect,
  toRef,
} from "vue";
import type { ComputedRef, PropType, Ref } from "vue";

import { format, formatUtc, isAfterOrEqual } from "../plugins/day";
import BaseIcon from "./BaseIcon.vue";
import CalendarDays from "./CalendarDays.vue";
import CalendarHeader from "./CalendarHeader.vue";
import CalendarInput from "./CalendarInput.vue";

import { getMonth, getYear } from "../plugins/day";

import {
  addDays,
  getDatesBetweenTwoDates,
  getDaysArray,
  getMonthDiff,
  getNextDay,
  isDateAfter,
  isDateBefore,
  convertHexToRGBA,
  isDateBeforeOrEqual,
  substractDays,
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
  CheckInCheckOutHalfDay,
  CurrentPeriod,
  Day,
  FlatBooking,
  Month,
  Period,
  Placeholder,
} from "~/types";

const props = defineProps({
  alwaysVisible: {
    type: Boolean,
    default: false,
  },
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
    type: [Date, String],
    default: null,
  },
  checkOut: {
    type: [Date, String],
    default: null,
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
  minNights: {
    type: Number,
    default: 1,
  },
  showYear: {
    type: Boolean,
    default: false,
  },
  showInputCalendar: {
    type: Boolean,
    default: true,
  },
  startDate: {
    type: Date,
    default: new Date(new Date().getFullYear() - 2, 0, 1),
  },
  locale: {
    type: String,
    default: "fr",
  },
  translations: {
    type: Object,
    default: () => ({
      fr: {
        today: "Aujourd'hui",
        periodType: {
          weeklyBySaturday: "Du samedi au samedi uniquement",
          weeklyBySunday: "Du dimanche au dimanche uniquement",
          weeklyByMonday: "Du lundi au lundi uniquement",
          nightly: `Un minimum de %{minimumDuration} nuit est requis.`,
        },
      },
      en: {
        today: "Today",
        periodType: {
          weeklyBySaturday: "From Saturday to Saturday",
          weeklyBySunday: "From Sunday to Sunday",
          weeklyByMonday: "From Monday to Monday",
          nightly: `A minimum of %{minimumDuration} night is required.`,
        },
      },
    }),
  },
});

const t = (key: string, minimumDuration = null): string => {
  const translation = props.translations[props.locale];

  if (key.includes(".")) {
    const a = key.split(".");

    const translationValue = translation[a[0]][a[1]];
    if (translationValue.includes("%{minimumDuration}")) {
      return translationValue.replace("%{minimumDuration}", minimumDuration);
    }

    return translationValue;
  } else {
    return translation[key];
  }
};

const emit = defineEmits([
  "update:checkIn",
  "update:checkOut",
  "select-booking-date",
  "render-previous-month",
  "render-next-month",
]);

const formattingFormat = ref("YYYY-MM-DD");
const today = ref(new Date());
const months = ref([]) as Ref<Month[]>;

// Format checkIn, checkOut with correct UTC
if (props.checkIn && props.checkOut) {
  emit("update:checkIn", formatUtc(props.checkIn), false);
  emit("update:checkOut", formatUtc(props.checkOut), false);
}

const paginateToToday = (): void => {
  const today = new Date();
  const todayMonth = getMonth(today);
  const currentYear = getYear(today);
  const startYear = getYear(props.startDate);

  const numberOfYears =
    currentYear - startYear > 0 ? currentYear - startYear : 0;

  const numberOfMonth = props.showYear
    ? numberOfYears * 12
    : numberOfYears * 12 + todayMonth;

  activeIndex.value = Math.floor(numberOfMonth);
};

const activeIndex = ref(0);
paginateToToday();

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

watch(
  () => props.showYear,
  () => {
    paginateToToday();
  }
);

onBeforeMount(() => {
  if (!props.alwaysVisible) addClickOusideListener();
});

onUnmounted(() => {
  if (!props.alwaysVisible) removeClickOusideListener();
});

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
  return useGetPeriod(
    sortedPeriodDates,
    "weekly_by_saturday",
    formattingFormat.value
  );
});
const sundayWeeklyPeriods = computed(() => {
  return useGetPeriod(
    sortedPeriodDates,
    "weekly_by_sunday",
    formattingFormat.value
  );
});
const mondayWeeklyPeriods = computed(() => {
  return useGetPeriod(
    sortedPeriodDates,
    "weekly_by_monday",
    formattingFormat.value
  );
});
const nightlyPeriods = computed(() => {
  return useGetPeriod(sortedPeriodDates, "nightly", formattingFormat.value);
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

const setHalfDayStyle = (formatDay: string, key: string) => {
  if (
    bookingStyle.value.value[formatDay] &&
    typeof bookingStyle.value.value[formatDay] === "object" &&
    (bookingStyle.value.value[formatDay].checkIn ||
      bookingStyle.value.value[formatDay].checkOut)
  ) {
    return {
      background: bookingStyle.value.value[formatDay][key],
      border: "1px solid white",
    };
  } else if (bookingStyle.value.value[formatDay]) {
    return { background: bookingStyle.value.value[formatDay], border: "" };
  } else {
    return {
      background: "",
      border: "",
    };
  }
};

watchEffect(() => {
  checkIncheckOutHalfDay = useCheckIncheckOutHalfDay(
    bookingDatesT.value,
    bookedDatesT.value
  );

  months.value.forEach((m) => {
    m.days.forEach((day: Day) => {
      day.style = {
        background: !checkIncheckOutHalfDay.value[day.formatDay]
          ? convertHexToRGBA(bookingStyle.value.value[day.formatDay], 50)
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
    emit("render-previous-month");
  }
  if (operator === "+") {
    activeIndex.value += count;
    emit("render-next-month");
  }
};

const currentPeriod: Ref<CurrentPeriod | null> = ref(null);
const hoveringDates: Ref<string[]> = ref([]);
const hoveringDay: Ref<Date | null> = ref(new Date());
const hoveringPeriod: Ref<CurrentPeriod> | Ref<null> = ref(null);
const nextDisableBookingDate: Ref<Date | null> = ref(null);

const nextPeriod: Ref<CurrentPeriod | null> = ref(null);
const lastEnableDaysOfPeriod = ref(null);
const nextPeriodDisableDates = ref([]);
const dynamicNightCounts = ref(0);
const checkInPeriod = ref({});

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
      currentPeriod: CurrentPeriod,
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
      nextPeriodDisableDates.value = nextPeriodDisableDates.value.map(
        (x) => new Date(x)
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
        dynamicNightCounts.value = nextPeriod.value.minimumDurationNights;
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

      if (nextPeriodIsPriority({}, minNightCount.value)) {
        dynamicNightCounts.value = nextPeriod.value.minimumDurationNights;
        checkInPeriod.value = { ...nextPeriod.value };

        setDisabledDays();
      } else {
        dynamicNightCounts.value = 0;
      }
    }
  }
};

const tooltipText: ComputedRef<string> = computed(() => {
  if (hoveringPeriod.value) {
    const { minimumDuration, periodType } = hoveringPeriod.value;

    if (periodType === "weekly_by_saturday") {
      return t("periodType.weeklyBySaturday");
    }
    if (periodType === "weekly_by_sunday") {
      return t("periodType.weeklyBySunday");
    }
    if (periodType === "weekly_by_monday") {
      return t("periodType.weeklyByMonday");
    }
    if (periodType === "nightly") {
      return t("periodType.nightly", minimumDuration);
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
// const inNextPeriodDisabledDates = (day: Day): boolean => {
//   console.log(nextPeriodDisableDates.value);

//   return nextPeriodDisableDates.value.includes(day.formatDay);
// };

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

const inWeeklyPeriodsCheckin = (day: Day) => {
  const isAfterNexteEnableDate = isAfterOrEqual(
    day.date,
    currentPeriod.value?.nextEnableDate
  );

  if (props.checkIn !== day.date && !isAfterNexteEnableDate) {
    if (currentPeriod.value?.periodType === "weekly_by_saturday") {
      return (
        saturdayWeeklyPeriods.value.includes(day.formatDay) &&
        day.date.getDay() === 6
      );
    } else if (currentPeriod.value?.periodType === "weekly_by_sunday") {
      return (
        sundayWeeklyPeriods.value.includes(day.formatDay) &&
        day.date.getDay() === 0
      );
    } else if (currentPeriod.value?.periodType === "weekly_by_monday") {
      return (
        mondayWeeklyPeriods.value.includes(day.formatDay) &&
        day.date.getDay() === 1
      );
    }
  }

  return false;
};

const inNightlyPeriod = (day: Day) => {
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

const removeTooltip = () => {
  hoveringPeriod.value = null;
};
const dayMouseLeave = () => {
  hoveringDay.value = new Date();
  removeTooltip();
};

const setCheckIn = (day) => {
  emit("update:checkIn", day.date);
  getNextBookingDate(day);
  setMinimumDuration(day.date);
  const cp = getCurrentPeriod(day);
  currentPeriod.value = cp;
  hoveringDates.value = [];
  hoveringPeriod.value = cp;
};

const clearHoveringDates = () => {
  hoveringPeriod.value = [];
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
  emit("select-booking-date", day, getBooking(day), e);

  const disabledClicked =
    Boolean(checkIncheckOutHalfDay.value[day.formatDay]?.checkIn) &&
    Boolean(props.checkIn) &&
    !props.checkOut;

  const disabledClickedIfCheckInCheckOutHalfday =
    checkIncheckOutHalfDay.value[day.formatDay]?.checkIn &&
    checkIncheckOutHalfDay.value[day.formatDay]?.checkOut;

  if (disabledClickedIfCheckInCheckOutHalfday) return;

  if (isInBookingDates(day) && !disabledClicked) return;

  if (props.checkIn === day.date) {
    // CheckIn when already CheckIn
    emit("update:checkIn", null);
    emit("update:checkOut", null);
    clearDataWhenDateIsNull();
  } else if (
    (props.checkIn && !props.checkOut) ||
    (isInBookingDates(day) &&
      isInCheckinHalfDayAndCheckin(day) &&
      props.checkIn)
  ) {
    // CheckIn + !ChecKout
    emit("update:checkOut", day.date);
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
    emit("update:checkOut", null);
  }
};
// // Récupère la prochaine date de booking
const getNextBookingDate = (day: Day) => {
  if (newBookingDates.value.length > 0) {
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
const isInBookingDates = (day: Day) => {
  return (
    flatBookingDates.value.value.some((x) => x.value.includes(day.formatDay)) &&
    day.belongsToThisMonth &&
    !isInCheckoutHalfDay(day)
  );
};
const isInCheckinHalfDayAndCheckin = (day: Day): boolean => {
  return (
    Boolean(checkIncheckOutHalfDay.value[day.formatDay]?.checkIn) &&
    Boolean(props.checkIn)
  );
};
const isInCheckinHalfDayAndNotCheckin = (day: Day): boolean => {
  return (
    Boolean(checkIncheckOutHalfDay.value[day.formatDay]?.checkIn) &&
    Boolean(!props.checkIn)
  );
};
const isInCheckoutHalfDay = (day: Day): boolean => {
  return Boolean(checkIncheckOutHalfDay.value[day.formatDay]?.checkOut);
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
const getBookingType = (day: Day): string | null => {
  return getBooking(day)?.key || null;
};
</script>

<template>
  <div ref="calendarRef" class="vue-calendar">
    <CalendarInput
      v-if="showInputCalendar"
      :placeholder="placeholder"
      :check-in="checkIn"
      :check-out="checkOut"
      :day-format="dayFormat"
      @open-calendar="openCalendar"
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
            @click="paginateToToday"
          >
            {{ t("today") }}
          </button>
        </div>

        <slot name="header"></slot>
      </div>
    </div>

    <div
      v-if="showCalendar"
      :class="['calendar_wrapper', { 'calendar_wrapper--year': alwaysVisible }]"
    >
      <CalendarHeader
        v-if="!alwaysVisible"
        :active-index="activeIndex"
        :months="months"
        @paginate="paginate"
      />

      <div
        :class="[
          'calendar_wrapper_content',
          {
            'calendar_wrapper_content--year': showYear,
          },
        ]"
      >
        <div v-for="month in slicedMonths" :key="month.monthKey">
          <span v-if="alwaysVisible" class="font-bold">
            {{ month.monthName }}
          </span>

          <CalendarDays />

          <div class="calendar_wrapper_content-days">
            <div
              v-for="day in month.days"
              :key="day.formatDay"
              :class="[
                'calendar_day-wrap',
                // Color date
                getBookingType(day)
                  ? `calendar_day--${getBookingType(day)}`
                  : '',
                {
                  'calendar_day-wrap--no-border': !day.belongsToThisMonth,
                  'calendar_day-wrap--disabled': inDisabledDay(day),
                },
              ]"
              :data-testid="`daywrap-${format(day.date, formattingFormat)}`"
              @mouseenter="dayMouseOver(day)"
              @mouseleave="dayMouseLeave"
            >
              <div
                v-if="
                  !isInBookingDates(day) &&
                  day.belongsToThisMonth &&
                  hoveringDay === day.date &&
                  hoveringPeriod
                "
                class="calendar_tooltip"
                @mouseenter="removeTooltip"
              >
                {{ tooltipText }}
              </div>

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
                  // CheckIn or CheckOut
                  {
                    'calendar_day--checkIn-checkOut':
                      format(checkIn, formattingFormat) ===
                        format(day.date, formattingFormat) ||
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
                      (!checkIn &&
                        checkIn !== day.date &&
                        hoveringDay === day.date) ||
                      hoveringDates.includes(day.formatDay),
                  },
                  {
                    'calendar_day_between--checkIn-checkOut':
                      datesBetweenCheckInCheckOutDates.includes(day.formatDay),
                  },
                  {
                    'calendar_day--hovering-checkIn':
                      checkIn && hoveringDay === day.date,
                  },
                  // Inactive saturday period
                  {
                    'calendar_day--in-period': inWeeklyPeriods(day),
                  },
                  // CheckIn saturday / sunday / monday period
                  {
                    'calendar_day--in-period-checkIn':
                      inWeeklyPeriodsCheckin(day) || inNightlyPeriod(day),
                  },
                ]"
                :data-testid="`day-${format(day.date, formattingFormat)}`"
                @click="dayClicked(day, $event)"
              >
                <i
                  v-if="
                    isInCheckinHalfDayAndCheckin(day) ||
                    isInCheckinHalfDayAndNotCheckin(day)
                  "
                  :style="setHalfDayStyle(day.formatDay, 'checkIn')"
                  :class="[
                    'calendar_day_haldDay',
                    {
                      'calendar_day_haldDay--checkIn':
                        isInCheckinHalfDayAndCheckin(day) ||
                        isInCheckinHalfDayAndNotCheckin(day),
                    },
                  ]"
                />
                <i
                  v-if="isInCheckoutHalfDay(day)"
                  :style="setHalfDayStyle(day.formatDay, 'checkOut')"
                  :class="[
                    'calendar_day_haldDay',
                    {
                      'calendar_day_haldDay--checkOut':
                        isInCheckoutHalfDay(day),
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
.vue-calendar {
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

.vue-calendar {
  @apply w-full relative select-none;
}
.vue-calendar .calendar_wrapper {
  @apply w-full md:w-[600px];
  background-color: var(--calendar-wrapper);
}
.vue-calendar .calendar_wrapper:not(.calendar_wrapper--year) {
  @apply p-4 shadow-md absolute top-[100%];
}
.vue-calendar .calendar_wrapper_content {
  @apply grid grid-cols-2 gap-4;
}
.vue-calendar .calendar_wrapper_content:not(.calendar_wrapper_content--year) {
  @apply max-w-[780px];
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
.vue-calendar .calendar_day-wrap--disabled .calendar_day {
  background-color: var(--day-disabled);
  @apply pointer-events-none font-extralight;
}
.vue-calendar .calendar_tooltip {
  @apply absolute top-full left-1/2 transform -translate-x-1/2 shadow-sm border p-3 text-xs z-20 text-center w-max;
  width: max-content;
  max-width: 150px;
  border-color: var(--calendar-tooltip-border);
  background-color: var(--calendar-tooltip-bg);
}
.vue-calendar .calendar_day {
  @apply w-full left-0 right-0 h-full text-sm absolute focus:outline-none overflow-hidden;
}
.vue-calendar .calendar_day--today {
  @apply border-2;
  border-color: var(--day-today);
}
.vue-calendar .calendar_day--checkIn-checkOut,
.vue-calendar .calendar_day--checkIn-checkOut.calendar_day--hovering {
  background-color: var(--day-checkIn-checkOut);
}
.vue-calendar .calendar_day--hovering,
.vue-calendar .calendar_day_between--checkIn-checkOut {
  background-color: var(--day-range-days);
}
.vue-calendar .calendar_day--hovering-checkIn {
  background-color: var(--day-hovering-with-checkIn);
}
.vue-calendar .calendar_day--in-period {
  @apply pointer-events-none font-extralight;
}
.vue-calendar .calendar_day--in-period-checkIn {
  @apply pointer-events-none font-extralight;
}
.vue-calendar .calendar_day--day-number {
  @apply absolute z-[6] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2;
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
  @apply mb-8 flex items-center;
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
.vue-calendar .calendar_paginate-button:hover {
  background-color: var(--calendar-paginate-hover-bg);
  border-color: var(--calendar-paginate-hover-border);
  color: var(--calendar-paginate-hover-text);
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
.vue-calendar .calendar_today-button:hover {
  background-color: var(--calendar-paginate-hover-bg);
  border-color: var(--calendar-paginate-hover-border);
  color: var(--calendar-today-text);
}
.vue-calendar .calendar_day-wrap--disabled .calendar_day--booking {
  @apply pointer-events-auto;
}
/* New */
.vue-calendar .calendar_day_haldDay {
  @apply w-[200%] h-[200%] absolute transform rotate-45;
}
.vue-calendar .calendar_day_haldDay--checkIn {
  top: 0px;
  right: -140%;
}
.vue-calendar .calendar_day_haldDay--checkOut {
  top: -140%;
  right: 0;
}
</style>

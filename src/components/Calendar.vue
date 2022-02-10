<template>
  <div ref="calendarRef" class="calendar">
    <calendar-input
      v-if="showInputCalendar"
      :placeholder="placeholder"
      :check-in="checkIn"
      :check-out="checkOut"
      :day-format="dayFormat"
      @open-calendar="openCalendar"
    />

    <div v-if="showYear" class="calendar_paginate-wrapper">
      <button
        :disabled="disabledPagination.left"
        class="calendar_paginate-button"
        @click="paginate('-')"
      >
        <base-icon name="chevronLeft" />
      </button>
      <span class="calendar_paginate-year">{{ currentYear }}</span>
      <button
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
      <calendar-header
        v-if="!showYear"
        :active-index="activeIndex"
        :months="months"
        @paginate="paginate"
      />

      <div class="calendar_wrapper_content">
        <div v-for="month in slicedMonths" :key="month.monthKey">
          <span v-if="showYear" class="font-bold">{{ month.monthName }}</span>

          <calendar-days />

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
                  day.belongsToThisMonth &&
                  hoveringDay === day.date &&
                  hoveringPeriod
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
                      (!checkIn &&
                        checkIn !== day.date &&
                        hoveringDay === day.date) ||
                      hoveringDates.includes(day.formatDay),
                  },
                  {
                    'calendar_day--hovering-checkIn':
                      checkIn && hoveringDay === day.date,
                  },
                  // Inactive saturday period
                  {
                    'calendar_day--in-period': inWeeklyPeriods(day),
                  },
                  // CheckIn saturday / sunday period
                  {
                    'calendar_day--in-period-checkIn':
                      inWeeklyPeriodsCheckin(day),
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

<script lang="ts">
  import {
    defineComponent,
    computed,
    ComputedRef,
    PropType,
    ref,
    Ref,
  } from 'vue'

  import { format } from 'fecha'

  import BaseIcon from './BaseIcon.vue'

  import CalendarDays from './CalendarDays.vue'
  import CalendarHeader from './CalendarHeader.vue'
  import CalendarInput from './CalendarInput.vue'

  import {
    addDays,
    getDatesBetweenTwoDates,
    getMonthDiff,
    isDateAfter,
    isDateBefore,
    validateDateBetweenTwoDates,
  } from './helpers'

  import {
    useBookingStyle,
    useCheckIncheckOutHalfDay,
    useCreateHalfDayDates,
    useCreateMonth,
    useCreateMultipleMonths,
    useFlatBooking,
    useGetPeriod,
    useToggleCalendar,
  } from './compose'
  import { getNextBookingDate } from './getNextBookingDate'

  import {
    Booking,
    BookingColor,
    CurrentPeriod,
    Day,
    FlatBooking,
    Month,
    Period,
    Placeholder,
  } from '@/types'

  export default defineComponent({
    name: 'Calendar',
    components: {
      BaseIcon,
      CalendarDays,
      CalendarHeader,
      CalendarInput,
    },
    props: {
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
        default: 'YYYY-MM-DD',
      },
      periodDates: {
        type: Array as PropType<Period[]>,
        default: (): Period[] => [],
      },
      placeholder: {
        type: Object as PropType<Placeholder>,
        default: (): Placeholder => ({
          checkIn: 'Arrivée',
          checkOut: 'Départ',
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
    },
    emits: [
      'update:checkIn',
      'update:checkOut',
      'select-booking-date',
      'renderPreviousMonth',
      'renderNextMonth',
    ],
    setup(props, { emit }) {
      const formattingFormat = ref('YYYY-MM-DD')
      const today = ref(new Date())
      const months = ref([]) as Ref<Month[]>

      const createStartActiveIndex = () => {
        if (props.showYear) {
          return (
            getMonthDiff(props.startDate, new Date()) - new Date().getMonth()
          )
        }

        return getMonthDiff(props.startDate, new Date()) - 1
      }
      const activeIndex = ref(createStartActiveIndex())

      // Current month of the current day
      months.value.push(useCreateMonth(props.startDate))

      // Next 12 month after the current day
      const countOfMonth = getMonthDiff(props.startDate, props.endDate) + 11
      const multipleMonths = useCreateMultipleMonths(
        props.startDate,
        countOfMonth
      )
      months.value.push(...multipleMonths)

      const { calendarRef, openCalendar, showCalendar } =
        useToggleCalendar(props)

      // Create array of disabledDates for each types of period
      const saturdayWeeklyPeriods = computed(() => {
        return useGetPeriod(
          props.periodDates,
          'weekly_by_saturday',
          formattingFormat.value
        )
      })
      const sundayWeeklyPeriods = computed(() => {
        return useGetPeriod(
          props.periodDates,
          'weekly_by_sunday',
          formattingFormat.value
        )
      })
      const nightlyPeriods = computed(() => {
        return useGetPeriod(
          props.periodDates,
          'nightly',
          formattingFormat.value
        )
      })

      const bookingDatesT = props.bookingDates as unknown as Booking[]
      const bookedDatesT = props.bookedDates as unknown as string[]
      const bookingColorT = props.bookingColor as unknown as BookingColor

      let { disabledDates, newBookingDates } = useCreateHalfDayDates(
        bookingDatesT,
        bookedDatesT,
        bookingColorT,
        formattingFormat
      )
      const bookingStyle = useBookingStyle(
        bookingDatesT,
        bookingColorT,
        formattingFormat
      )
      const flatBookingDates = useFlatBooking(
        bookingDatesT,
        bookingColorT,
        formattingFormat
      )
      const checkIncheckOutHalfDay = useCheckIncheckOutHalfDay(
        bookingDatesT,
        bookedDatesT
      )

      // Add style on days
      months.value.forEach((m) => {
        m.days.forEach((day: Day) => {
          day.style = {
            background: !checkIncheckOutHalfDay.value[day.formatDay]
              ? bookingStyle.value[day.formatDay]
              : '',
          }
        })
      })

      const currentYear: ComputedRef<number> = computed(() => {
        return months.value[activeIndex.value].yearKey
      })

      const disabledPagination: ComputedRef<{ left: boolean; right: boolean }> =
        computed(() => {
          const diff = props.showYear ? 12 : 2

          return {
            left: activeIndex.value === 0,
            right: activeIndex.value >= months.value.length - diff,
          }
        })

      const paginate = (operator: string) => {
        const count = props.showYear ? 12 : 1

        if (operator === '-') {
          activeIndex.value -= count
          emit('renderPreviousMonth')
        }
        if (operator === '+') {
          activeIndex.value += count
          emit('renderNextMonth')
        }

        if (operator === '+' || props.showYear) {
          const res = useCreateHalfDayDates(
            bookingDatesT,
            bookedDatesT,
            bookingColorT,
            formattingFormat
          )

          disabledDates = res.disabledDates
          newBookingDates = res.newBookingDates
        }
      }

      return {
        activeIndex,
        bookingStyle,
        calendarRef,
        checkIncheckOutHalfDay,
        currentYear,
        disabledDates,
        disabledPagination,
        flatBookingDates,
        formattingFormat,
        months,
        newBookingDates,
        nightlyPeriods,
        openCalendar,
        paginate,
        saturdayWeeklyPeriods,
        showCalendar,
        sundayWeeklyPeriods,
        today,
      }
    },
    data() {
      return {
        currentPeriod: null as CurrentPeriod | null,
        hoveringDates: [] as string[],
        hoveringDay: new Date() as Date,
        hoveringPeriod: null as CurrentPeriod | null,
        nextDisableBookingDate: null as Date | null,
      }
    },
    computed: {
      tooltipText(): string {
        if (this.hoveringPeriod) {
          const { periodType } = this.hoveringPeriod
          const { minimumDuration } = this.hoveringPeriod

          if (periodType === 'weekly_by_saturday') {
            return 'Du samedi au samedi<br/> uniquement'
          }
          if (periodType === 'weekly_by_sunday') {
            return 'Du dimanche au dimanche<br/> uniquement'
          }
          if (periodType === 'nightly') {
            return `Un minimum de ${minimumDuration}<br/> nuit est requis.`
          }
        }

        return ''
      },
      formatToday(): string {
        return format(this.today, this.formattingFormat)
      },
      slicedMonths(): Month[] {
        const count = this.showYear ? 12 : 2

        return this.months.slice(this.activeIndex, count + this.activeIndex)
      },
    },
    methods: {
      isDateAfter,
      isDateBefore,
      dayFormat(date: Date): string {
        return format(date, this.formatDate)
      },
      // Trigger each time the mouseOver is triggered
      inWeeklyPeriods(day: Day) {
        return (
          (this.saturdayWeeklyPeriods.includes(day.formatDay) &&
            day.date.getDay() !== 6) ||
          (this.sundayWeeklyPeriods.includes(day.formatDay) &&
            day.date.getDay() !== 0)
        )
      },
      inWeeklyPeriodsCheckin(day: Day) {
        return (
          this.checkIn !== day.date &&
          this.currentPeriod?.nextEnableDate > day.date &&
          (this.currentPeriod?.periodType === 'weekly_by_saturday' ||
            this.currentPeriod?.periodType === 'weekly_by_sunday') &&
          (this.saturdayWeeklyPeriods.includes(day.formatDay) ||
            this.sundayWeeklyPeriods.includes(day.formatDay)) &&
          (day.date.getDay() === 6 || day.date.getDay() === 0)
        )
      },
      inNightlyPeriod(day: Day) {
        return (
          this.checkIn !== day.date &&
          this.currentPeriod?.nextEnableDate > day.date &&
          this.currentPeriod?.periodType === 'nightly' &&
          this.nightlyPeriods.includes(day.formatDay)
        )
      },
      inDisabledDay(day: Day) {
        return (
          (this.disabledDaysBeforeDayDate &&
            day.formatDay !== this.formatToday &&
            this.today > day.date) ||
          isDateBefore(day.date, this.checkIn) ||
          (this.disabledDates.includes(day.formatDay) &&
            !this.checkIncheckOutHalfDay[day.formatDay]) ||
          (this.checkIn &&
            this.nextDisableBookingDate &&
            isDateAfter(day.date, this.nextDisableBookingDate))
        )
      },
      dayMouseOver(day: Day) {
        this.hoveringDay = day.date
        if (this.inWeeklyPeriods(day) || this.inNightlyPeriod(day)) {
          this.hoveringPeriod = this.getCurrentPeriod(day)
        }
        if (this.checkIn && !this.checkOut) {
          this.hoveringDates = getDatesBetweenTwoDates(
            this.checkIn,
            this.hoveringDay,
            this.formattingFormat
          )
        }
      },
      dayMouseLeave() {
        this.hoveringDay = new Date()
        this.hoveringPeriod = null
      },
      // Trigger each time the click on day is triggered
      dayClicked(day: Day): void {
        if (this.isInBookingDates(day)) {
          this.$emit('select-booking-date', day, this.getBooking(day))
        } else if (this.checkIn === day.date) {
          // CheckIn when already CheckIn
          this.$emit('update:checkIn', null)
          this.$emit('update:checkOut', null)
          this.nextDisableBookingDate = null
          this.currentPeriod = null
          this.hoveringDates = []
        } else if (this.checkIn && !this.checkOut) {
          // CheckIn + !ChecKout
          this.$emit('update:checkOut', day.date)
          this.nextDisableBookingDate = null
          this.currentPeriod = null
        } else if (!this.checkIn) {
          // CheckIn
          this.$emit('update:checkIn', day.date)
          this.getNextBookingDate(day)
          this.currentPeriod = this.getCurrentPeriod(day)
        } else {
          // CheckIn + CheckOut
          this.$emit('update:checkIn', day.date)
          this.$emit('update:checkOut', null)
          this.getNextBookingDate(day)
          this.currentPeriod = this.getCurrentPeriod(day)
          this.hoveringDates = []
        }
      },
      // Récupère la prochaine date de booking
      getNextBookingDate(day: Day) {
        if (this.newBookingDates.length > 0) {
          let newDate = day.date
          if (this.checkIncheckOutHalfDay[day.formatDay]?.checkOut) {
            newDate = addDays(day.date, 1)
          }

          this.nextDisableBookingDate = getNextBookingDate(
            this.newBookingDates,
            newDate
          )
        }
      },
      getCurrentPeriod(day: Day) {
        const currentPeriod = this.periodDates.find((period: Period) => {
          if (
            period.endAt !== day.formatDay &&
            (period.startAt === day.formatDay ||
              validateDateBetweenTwoDates(
                period.startAt,
                period.endAt,
                day.formatDay
              ))
          ) {
            return period
          }
        })

        if (currentPeriod) {
          const durationType =
            currentPeriod.periodType === 'weekly_by_saturday' ||
            currentPeriod.periodType === 'weekly_by_sunday'
              ? 'week'
              : 'day'
          const minimumDuration =
            durationType === 'week'
              ? currentPeriod.minimumDuration * 7
              : currentPeriod.minimumDuration

          return {
            ...currentPeriod,
            nextEnableDate: addDays(day.date, minimumDuration),
          }
        }

        return null
      },
      isInBookingDates(day: Day) {
        return (
          this.flatBookingDates.some((x) => x.value.includes(day.formatDay)) &&
          day.belongsToThisMonth &&
          !this.isInCheckoutHalfDay(day)
        )
      },
      isInCheckinHalfDayAndCheckin(day: Day) {
        return (
          this.checkIncheckOutHalfDay[day.formatDay]?.checkIn && this.checkIn
        )
      },
      isInCheckinHalfDayAndNotCheckin(day: Day) {
        return (
          this.checkIncheckOutHalfDay[day.formatDay]?.checkIn && !this.checkIn
        )
      },
      isInCheckoutHalfDay(day: Day) {
        return this.checkIncheckOutHalfDay[day.formatDay]?.checkOut
      },
      getBooking(day: Day): FlatBooking | null {
        if (
          this.flatBookingDates.some((b) => b.value.includes(day.formatDay)) &&
          day.belongsToThisMonth
        ) {
          const flatBooking = this.flatBookingDates.find((b) =>
            b.value.includes(day.formatDay)
          )

          if (flatBooking) {
            return flatBooking
          }
        }

        return null
      },
      getBookingType(day: Day): string | null {
        return this.getBooking(day)?.key || null
      },
    },
  })
</script>

<style>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  .calendar {
    @apply w-full relative select-none;
  }
  .calendar_wrapper {
    @apply bg-white w-full md:w-[600px];
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
    @apply relative h-0 pb-[100%] border-[.5px] border-gray-200;
  }
  .calendar_day-wrap--no-border {
    @apply border-0 pointer-events-none;
  }
  .calendar_day-wrap--disabled {
    @apply pointer-events-none;
  }
  .calendar_tooltip {
    @apply absolute top-full bg-white left-1/2 transform -translate-x-1/2 shadow-sm border border-gray-200 p-3 text-xs z-20 text-center w-max;
  }
  .calendar_day {
    @apply w-full left-0 right-0 h-full text-sm absolute focus:outline-none overflow-hidden;
  }
  .calendar_day--today {
    @apply border-2 border-blue-500;
  }
  .calendar_day--checkIn-checkOut {
    @apply bg-blue-500;
  }
  .calendar_day--disabled {
    @apply bg-gray-100 pointer-events-none font-extralight;
  }
  .calendar_day--hovering {
    @apply bg-blue-300;
  }
  .calendar_day--hovering-checkIn {
    @apply bg-blue-500;
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
    @apply p-4 border border-gray-200 hover:bg-gray-100 duration-300 disabled:bg-gray-100 disabled:text-gray-400;
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

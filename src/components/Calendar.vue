<template>
  <div ref="Calendar" class="calendar">
    <calendar-input
      v-if="showInputCalendar"
      :placeholder="placeholder"
      :check-in="checkIn"
      :check-out="checkOut"
      :day-format="dayFormat"
      @open-calendar="openCalendar"
    />

    <div>
      <button @click="paginate('-')">
        <base-icon name="chevronLeft" />
      </button>

      <button @click="paginate('+')">
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
          <template v-if="showYear">{{ month.monthName }}</template>

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
  import { defineComponent, PropType, ref, Ref, computed } from 'vue'

  import { format } from 'fecha'

  import BaseIcon from './BaseIcon.vue'

  import CalendarDays from './CalendarDays.vue'
  import CalendarHeader from './CalendarHeader.vue'
  import CalendarInput from './CalendarInput.vue'

  import {
    addDays,
    getDatesBetweenTwoDates,
    getDayDiff,
    getMonthDiff,
    isDateAfter,
    isDateBefore,
    sortDates,
    sortDatesObj,
    validateDateBetweenTwoDates,
  } from './helpers'

  import {
    useCreateMonth,
    useCreateMultipleMonths,
    useGetPeriod,
  } from './compose'
  import { getNextBookingDate } from './getNextBookingDate'

  import {
    Booking,
    BookingColor,
    CheckInCheckOutHalfDay,
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
    setup(props) {
      const formattingFormat = ref('YYYY-MM-DD')
      const year = new Date().getFullYear()
      const today = props.showYear ? ref(new Date(year, 0, 1)) : ref(new Date())
      const months = ref([]) as Ref<Month[]>

      const countOfMonth = getMonthDiff(props.startDate, props.endDate)
      const activeIndex = ref(getMonthDiff(props.startDate, new Date()) - 1)

      // Current month of the current day
      months.value.push(useCreateMonth(props.startDate))

      // Next 12 month after the current day
      const multipleMonths = useCreateMultipleMonths(
        props.startDate,
        countOfMonth
      )
      months.value.push(...multipleMonths)

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

      return {
        activeIndex,
        formattingFormat,
        months,
        nightlyPeriods,
        saturdayWeeklyPeriods,
        sundayWeeklyPeriods,
        today,
      }
    },
    data() {
      return {
        bookingStyle: {} as { [key: string]: string },
        checkIncheckOutHalfDay: {} as CheckInCheckOutHalfDay,
        currentPeriod: null as CurrentPeriod | null,
        disabledDates: [] as string[],
        flatBookingDates: [] as FlatBooking[],
        hoveringDates: [] as string[],
        hoveringDay: new Date() as Date,
        hoveringPeriod: null as CurrentPeriod | null,
        nextDisableBookingDate: null as Date | null,
        newBookingDates: [] as Booking[],
        showCalendar: true as boolean,
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
        const count = this.showYear ? 12 : 1

        return this.months.slice(this.activeIndex, count + this.activeIndex)
      },
    },
    beforeMount() {
      if (this.bookingDates.length > 0 || this.bookedDates.length > 0)
        this.createHalfDayDates()

      document.addEventListener('click', this.handleClickOutside, false)
    },
    unmounted() {
      document.removeEventListener('click', this.handleClickOutside)
    },
    methods: {
      isDateAfter,
      isDateBefore,
      paginate(operator: string) {
        const count = this.showYear ? 12 : 1

        if (operator === '-') {
          this.activeIndex -= count
          this.$emit('renderPreviousMonth')
        }
        if (operator === '+') {
          this.activeIndex += count
          this.$emit('renderNextMonth')
          this.createHalfDayDates()
        }
      },
      dayFormat(date: Date): string {
        return format(date, this.formatDate)
      },
      handleClickOutside(event: MouseEvent & { target: HTMLElement }) {
        const ignoredElement = this.$refs.Calendar as HTMLElement

        if (ignoredElement && this.showCalendar) {
          const isIgnoredElementClicked = ignoredElement.contains(event.target)

          if (!isIgnoredElementClicked) {
            this.showCalendar = false
          }
        }
      },
      openCalendar() {
        this.showCalendar = !this.showCalendar
      },
      // Create halfDayDates
      createHalfDayDatesWithBookedDates(dates: string[]): {
        checkIncheckOutHalfDay: CheckInCheckOutHalfDay
        bookedDates: string[]
      } {
        const checkIncheckOutHalfDay: CheckInCheckOutHalfDay = {}
        const bookedDates = sortDates([...dates])

        for (let i = 0; i < bookedDates.length; i++) {
          const newDate = bookedDates[i] as string
          const newDateIncrementOne = bookedDates[i + 1] as string

          if (i === 0) {
            checkIncheckOutHalfDay[newDate] = {
              checkIn: true,
            }
          }

          if (
            !checkIncheckOutHalfDay[newDate] &&
            bookedDates[i + 1] &&
            getDayDiff(newDate, newDateIncrementOne) > 1
          ) {
            checkIncheckOutHalfDay[newDate] = {
              checkOut: true,
            }
            checkIncheckOutHalfDay[newDateIncrementOne] = {
              checkIn: true,
            }
          }

          if (i === bookedDates.length - 1) {
            checkIncheckOutHalfDay[newDate] = {
              checkOut: true,
            }
          }
        }

        return {
          checkIncheckOutHalfDay,
          bookedDates,
        }
      },
      createBookingDatesWithHalfDayDates(
        checkIncheckOutHalfDay: CheckInCheckOutHalfDay
      ): PropType<Booking[]> {
        const bookingDates = new Set() as Set<Booking>
        let increment = 0 as number
        let booking = {} as Booking

        Object.keys(checkIncheckOutHalfDay).forEach(
          (date: string, i: number) => {
            increment = i

            if (checkIncheckOutHalfDay[date].checkIn) booking.checkInDate = date
            if (checkIncheckOutHalfDay[date].checkOut)
              booking.checkOutDate = date

            if (increment % 2 === 1) {
              bookingDates.add({
                checkInDate: booking.checkInDate,
                checkOutDate: booking.checkOutDate,
              })
            }
          }
        )

        return sortDatesObj([...this.bookingDates, ...bookingDates])
      },
      createHalfDayDates() {
        let checkIncheckOutHalfDay: CheckInCheckOutHalfDay = {}
        let bookedDates = [] as string[]

        // Create halfDay dates with booked dates
        const res = this.createHalfDayDatesWithBookedDates(this.bookedDates)
        checkIncheckOutHalfDay = res.checkIncheckOutHalfDay
        bookedDates = res.bookedDates

        // Create bookingDates with halfDay
        this.newBookingDates = this.createBookingDatesWithHalfDayDates(
          checkIncheckOutHalfDay
        )

        // Set DisabledDates to []
        this.flatBookingDates = []
        this.disabledDates = []

        // Field DisabledDates whith BookingDates
        const bookingTypeAndDates: {
          [key: string]: string[]
        } = {}
        // Tamere
        this.bookingDates.forEach((booking: Booking) => {
          checkIncheckOutHalfDay[booking.checkInDate] = {
            checkIn: true,
          }
          checkIncheckOutHalfDay[booking.checkOutDate] = {
            checkOut: true,
          }

          const flatBookingDate = getDatesBetweenTwoDates(
            new Date(booking.checkInDate),
            new Date(booking.checkOutDate),
            this.formattingFormat
          )

          if (booking.type) {
            if (bookingTypeAndDates[booking.type]) {
              bookingTypeAndDates[booking.type].push(...flatBookingDate)
            } else {
              bookingTypeAndDates[booking.type] = flatBookingDate
            }
          }
        })

        const objectArray = Object.entries(bookingTypeAndDates)

        objectArray.forEach(([key, value]) => {
          this.flatBookingDates.push({
            color: this.bookingColor[key] || '#000000',
            key,
            value,
          })

          value.forEach((day) => {
            this.bookingStyle[day] = this.bookingColor[key] || '#000000'
          })
        })

        // Field DisabledDates whith BookedDates
        this.disabledDates = this.flatBookingDates.map((b) => b.value).flat()
        this.disabledDates.push(...bookedDates)
        this.disabledDates = sortDates(this.disabledDates)

        this.checkIncheckOutHalfDay = checkIncheckOutHalfDay

        // Add style on days
        this.months.forEach((m) => {
          m.days.forEach((day) => {
            day.style = {
              background: !this.checkIncheckOutHalfDay[day.formatDay]
                ? this.bookingStyle[day.formatDay]
                : '',
            }
          })
        })
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
          (day.formatDay !== this.formatToday && this.today > day.date) ||
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
    @apply p-4 bg-white shadow-md absolute w-full md:w-[600px] top-[100%];
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
    @apply w-full left-0 right-0 h-full absolute focus:outline-none overflow-hidden font-bold;
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
    @apply grid grid-cols-4 gap-4;
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

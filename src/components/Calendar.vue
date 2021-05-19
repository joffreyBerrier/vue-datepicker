<template>
  <div ref="Calendar" class="w-full relative select-none">
    <div
      class="
        flex
        items-center
        h-[50px]
        cursor-pointer
        px-4
        border border-gray-200
      "
      @click="openCalendar"
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
          @click="paginate('-')"
        >
          <base-icon name="chevronLeft" />
        </button>

        <p class="text-center py-2">{{ months[activeIndex].monthName }}</p>
        <p class="text-center py-2">{{ months[activeIndex + 1].monthName }}</p>

        <button
          :disabled="activeIndex >= months.length - 2"
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
          @click="paginate('+')"
        >
          <base-icon name="chevronRight" />
        </button>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div v-for="month in slicedMonths" :key="month.monthKey">
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
                      (day.formatDay !== formatToday && today > day.date) ||
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
                      (!checkIn &&
                        checkIn !== day.date &&
                        hoveringDay === day.date) ||
                      hoveringDates.includes(day.formatDay),
                  },
                  {
                    'bg-blue-500': checkIn && hoveringDay === day.date,
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
                    'day-in-period':
                      (saturdayWeeklyPeriods.includes(day.formatDay) &&
                        day.date.getDay() !== 6) ||
                      (sundayWeeklyPeriods.includes(day.formatDay) &&
                        day.date.getDay() !== 0),
                  },
                  // CheckIn saturday / sunday period
                  {
                    'checkIn-in-period':
                      checkIn !== day.date &&
                      currentPeriod?.nextEnableDate > day.date &&
                      (currentPeriod?.periodType === 'weekly_by_saturday' ||
                        currentPeriod?.periodType === 'weekly_by_sunday') &&
                      (saturdayWeeklyPeriods.includes(day.formatDay) ||
                        sundayWeeklyPeriods.includes(day.formatDay)) &&
                      (day.date.getDay() === 6 || day.date.getDay() === 0),
                  },
                  // CheckIn nightly period
                  {
                    'checkIn-in-period':
                      checkIn !== day.date &&
                      currentPeriod?.nextEnableDate > day.date &&
                      currentPeriod?.periodType === 'nightly' &&
                      nightlyPeriods.includes(day.formatDay),
                  },
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
  import { defineComponent, PropType, ref, computed } from 'vue'

  import { format } from 'fecha'

  import BaseIcon from './BaseIcon.vue'

  import {
    addDays,
    getDatesBetweenTwoDates,
    getDayDiff,
    isDateAfter,
    isDateBefore,
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
    CheckInCheckOutHalfDay,
    CurrentPeriod,
    Day,
    Month,
    Period,
    Placeholder,
  } from '../types/index'

  export default defineComponent({
    name: 'Calendar',
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
      countOfMonth: {
        type: Number,
        default: 24,
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
    },
    emits: [
      'update:checkIn',
      'update:checkOut',
      'renderPreviousMonth',
      'renderNextMonth',
    ],
    setup(props) {
      const formattingFormat = ref('YYYY-MM-DD')

      const today = ref(new Date())
      const months = ref([])
      // Current month of the current day
      months.value.push(useCreateMonth(today.value))

      // Next 12 month after the current day
      const multipleMonths = useCreateMultipleMonths(
        today.value,
        props.countOfMonth
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
        activeIndex: 0 as number,
        checkIncheckOutHalfDay: {} as CheckInCheckOutHalfDay,
        currentPeriod: null as CurrentPeriod | null,
        disabledDates: [] as string[],
        hoveringDates: [] as string[],
        hoveringDay: new Date() as Date,
        nextDisableBookingDate: null as Date | null,
        newBookingDates: [] as Booking[],
        showCalendar: true as boolean,
      }
    },
    computed: {
      formatToday(): string {
        return format(this.today, this.formattingFormat)
      },
      slicedMonths(): Month[] {
        return this.months.slice(this.activeIndex, 2 + this.activeIndex)
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
        if (operator === '-') {
          this.activeIndex--
          this.$emit('renderPreviousMonth')
        }
        if (operator === '+') {
          this.activeIndex++
          this.$emit('renderNextMonth')
          this.createHalfDayDates()
        }
      },
      dayFormat(date: Date): string {
        return format(date, this.formatDate)
      },
      handleClickOutside(event: Event) {
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
      createHalfDayDatesWithBookedDates(
        dates: string[]
      ): CheckInCheckOutHalfDay {
        const checkIncheckOutHalfDay = {} as CheckInCheckOutHalfDay
        const bookedDates = [...dates]

        for (let i = 0; i < bookedDates.length; i++) {
          const newDate = bookedDates[i]
          const newDateIncrementOne = bookedDates[i + 1]

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

        return [...this.bookingDates, ...bookingDates].sort((a, b) => {
          const aa = a.checkInDate.split('/').reverse().join()
          const bb = b.checkInDate.split('/').reverse().join()

          return aa < bb ? -1 : aa > bb ? 1 : 0
        })
      },
      createHalfDayDates() {
        let checkIncheckOutHalfDay = {} as CheckInCheckOutHalfDay
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
        this.disabledDates = []

        // Field DisabledDates whith BookingDates
        this.bookingDates.forEach((booking: Booking) => {
          checkIncheckOutHalfDay[booking.checkInDate] = {
            checkIn: true,
          }
          checkIncheckOutHalfDay[booking.checkOutDate] = {
            checkOut: true,
          }

          this.disabledDates.push(
            ...getDatesBetweenTwoDates(
              new Date(booking.checkInDate),
              new Date(booking.checkOutDate),
              this.formattingFormat
            )
          )
        })

        // Field DisabledDates whith BookedDates
        this.disabledDates.push(...bookedDates)
        this.disabledDates.sort((a, b) => {
          const aa = a.split('/').reverse().join()
          const bb = b.split('/').reverse().join()

          return aa < bb ? -1 : aa > bb ? 1 : 0
        })

        this.checkIncheckOutHalfDay = checkIncheckOutHalfDay
      },
      // Trigger each time the mouseOver is triggered
      dayMouseOver(day: Day) {
        this.hoveringDay = day.date

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
      },
      // Trigger each time the click on day is triggered
      dayClicked(day: Day) {
        if (this.checkIn === day.date) {
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
          this.getCurrentPeriod(day)
        } else {
          // CheckIn + CheckOut
          this.$emit('update:checkIn', day.date)
          this.$emit('update:checkOut', null)
          this.getNextBookingDate(day)
          this.getCurrentPeriod(day)
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
              period.periodType === 'weekly_by_saturday' ||
              period.periodType === 'weekly_by_sunday'
                ? 'week'
                : 'day'
            const minimumDuration =
              durationType === 'week'
                ? period.minimumDuration * 7
                : period.minimumDuration

            this.currentPeriod = {
              ...period,
              nextEnableDate: addDays(day.date, minimumDuration),
            }
          }
        })
      },
    },
  })
</script>

<style>
  .half-day_checkin:before,
  .half-day_checkOut:before {
    content: '';
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
  .day-in-period {
    @apply pointer-events-none font-extralight;
  }
  .checkIn-in-period {
    @apply pointer-events-none font-extralight;
  }
</style>

<template>
  <div class="w-full h-full flex items-center justify-center">
    <Calendar
      v-model:checkIn="checkIn"
      v-model:checkOut="checkOut"
      :booking-color="bookingColor"
      :booked-dates="bookedDates"
      :period-dates="periodDates"
      :booking-dates="bookingDates"
      :show-year="true"
      :show-input-calendar="false"
      @render-next-month="renderNextMonth"
      @select-booking-date="clickOnDate"
    />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import Calendar from './components/Calendar.vue'
  import { Booking, Period } from './types'

  export default defineComponent({
    name: 'App',
    components: {
      Calendar,
    },
    data() {
      return {
        bookedDates: [] as string[],
        bookingColor: {
          admin: '#9dc1c9',
          contract: '#a56a0b',
        },
        bookingDates: [
          {
            checkInDate: '2022-07-01',
            checkOutDate: '2022-07-10',
            type: 'admin',
          },
          {
            checkInDate: '2022-08-01',
            checkOutDate: '2022-08-20',
            type: 'contract',
          },
          {
            checkInDate: '2022-10-01',
            checkOutDate: '2022-10-20',
            type: 'contract',
          },
        ] as Booking[],
        periodDates: [] as Period[],
        checkIn: null,
        checkOut: null,
        nextBookedDates: [] as string[],
      }
    },
    methods: {
      clickOnDate(day, currentBooking) {
        console.log(day, currentBooking)
      },
      renderNextMonth() {
        if (this.bookedDates.length === 6)
          this.bookedDates.push(...this.nextBookedDates)
      },
    },
  })
</script>

<template>
  <div class="w-full h-full flex items-center justify-center">
    <Calendar
      v-model:checkIn="checkIn"
      v-model:checkOut="checkOut"
      :booked-dates="bookedDates"
      :period-dates="periodDates"
      :booking-dates="bookingDates"
      :show-year="true"
      :show-input-calendar="false"
      @renderNextMonth="renderNextMonth"
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

<style>
  .calendar_day--contract .calendar_day.calendar_day--booking {
    background: #9dc1c9;
  }
  .calendar_day--contract .calendar_day--half-day_checkin:before {
    border-bottom-color: #9dc1c9;
  }
  .calendar_day--contract .calendar_day--half-day_checkOut:before {
    border-top-color: #9dc1c9;
  }

  .calendar_day--admin .calendar_day.calendar_day--booking {
    background: #a56a0b;
  }
  .calendar_day--admin .calendar_day--half-day_checkin:before {
    border-bottom-color: #a56a0b;
  }
  .calendar_day--admin .calendar_day--half-day_checkOut:before {
    border-top-color: #a56a0b;
  }
</style>

<template>
  <div class="w-full h-full flex items-center justify-center">
    <Calendar
      v-model:checkIn="checkIn"
      v-model:checkOut="checkOut"
      :booked-dates="bookedDates"
      :period-dates="periodDates"
      :booking-dates="bookingDates"
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
        bookedDates: [
          '2021-06-01',
          '2021-06-02',
          '2021-06-03',
          '2021-06-23',
          '2021-06-24',
          '2021-06-25',
        ] as string[],
        bookingDates: [
          {
            checkInDate: '2021-05-01',
            checkOutDate: '2021-05-10',
            type: 'admin',
          },
          {
            checkInDate: '2021-06-10',
            checkOutDate: '2021-06-20',
            type: 'contract',
          },
        ] as Booking[],
        periodDates: [
          {
            startAt: '2021-07-01',
            endAt: '2021-08-01',
            minimumDuration: 7,
            periodType: 'nightly',
          },
          {
            startAt: '2021-08-01',
            endAt: '2021-09-05',
            minimumDuration: 2,
            periodType: 'weekly_by_saturday',
          },
          {
            startAt: '2021-09-05',
            endAt: '2021-10-04',
            minimumDuration: 4,
            periodType: 'nightly',
          },
          {
            startAt: '2021-10-04',
            endAt: '2021-11-29',
            minimumDuration: 2,
            periodType: 'weekly_by_sunday',
          },
        ] as Period[],
        checkIn: null,
        checkOut: null,
      }
    },
  })
</script>

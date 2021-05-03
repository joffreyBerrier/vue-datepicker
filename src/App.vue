<template>
  <div class="w-full h-full flex items-center justify-center">
    <Calendar
      v-model:checkIn="checkIn"
      v-model:checkOut="checkOut"
      :bookedDates="bookedDates"
      :booking-dates="bookingDates"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Calendar from './components/Calendar.vue'

export default defineComponent({
  name: 'App',
  components: {
    Calendar
  },
  data() {
    return {
      bookedDates: ['2021-06-01', '2021-06-02', '2021-06-03', '2021-06-23', '2021-06-24', '2021-06-25'],
      bookingDates: [{
        checkInDate: "2021-05-01",
        checkInTime: 17,
        checkOutDate: "2021-05-10",
        checkOutTime: 10,
        type: "admin"
      },
      {
        checkInDate: "2021-06-10",
        checkInTime: 17,
        checkOutDate: "2021-06-20",
        checkOutTime: 10,
        type: "contract"
      }],
      checkIn: null,
      checkOut: null
    }
  }
})
</script>

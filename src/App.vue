<template>
  <Calendar
    v-model:checkIn="checkIn"
    v-model:checkOut="checkOut"
    :has-day-checkIn="true"
    :booking-dates="bookingDates"
  />
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
      checkIn: new Date(),
      checkOut: new Date()
    }
  }
})
</script>

<template>
  <Calendar v-model:checkIn="checkIn" v-model:checkOut="checkOut"/>
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
      checkIn: null,
      checkOut: null
    }
  }
})
</script>

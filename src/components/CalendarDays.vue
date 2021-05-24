<template>
  <ul class="calendar_wrapper_content-header-days">
    <li v-for="day in days" :key="day.key">
      {{ day.name }}
    </li>
  </ul>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'CalendarDays',
    data() {
      return {
        days: [
          { key: 1, name: 'Mo' },
          { key: 2, name: 'Tu' },
          { key: 3, name: 'We' },
          { key: 4, name: 'Th' },
          { key: 5, name: 'Fr' },
          { key: 6, name: 'Sa' },
          { key: 0, name: 'Su' },
        ],
      }
    },
  })
</script>

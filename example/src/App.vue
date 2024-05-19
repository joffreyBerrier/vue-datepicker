<script setup lang="ts">
import { ref } from 'vue'

import type { Period } from '../src/types'

const periodDates = ref<Period[]>([
  // Nightly
  {
    startAt: '2024-08-01',
    endAt: '2024-08-31',
    minimumDuration: 4,
    periodType: 'nightly'
  },
  // Weekly Saturday
  {
    startAt: '2024-09-01',
    endAt: '2024-09-30',
    minimumDuration: 2,
    periodType: 'nightly'
  },
  // Weekly Sunday
  {
    startAt: '2024-11-01',
    endAt: '2024-11-29',
    minimumDuration: 1,
    periodType: 'nightly'
  }
])

const bookedDates = ref([
  '2024-06-01',
  '2024-06-02',
  '2024-06-03',
  '2024-06-23',
  '2024-06-24',
  '2024-06-25'
])
const checkIn = ref(new Date('2024-05-01'))
const checkOut = ref(new Date('2024-05-10'))
</script>

<template>
  <p>
    <strong>periodDates:</strong>
    <pre>{{ periodDates }}</pre>
  </p>
  <p>
    <strong>bookedDates:</strong>
    <pre>{{ bookedDates }}</pre>
  </p>
  <DatePicker
    v-model:checkIn="checkIn"
    v-model:checkOut="checkOut"
    :period-dates="periodDates"
    :bookedDates="bookedDates"
    locale="en"
  />
</template>

<style>
@import "../../dist/style.css";
</style>

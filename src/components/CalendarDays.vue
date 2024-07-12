<script setup lang="ts">
import { computed, ref, inject } from 'vue'

import type { HeaderDay } from '../types'

interface Props {
  locale?: string
}
const props = withDefaults(defineProps<Props>(), {
  locale: 'en'
})

const t = inject('t', (key: string) => ({}))

const listOfDays = ref<HeaderDay[]>([
  { key: 1, name: 'monday' },
  { key: 2, name: 'tuesday' },
  { key: 3, name: 'wednesday' },
  { key: 4, name: 'thursday' },
  { key: 5, name: 'friday' },
  { key: 6, name: 'saturday' },
  { key: 0, name: 'sunday' }
])

const days = computed<HeaderDay[]>(() => {
  const copyListOfDays = JSON.parse(JSON.stringify(listOfDays.value)) as HeaderDay[]

  if (props.locale === 'en') return copyListOfDays.sort((a, b) => a.key - b.key)

  return listOfDays.value
})
</script>

<template>
  <ul
    class="vuedatepicker-pl-0 vuedatepicker-grid vuedatepicker-grid-cols-7 vuedatepicker-pt-5 vuedatepicker-pb-1.5"
  >
    <li
      v-for="day in days"
      :key="day.key"
      class="calendar-days vuedatepicker-text-[14px] vuedatepicker-text-center"
    >
      {{ t(`days.${day.name}`) }}.
    </li>
  </ul>
</template>

<style>
.vue-calendar .calendar-days {
  color: var(--calendar-header-days-color);
}
</style>

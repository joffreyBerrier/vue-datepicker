<script setup lang="ts">
import type { Day } from '../types'

interface Props {
  bookingStyle: Record<string, string | { checkIn: string; checkOut: string }>
  day: Day
  isCheckIn: boolean
  isCheckOut: boolean
}
const props = withDefaults(defineProps<Props>(), {
  isCheckIn: true,
  isCheckOut: true
})

const setHalfDayStyle = (formatDay: string): { background: string; border: string } => {
  const key = props.isCheckIn ? 'checkIn' : 'checkOut'

  if (props.bookingStyle) {
    const bookingColor = props.bookingStyle[formatDay]

    if (
      bookingColor &&
      typeof bookingColor === 'object' &&
      (bookingColor.checkIn || bookingColor.checkOut)
    ) {
      return {
        background: bookingColor[key],
        border: '1px solid white'
      }
    } else if (typeof bookingColor === 'string') {
      return {
        background: bookingColor,
        border: ''
      }
    }
  }

  return {
    background: '',
    border: ''
  }
}
</script>

<template>
  <i
    :style="setHalfDayStyle(day.formatDay)"
    :class="[
      'calendar_day_haldDay',
      {
        'calendar_day_haldDay--checkIn': isCheckIn,
        'calendar_day_haldDay--checkOut': isCheckOut
      }
    ]"
  />
</template>

<style scoped>
/* Half day */
.vue-calendar .calendar_day_haldDay {
  @apply w-[200%] h-[200%] absolute transform rotate-45;
}
.vue-calendar .calendar_day_haldDay--checkIn {
  top: 0px;
  right: -140%;
  background: var(--day-disabled);
}
.vue-calendar .calendar_day_haldDay--checkOut {
  top: -140%;
  right: 0;
  background: var(--day-disabled);
}
.vue-calendar .calendar_day--checkIn .calendar_day_haldDay--checkIn {
  background: var(--day-checkIn-checkOut);
}
.vue-calendar .calendar_day--checkOut .calendar_day_haldDay--checkOut {
  background: var(--day-checkIn-checkOut);
}
</style>

<script setup lang="ts">
import type { Placeholder } from '../types'

import BaseIcon from './BaseIcon.vue'

const emit = defineEmits(['clear-dates', 'open-calendar'])
interface Props {
  checkIn: Date | string | null
  checkOut: Date | string | null
  dayFormat: Function
  placeholder: Placeholder
  singleCalendar: boolean
}
const props = withDefaults(defineProps<Props>(), {
  checkIn: null,
  checkOut: null,
  singleCalendar: false
})

const calendarIconClass = () => {
  let baseIconClass = 'calendar_input-calendar'
  if (props.checkIn) {
    baseIconClass += ' calendar_input-calendar--checkIn'
  } else {
    baseIconClass += ' calendar_input-calendar--hasnt-checkIn'
  }

  return baseIconClass
}
const arrowIconClass = () => {
  let baseIconClass = 'calendar_input-arrowRight'
  if (props.checkIn) {
    baseIconClass += ' calendar_input-arrowRight--checkIn'
  } else {
    baseIconClass += ' calendar_input-arrowRight--hasnt-checkIn'
  }

  return baseIconClass
}
const openCalendar = () => {
  emit('open-calendar')
}
const clearDates = () => {
  emit('clear-dates')
}
</script>

<template>
  <div class="calendar_input">
    <div data-testid="calendar_input" class="calendar_input-left-part" @click="openCalendar">
      <base-icon name="calendar" :size="1.5" :color="calendarIconClass()" />

      <p class="calendar_input-text">
        <span
          data-testid="checkIn"
          :class="[
            {
              'calendar_input-text--hasnt-checkIn': !checkIn,
              'calendar_input-text--checkIn': checkIn
            }
          ]"
        >
          <template v-if="checkIn">
            {{ dayFormat(checkIn) }}
          </template>
          <template v-else>{{ placeholder.checkIn }}</template>
        </span>

        <template v-if="!singleCalendar">
          <base-icon name="arrowRight" :size="1" :color="arrowIconClass()" />

          <span
            data-testid="checkOut"
            :class="[
              {
                'calendar_input-text--hasnt-checkIn': !checkIn,
                'calendar_input-text--checkIn': checkIn
              }
            ]"
          >
            <template v-if="checkOut">
              {{ dayFormat(checkOut) }}
            </template>
            <template v-else>{{ placeholder.checkOut }}</template>
          </span>
        </template>
      </p>
    </div>

    <base-icon v-if="checkIn" name="close" :size="1" @click="clearDates" />
  </div>
</template>

<style>
.vue-calendar .calendar_input {
  background-color: var(--calendar-input-bg);
  border-color: var(--calendar-input-border);
  border-style: solid;
  @apply vuedatepicker-flex vuedatepicker-items-center vuedatepicker-h-[50px] vuedatepicker-px-4 vuedatepicker-cursor-pointer vuedatepicker-border vuedatepicker-justify-between;
}
.vue-calendar .calendar_input-left-part {
  @apply vuedatepicker-w-full vuedatepicker-flex vuedatepicker-items-center vuedatepicker-h-full;
}
.vue-calendar .calendar_input-calendar {
  @apply vuedatepicker-mr-2;
}
.vue-calendar .calendar_input-calendar--checkIn {
  @apply vuedatepicker-text-gray-700;
}

.vue-calendar .calendar_input-text {
  @apply vuedatepicker-flex vuedatepicker-items-center vuedatepicker-m-0;
}
.vue-calendar .calendar_input-text--hasnt-checkIn,
.vue-calendar .calendar_input-calendar--hasnt-checkIn,
.vue-calendar .calendar_input-arrowRight--hasnt-checkIn {
  color: #aaa;
}
.vue-calendar .calendar_input-text--checkIn {
  @apply vuedatepicker-text-gray-700;
}

.vue-calendar .calendar_input-arrowRight {
  @apply vuedatepicker-mx-4;
}
.vue-calendar .calendar_input-arrowRight--checkIn {
  @apply vuedatepicker-text-gray-700;
}
</style>

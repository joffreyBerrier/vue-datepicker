<script setup lang="ts">
import { inject } from 'vue'

import BaseIcon from './BaseIcon.vue'
import CalendarDays from './CalendarDays.vue'

const emits = defineEmits(['close-date-picker', 'clear-dates'])
const t = inject('t', (key: string) => ({}))

interface Props {
  isMobile: boolean
  locale: string
}
defineProps<Props>()

const closeDatePicker = () => {
  emits('close-date-picker')
}
const clearDates = () => {
  emits('clear-dates')
}
</script>

<template>
  <div
    class="calendar_footer vuedatepicker-flex vuedatepicker-flex-col vuedatepicker-px-4 vuedatepicker-pt-4 md:vuedatepicker-px-0"
  >
    <slot name="footer">
      <div
        class="calendar_footer--button vuedatepicker-flex vuedatepicker-items-center vuedatepicker-justify-between md:vuedatepicker-justify-end vuedatepicker-px-3 md:vuedatepicker-px-0"
      >
        <button
          class="calendar_footer--button-clear vuedatepicker-text-[14px] md:vuedatepicker-pl-4 vuedatepicker-font-medium vuedatepicker-text-[#202020] vuedatepicker-underline"
          :style="{ order: isMobile ? 1 : 2 }"
          @click="clearDates"
        >
          {{ t('clearDates') }}
        </button>
        <button
          class="calendar_footer--button-close vuedatepicker-text-[#033D3D]"
          @click="closeDatePicker"
        >
          <base-icon v-if="isMobile" name="arrowLeft" :size="1" />
          <span v-else>{{ t('close') }}</span>
        </button>
      </div>

      <CalendarDays v-if="isMobile" :locale="locale" />
    </slot>
  </div>
</template>

<style>
.calendar_footer {
  border-color: var(--calendar-mobile-header-border-bottom-days);
}
</style>

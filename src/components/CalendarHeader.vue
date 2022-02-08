<template>
  <div class="calendar_header">
    <button
      :disabled="activeIndex === 0"
      class="calendar_header-left-button"
      @click="paginate('-')"
    >
      <base-icon name="chevronLeft" />
    </button>

    <p class="calendar_header-text">{{ prevMonth }}</p>
    <p class="calendar_header-text">{{ nextMonth }}</p>

    <button
      :disabled="activeIndex >= months.length - 2"
      class="calendar_header-right-button"
      @click="paginate('+')"
    >
      <base-icon name="chevronRight" />
    </button>
  </div>
</template>

<script lang="ts">
  import { defineComponent, PropType } from 'vue'

  import { Month } from '@/types'

  import BaseIcon from './BaseIcon.vue'

  export default defineComponent({
    name: 'CalendarHeader',
    components: { BaseIcon },
    props: {
      activeIndex: {
        type: Number,
        default: 0,
      },
      months: {
        type: Array as PropType<Month[]>,
        default: () => {
          return []
        },
      },
    },
    emits: ['paginate'],
    computed: {
      prevMonth(): string {
        return this.months[this.activeIndex].monthName
      },
      nextMonth(): string {
        return this.months[this.activeIndex + 1].monthName
      },
    },
    methods: {
      paginate(operator: string) {
        this.$emit('paginate', operator)
      },
    },
  })
</script>

<style>
  .calendar_header {
    @apply relative grid grid-cols-2 items-center gap-4;
  }
  .calendar_header-text {
    @apply text-center py-2;
  }
  .calendar_header-left-button {
    @apply absolute left-0 w-10 h-10 flex items-center justify-center border border-gray-200 focus:outline-none disabled:opacity-50 disabled:pointer-events-none;
  }
  .calendar_header-right-button {
    @apply absolute right-0 w-10 h-10 flex items-center justify-center border border-gray-200 focus:outline-none disabled:opacity-50 disabled:pointer-events-none;
  }
</style>

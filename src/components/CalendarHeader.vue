<template>
  <div class="relative grid grid-cols-2 items-center gap-4">
    <button
      :disabled="activeIndex === 0"
      class="
        absolute
        left-0
        w-10
        h-10
        flex
        items-center
        justify-center
        border border-gray-200
        focus:outline-none
        disabled:opacity-50
      "
      @click="paginate('-')"
    >
      <base-icon name="chevronLeft" />
    </button>

    <p class="text-center py-2">{{ prevMonth }}</p>
    <p class="text-center py-2">{{ nextMonth }}</p>

    <button
      :disabled="activeIndex >= months.length - 2"
      class="
        absolute
        right-0
        w-10
        h-10
        flex
        items-center
        justify-center
        border border-gray-200
        focus:outline-none
        disabled:opacity-50
      "
      @click="paginate('+')"
    >
      <base-icon name="chevronRight" />
    </button>
  </div>
</template>

<script lang="ts">
  import { defineComponent, PropType } from 'vue'

  import { Month } from '../types/index'

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

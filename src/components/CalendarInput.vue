<template>
  <div
    class="
      flex
      items-center
      h-[50px]
      cursor-pointer
      px-4
      border border-gray-200
    "
    @click="openCalendar"
  >
    <base-icon
      name="calendar"
      :color="['mr-4', { 'text-gray-300': !checkIn, 'text-gray-700': checkIn }]"
    />

    <p class="flex items-center m-0">
      <span :class="[{ 'text-gray-300': !checkIn, 'text-gray-700': checkIn }]">
        <template v-if="checkIn">
          {{ dayFormat(checkIn) }}
        </template>
        <template v-else>{{ placeholder.checkIn }}</template>
      </span>

      <base-icon
        name="arrowNarrowRight"
        :color="[
          'mx-4',
          { 'text-gray-300': !checkIn, 'text-gray-700': checkIn },
        ]"
      />

      <span :class="[{ 'text-gray-300': !checkIn, 'text-gray-700': checkIn }]">
        <template v-if="checkOut">
          {{ dayFormat(checkOut) }}
        </template>
        <template v-else>{{ placeholder.checkOut }}</template>
      </span>
    </p>
  </div>
</template>

<script lang="ts">
  import { defineComponent, PropType } from 'vue'

  import { Placeholder } from '../types/index'

  import BaseIcon from './BaseIcon.vue'

  export default defineComponent({
    name: 'CalendarInput',
    components: { BaseIcon },
    props: {
      checkIn: {
        type: [Date, null],
        default: null,
      },
      checkOut: {
        type: [Date, null],
        default: null,
      },
      dayFormat: {
        type: Function,
        required: true,
      },
      placeholder: {
        type: Object as PropType<Placeholder>,
        required: true,
      },
    },
    emits: ['open-calendar'],
    methods: {
      openCalendar() {
        this.$emit('open-calendar')
      },
    },
  })
</script>

<template>
  <div class="calendar_input" @click="openCalendar">
    <base-icon
      name="calendar"
      :color="[
        'calendar_input-calendar',
        {
          'calendar_input-calendar--hasnt-checkIn': !checkIn,
          'calendar_input-calendar--checkIn': checkIn,
        },
      ]"
    />

    <p class="calendar_input-text">
      <span
        :class="[
          {
            'calendar_input-text--hasnt-checkIn': !checkIn,
            'calendar_input-text--checkIn': checkIn,
          },
        ]"
      >
        <template v-if="checkIn">
          {{ dayFormat(checkIn) }}
        </template>
        <template v-else>{{ placeholder.checkIn }}</template>
      </span>

      <base-icon
        name="arrowNarrowRight"
        :color="[
          'calendar_input-arrowRight',
          {
            'calendar_input-arrowRight--hasnt-checkIn': !checkIn,
            'calendar_input-arrowRight--checkIn': checkIn,
          },
        ]"
      />

      <span
        :class="[
          {
            'calendar_input-text--hasnt-checkIn': !checkIn,
            'calendar_input-text--checkIn': checkIn,
          },
        ]"
      >
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

  import { Placeholder } from '@/types'

  import BaseIcon from './BaseIcon.vue'

  export default defineComponent({
    name: 'CalendarInput',
    components: { BaseIcon },
    props: {
      checkIn: {
        type: Date,
        default: null,
      },
      checkOut: {
        type: Date,
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

<style>
  .calendar_input {
    @apply flex items-center h-[50px] cursor-pointer px-4 border border-gray-200;
  }
  .calendar_input-calendar {
    @apply mr-4;
  }
  .calendar_input-calendar--hasnt-checkIn {
    @apply text-gray-300;
  }
  .calendar_input-calendar--checkIn {
    @apply text-gray-700;
  }

  .calendar_input-text {
    @apply flex items-center m-0;
  }
  .calendar_input-text--hasnt-checkIn {
    @apply text-gray-300;
  }
  .calendar_input-text--checkIn {
    @apply text-gray-700;
  }

  .calendar_input-arrowRight {
    @apply mx-4;
  }
  .calendar_input-arrowRight--hasnt-checkIn {
    @apply text-gray-300;
  }
  .calendar_input-arrowRight--checkIn {
    @apply text-gray-700;
  }
</style>

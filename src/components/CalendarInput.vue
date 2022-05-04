<script lang="ts">
export default {
  name: "CalendarInput",
};
</script>

<script setup lang="ts">
import type { PropType } from "vue";
import type { Placeholder } from "~/types";

import BaseIcon from "./BaseIcon.vue";

const emit = defineEmits(["open-calendar"]);
defineProps({
  checkIn: {
    type: [Date, String],
    default: null,
  },
  checkOut: {
    type: [Date, String],
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
});

const openCalendar = () => {
  emit("open-calendar");
};
</script>

<template>
  <div data-testid="calendar_input" class="calendar_input" @click="openCalendar">
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
        data-testid="checkIn"
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
        data-testid="checkOut"
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

<style>
.calendar_input {
  background-color: var(--calendar-input-bg);
  border-color: var(--calendar-input-border);
  @apply flex items-center h-[50px] cursor-pointer px-4 border;
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

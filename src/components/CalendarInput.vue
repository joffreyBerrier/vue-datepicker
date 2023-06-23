<script lang="ts">
export default {
  name: "CalendarInput",
};
</script>

<script setup lang="ts">
import type { PropType } from "vue";
import type { Placeholder } from "../types";

import BaseIcon from "./BaseIcon.vue";

const emit = defineEmits(["clear-dates", "open-calendar"]);
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
  singleCalendar: {
    type: Boolean,
    default: false,
  },
});

const openCalendar = () => {
  emit("open-calendar");
};
const clearDates = () => {
  emit("clear-dates");
};
</script>

<template>
  <div data-testid="calendar_input" class="calendar_input">
    <div class="calendar_input-left-part" @click="openCalendar">
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

        <template v-if="!singleCalendar">
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
        </template>
      </p>
    </div>

    <base-icon v-if="checkIn && checkOut" name="close" @click="clearDates" />
  </div>
</template>

<style>
.vue-calendar .calendar_input {
  background-color: var(--calendar-input-bg);
  border-color: var(--calendar-input-border);
  @apply flex items-center h-[50px] px-4 cursor-pointer border justify-between;
}
.vue-calendar .calendar_input-left-part {
  @apply w-full flex items-center h-full;
}
.vue-calendar .calendar_input-calendar {
  @apply mr-4;
}
.vue-calendar .calendar_input-calendar--hasnt-checkIn {
  @apply text-gray-300;
}
.vue-calendar .calendar_input-calendar--checkIn {
  @apply text-gray-700;
}

.vue-calendar .calendar_input-text {
  @apply flex items-center m-0;
}
.vue-calendar .calendar_input-text--hasnt-checkIn {
  @apply text-gray-300;
}
.vue-calendar .calendar_input-text--checkIn {
  @apply text-gray-700;
}

.vue-calendar .calendar_input-arrowRight {
  @apply mx-4;
}
.vue-calendar .calendar_input-arrowRight--hasnt-checkIn {
  @apply text-gray-300;
}
.vue-calendar .calendar_input-arrowRight--checkIn {
  @apply text-gray-700;
}
</style>

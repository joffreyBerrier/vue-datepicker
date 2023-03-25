<script lang="ts">
export default {
  name: "CalendarDays",
};
</script>

<script setup lang="ts">
import { ref, inject } from "vue";
import type { Ref } from "vue";

import type { HeaderDay } from "../types";

const t = inject("t", (key: string) => ({}));

const days: Ref<HeaderDay[]> = ref([
  { key: 1, name: "monday" },
  { key: 2, name: "tuesday" },
  { key: 3, name: "wednesday" },
  { key: 4, name: "thursday" },
  { key: 5, name: "friday" },
  { key: 6, name: "saturday" },
  { key: 0, name: "sunday" },
]);
</script>

<template>
  <ul class="calendar_wrapper_content-header-days">
    <li v-for="day in days" :key="day.key" class="calendar-days">
      {{ t(`days.${day.name}`) }}
    </li>
  </ul>
</template>

<style>
.vue-calendar .calendar_wrapper_content-header-days {
  @apply grid grid-cols-7 text-center py-6 text-[12px] md:text-sm;
}
.vue-calendar .calendar-days {
  @apply text-[12px];
  color: var(--calendar-text-color);
}
</style>

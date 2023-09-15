<script lang="ts">
export default {
  name: "CalendarDays",
};
</script>

<script setup lang="ts">
import { computed, ref, inject, type ComputedRef } from "vue";
import type { Ref } from "vue";

import type { HeaderDay } from "../types";

const props = defineProps({
  locale: {
    type: String,
    required: true,
  },
});

const t = inject("t", (key: string) => ({}));

const listOfDays: Ref<HeaderDay[]> = ref([
  { key: 1, name: "monday" },
  { key: 2, name: "tuesday" },
  { key: 3, name: "wednesday" },
  { key: 4, name: "thursday" },
  { key: 5, name: "friday" },
  { key: 6, name: "saturday" },
  { key: 0, name: "sunday" },
]);

const days: ComputedRef<HeaderDay[]> = computed(() => {
  if (props.locale === "en")
    return listOfDays.value.sort((a, b) => a.key - b.key);

  return listOfDays.value;
});
</script>

<template>
  <ul class="calendar_wrapper_content-header-days">
    <li v-for="day in days" :key="day.key" class="calendar-days">
      {{ t(`days.${day.name}`) }}.
    </li>
  </ul>
</template>

<style>
.vue-calendar .calendar_wrapper_content-header-days {
  @apply grid grid-cols-7 pt-5 pb-1.5;
}
.vue-calendar .calendar-days {
  @apply text-[14px];
  color: var(--calendar-header-days-color);
}
</style>

<script lang="ts">
export default {
  name: "CalendarDays",
};
</script>

<script setup lang="ts">
import { ref } from "vue";
import type { Ref } from "vue";

import type { HeaderDay } from "~/types";

const days: Ref<HeaderDay[]> = ref([
  { key: 1, name: "Mo" },
  { key: 2, name: "Tu" },
  { key: 3, name: "We" },
  { key: 4, name: "Th" },
  { key: 5, name: "Fr" },
  { key: 6, name: "Sa" },
  { key: 0, name: "Su" },
]);
</script>

<template>
  <ul class="calendar_wrapper_content-header-days">
    <li v-for="day in days" :key="day.key" class="font-medium">
      {{ day.name }}
    </li>
  </ul>
</template>

<style>
.calendar_wrapper_content-header-days {
  @apply grid grid-cols-7 text-center py-6 text-sm;
}
</style>

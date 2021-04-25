<template>
  <div class="datepicker__week-row">
    <div
      class="datepicker__week-name"
      v-for="(dayName, datePickerWeekIndexMobile) in dayNames"
      :key="datePickerWeekIndexMobile"
    >
      {{ dayName }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "DatePickerWeekRow",
  props: {
    dayNames: {
      type: Array,
      default: (): string[] => [],
    },
  },
});
</script>

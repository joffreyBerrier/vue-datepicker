<script lang="ts">
export default {
  name: "CalendarHeaderMobile",
};
</script>

<script setup lang="ts">
import { inject } from "vue";

import BaseIcon from "./BaseIcon.vue";
import CalendarDays from "./CalendarDays.vue";

const emits = defineEmits(["close-date-picker", "clear-dates"]);
const t = inject("t", (key: string) => ({}));

defineProps({
  isMobile: {
    type: Boolean,
    required: true,
  },
  locale: {
    type: String,
    required: true,
  },
});

const closeDatePicker = () => {
  emits("close-date-picker");
};
const clearDates = () => {
  emits("clear-dates");
};
</script>

<template>
  <div class="calendar_footer">
    <slot name="footer">
      <div class="calendar_footer--button">
        <button
          class="calendar_footer--button-clear"
          :style="{ order: isMobile ? 1 : 2 }"
          @click="clearDates"
        >
          {{ t("clearDates") }}
        </button>
        <button class="calendar_footer--button-close" @click="closeDatePicker">
          <base-icon v-if="isMobile" name="arrowLeft" :size="1" />
          <span v-else>{{ t("close") }}</span>
        </button>
      </div>

      <CalendarDays v-if="isMobile" :locale="locale" />
    </slot>
  </div>
</template>

<style>
.calendar_footer {
  @apply flex flex-col px-4 pt-4 md:px-0;
  border-color: var(--calendar-mobile-header-border-bottom-days);
}
.calendar_footer--button {
  @apply flex items-center justify-between md:justify-end px-3 md:px-0;
}
.calendar_footer--button-close,
.calendar_footer--button-clear {
  @apply text-[14px] md:pl-4 font-medium;
}
.calendar_footer--button-clear {
  @apply text-[#202020] underline;
}
.calendar_footer--button-close {
  @apply text-[#033D3D];
}
</style>

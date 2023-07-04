<script lang="ts" setup>
import ArrowLeft from "iconoir/icons/arrow-left.svg";
import ArrowRight from "iconoir/icons/arrow-right.svg";
import Calendar from "iconoir/icons/calendar.svg";
import Cancel from "iconoir/icons/cancel.svg";
import NavArrowLeft from "iconoir/icons/nav-arrow-left.svg";
import NavArrowRight from "iconoir/icons/nav-arrow-right.svg";

defineProps({
  color: {
    type: Array,
    default: () => [],
  },
  name: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    default: "xs",
    validator: (value: string) => ["s", "xs", "xxs"].includes(value),
  },
});

const icons = {
  arrowNarrowRight: ArrowRight,
  arrowLeft: ArrowLeft,
  calendar: Calendar,
  close: Cancel,
  chevronLeft: NavArrowLeft,
  chevronRight: NavArrowRight,
};
</script>

<template>
  <img
    :src="icons[name]"
    :class="[`base-icon--${size} stroke-current`, color]"
  />
</template>

<style>
.base-icon--s {
  @apply w-8 h-8;
}
.base-icon--xs {
  @apply w-5 h-5;
}
.base-icon--xxs {
  @apply w-4 h-4;
}
</style>

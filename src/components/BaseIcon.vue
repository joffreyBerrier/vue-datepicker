<script lang="ts">
export default {
  name: "BaseIcon",
};
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { Ref, ComputedRef } from "vue";

interface Icon {
  [key: string]: string;
}

const props = defineProps({
  name: {
    type: String,
    default: "",
  },
  color: {
    type: Array,
    default: () => [],
  },
  size: {
    type: String,
    default: "xs",
    validator: (value: string) => ["s", "xs", "xxs"].includes(value),
  },
});

const paths: Ref<Icon> = ref({
  arrowLeft: "M15.75 19.5L8.25 12l7.5-7.5",
  arrowNarrowRight: "M17 8l4 4m0 0l-4 4m4-4H3",
  calendar:
    "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  chevronLeft:
    "M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z",
  chevronRight:
    "M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z",
});

const path: ComputedRef<string> | string = computed(() => {
  if (paths.value[props.name]) return paths.value[props.name];

  return "";
});
</script>

<template>
  <svg
    v-if="['chevronLeft', 'chevronRight'].includes(name)"
    :class="[`base-icon--${size} fill-current`, color]"
    fill="currentColor"
    stroke="none"
    viewBox="0 0 20 20"
  >
    <path clip-rule="evenodd" :d="path" />
  </svg>

  <svg
    v-else
    :class="[`base-icon--${size} stroke-current`, color]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      :d="path"
    />
  </svg>
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

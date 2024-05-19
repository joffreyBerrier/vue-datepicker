<script setup lang="ts">
import { computed, ref } from 'vue'

interface Icon {
  arrowLeft: string
  arrowRight: string
  calendar: string
  close: string
  chevronLeft: string
  chevronRight: string
}

interface Props {
  name: keyof Icon
  color?: string | string[]
  size?: number
}
const props = withDefaults(defineProps<Props>(), {
  size: 1.5
})

const paths = ref<Icon>({
  arrowLeft: 'M21 12H3m0 0l8.5-8.5M3 12l8.5 8.5',
  arrowRight: 'M3 12h18m0 0l-8.5-8.5M21 12l-8.5 8.5',
  calendar:
    'M15 4V2m0 2v2m0-2h-4.5M3 10v9a2 2 0 002 2h14a2 2 0 002-2v-9H3zM3 10V6a2 2 0 012-2h2M7 2v4M21 10V6a2 2 0 00-2-2h-.5',
  close: 'M6.758 17.243L12.001 12m5.243-5.243L12 12m0 0L6.758 6.757M12.001 12l5.243 5.243',
  chevronLeft: 'M15 6l-6 6 6 6',
  chevronRight: 'M9 6l6 6-6 6'
})

const path = computed<string>(() => {
  if (paths.value[props.name]) return paths.value[props.name]

  return ''
})
const strokeWidth = computed<number>(() => {
  return 24 / (props.size * 16)
})
</script>

<template>
  <svg
    :class="color"
    :style="{
      width: `${size}rem`,
      height: `${size}rem`
    }"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path clip-rule="evenodd" :d="path" />
  </svg>
</template>

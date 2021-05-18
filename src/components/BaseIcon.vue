<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
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

<script lang="ts">
  import { defineComponent, PropType } from 'vue'

  interface Icon {
    [key: string]: string
  }

  export default defineComponent({
    name: 'BaseIcon',
    props: {
      name: {
        type: String,
        default: '',
      },
      color: {
        type: Array as PropType<string[]>,
        default: (): string[] => [],
      },
      size: {
        type: String,
        default: 'xs',
        validator: (value: string) => ['xs'].includes(value),
      },
    },
    data() {
      return {
        paths: {
          calendar:
            'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
          arrowNarrowRight: 'M17 8l4 4m0 0l-4 4m4-4H3',
          chevronLeft: 'M15 19l-7-7 7-7',
          chevronRight: 'M9 5l7 7-7 7',
        } as Icon,
      }
    },
    computed: {
      path(): string {
        return this.paths[this.name]
      },
    },
  })
</script>

<style>
  .base-icon--xs {
    @apply w-5 h-5;
  }
</style>

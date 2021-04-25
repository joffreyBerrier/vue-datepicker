<template>
  <div
    :class="['datepicker__input', inputClass]"
    data-qa="datepickerInput"
    :tabindex="tabIndex"
  >
    {{ inputDate ? inputDate : i18n[inputDateType] }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "DateInput",
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    i18n: {
      type: Object,
      required: true,
    },
    inputDate: {
      type: String,
      default: "",
    },
    inputDateType: {
      type: String,
      default: "check-in",
    },
    singleDaySelection: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    inputClass(): string[] {
      const inputClass = [] as string[];
      if (this.isOpen && this.inputDate == null) {
        inputClass.push("datepicker__input--is-active");
      }
      if (this.singleDaySelection) {
        inputClass.push("datepicker__input--single-date");
      }

      return inputClass;
    },
    tabIndex(): number {
      return this.inputDateType === "check-in" ? 0 : -1;
    },
  },
});
</script>

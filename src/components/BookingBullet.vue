<template>
  <i class="parent-bullet">
    <i
      v-if="previousBooking && duplicateBookingDates.includes(formatDate)"
      :style="previousBooking.style"
      :class="[
        'bullet',
        {
          checkInCheckOut: duplicateBookingDates.includes(formatDate),
        },
      ]"
    />
    <i
      v-if="previousBooking && duplicateBookingDates.includes(formatDate)"
      class="pipe checkInCheckOut"
      :style="previousBooking.style"
    />
    <i
      v-if="
        currentBooking &&
        (currentBooking.checkInDate === formatDate ||
          currentBooking.checkOutDate === formatDate)
      "
      :style="currentBooking.style"
      :class="[
        'bullet',
        {
          checkIn: currentBooking.checkInDate === formatDate,
          checkOut: currentBooking.checkOutDate === formatDate,
        },
      ]"
    />
    <i
      v-if="currentBooking"
      :class="[
        'pipe',
        {
          checkIn: currentBooking.checkInDate === formatDate,
          checkOut: currentBooking.checkOutDate === formatDate,
        },
      ]"
      :style="currentBooking.style"
    />
  </i>
</template>

<script lang="ts">
import { defineComponent } from "vue";

interface Style {
  string: [string];
}
interface CurrentBooking {
  checkInDate: string;
  checkOutDate: string;
  style?: Style;
}
interface PreviousBooking {
  style?: Style;
}

export default defineComponent({
  name: "BookingBullet",
  props: {
    currentBooking: {
      type: Object,
      default: (): CurrentBooking => ({
        checkInDate: "",
        checkOutDate: "",
      }),
    },
    duplicateBookingDates: {
      type: Array,
      default: (): string[] => [],
    },
    formatDate: {
      type: String,
      default: "",
    },
    previousBooking: {
      type: Object,
      default: (): PreviousBooking => ({}),
    },
  },
});
</script>

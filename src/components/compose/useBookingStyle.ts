import { ref } from "vue";
import type { Ref } from "vue";

import type { Booking, BookingColor } from "~/types";
import { getDatesBetweenTwoDates } from "../helpers";

export const useBookingStyle = (
  bookingDates: Booking[],
  bookingColor: BookingColor,
  formattingFormat: Ref<string>
): Ref<Record<string, string>> => {
  const bookingStyle: Ref<Record<string, string>> = ref({});
  const bookingTypeAndDates: {
    [key: string]: string[];
  } = {};

  bookingDates.forEach((booking: Booking) => {
    const flatBookingDatesString: Ref<string[]> = ref(
      getDatesBetweenTwoDates(
        new Date(booking.checkInDate),
        new Date(booking.checkOutDate),
        formattingFormat.value
      )
    );

    if (booking.type) {
      if (bookingTypeAndDates[booking.type]) {
        bookingTypeAndDates[booking.type].push(...flatBookingDatesString.value);
      } else {
        bookingTypeAndDates[booking.type] = flatBookingDatesString.value;
      }
    }
  });

  const objectArray = Object.entries(bookingTypeAndDates) as unknown as [
    string,
    string[]
  ][];

  objectArray.forEach(([key, value]) => {
    value.forEach((day) => {
      bookingStyle.value[day] = bookingColor[key] || "#000000";
    });
  });

  return bookingStyle;
};

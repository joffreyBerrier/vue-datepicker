import { ref } from "vue";
import type { Ref } from "vue";

import type {
  Booking,
  BookingColor,
  CheckInCheckOutHalfDay,
} from "../../types";
import { getDatesBetweenTwoDates } from "../helpers";

export const useBookingStyle = (
  bookingDates: Booking[],
  bookingColor: BookingColor,
  formattingFormat: Ref<string>,
  checkIncheckOutHalfDay: Ref<CheckInCheckOutHalfDay>,
): Ref<Record<string, string | { checkIn: string; checkOut: string }>> => {
  const bookingStyle: Ref<
    Record<string, string | { checkIn: string; checkOut: string }>
  > = ref({});
  type ObjectT = {
    [key: string]: string[];
  };
  const bookingTypeAndDates: ObjectT = {};

  bookingDates.forEach((booking: Booking) => {
    const flatBookingDatesString: Ref<string[]> = ref(
      getDatesBetweenTwoDates(
        booking.checkInDate,
        booking.checkOutDate,
        formattingFormat.value,
      ),
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
    string[],
  ][];

  const setBookingStyle = (key: string, day: string) => {
    if (
      checkIncheckOutHalfDay.value[day]?.checkIn &&
      checkIncheckOutHalfDay.value[day]?.checkOut
    ) {
      const checkInType =
        bookingDates.find((x) => x.checkInDate === day)?.type || "";
      const checkOutType =
        bookingDates.find((x) => x.checkOutDate === day)?.type || "";

      return {
        checkIn:
          checkInType in bookingColor ? bookingColor[checkInType] : "#000",
        checkOut:
          checkInType in bookingColor ? bookingColor[checkOutType] : "#000",
      };
    } else {
      return bookingColor[key] || "#000000";
    }
  };

  objectArray.forEach(([key, value]) => {
    value.forEach((day) => {
      bookingStyle.value[day] = setBookingStyle(key, day);
    });
  });

  return bookingStyle;
};

import { format, formatDateUtc } from "../../plugins/day";
import { addDays } from "../helpers";

import type { ComputedRef } from "vue";
import type { Booking } from "../../types";

import { isDateBeforeOrEqual, validateDateBetweenTwoDates } from "../helpers";

const validateDateBeforeDate = (fromDate: string, givenDate: string) => {
  return isDateBeforeOrEqual(givenDate, fromDate);
};

const useGetNextBookingDate = (
  bookingDates: ComputedRef<Booking[]>,
  date: Date
): Date | null => {
  if (bookingDates.value.length > 0) {
    const nextDateFormatted = format(addDays(date, 1), "YYYY-MM-DD");
    const nextBooking = bookingDates.value.find(
      (booking) =>
        validateDateBeforeDate(booking.checkInDate, nextDateFormatted) ||
        validateDateBetweenTwoDates(
          booking.checkInDate,
          booking.checkOutDate,
          nextDateFormatted
        )
    ) as Booking | null;

    if (nextBooking && nextBooking.checkInDate) {
      return formatDateUtc(nextBooking.checkInDate);
    }
  }

  return null;
};

export { useGetNextBookingDate };

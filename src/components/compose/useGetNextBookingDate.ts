import { format } from "fecha";
import { addDays } from "../helpers";

import type { Booking } from "~/types";
import {
  resetTimeDate,
  validateDateBetweenTwoDates,
} from "../helpers";

const validateDateBeforeDate = (fromDate: string, givenDate: string) => {
  return resetTimeDate(givenDate) <= resetTimeDate(fromDate);
};

const useGetNextBookingDate = (
  bookingDates: Booking[],
  date: Date
): Date | undefined => {
  if (bookingDates.length > 0) {
    const nextDateFormatted = format(addDays(date, 1));
    const nextBooking = bookingDates.find(
      (booking) =>
        validateDateBeforeDate(booking.checkInDate, nextDateFormatted) ||
        validateDateBetweenTwoDates(
          booking.checkInDate,
          booking.checkOutDate,
          nextDateFormatted
        )
    ) as Booking | undefined;

    if (nextBooking && nextBooking.checkInDate) {
      return new Date(nextBooking.checkInDate);
    }
  }
};

export { useGetNextBookingDate };

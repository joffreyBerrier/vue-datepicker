import { format } from 'fecha';
import { addDays, isDateAfter } from './helpers';

import {
  Booking,
} from '../types/index'

const resetTimeDate = (date: string) => {
  const formatDateAt00 = new Date(date).setHours(0, 0, 0, 0);

  return new Date(formatDateAt00);
};

const validateDateBeforeDate = (fromDate: string, givenDate: string) => {
  return resetTimeDate(givenDate) <= resetTimeDate(fromDate);
}

const validateDateBetweenTwoDates = (fromDate: string, toDate: string, givenDate: string) => {
  return (
    resetTimeDate(givenDate) <= resetTimeDate(toDate) &&
    resetTimeDate(givenDate) >= resetTimeDate(fromDate)
  );
}

const nextBookingDate = (bookingDates: Booking[], date: Date) : Date => {
  if (bookingDates.length > 0) {
    const nextDateFormatted = format(addDays(date, 1));
    const nextBooking = bookingDates.find(
      (booking) =>
        validateDateBeforeDate(
          booking.checkInDate,
          nextDateFormatted
        ) ||
        validateDateBetweenTwoDates(
          booking.checkInDate,
          booking.checkOutDate,
          nextDateFormatted
        )
    ) as Booking | undefined;

    if (nextBooking && nextBooking.checkInDate) {
      return new Date(nextBooking.checkInDate)
    }
  }
}

// Get next disabled date
const nextDisabledDate = (bookedDates: string[], checkIn: Date) : Date => {
  const nextDisabledDate = bookedDates.find((date: string) => {
    if (isDateAfter(new Date(date), checkIn)) {
      return date
    }
  })

  return nextDisabledDate
}

export {
  nextBookingDate,
  nextDisabledDate
}

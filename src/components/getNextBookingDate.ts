import { format } from 'fecha';
import { addDays, isDateAfter } from './newHelpers';

interface Booking {
  checkInDate: string
  checkInTime: number
  checkOutDate: string
  checkOutTime: number
  type: string
}

const getvalidDate = (d: string) => {
  const formatDateAt00 = new Date(d).setHours(0, 0, 0, 0);

  return new Date(formatDateAt00);
};

const validateDateBetweenDate = (fromDate: string, givenDate: string) => {
  return getvalidDate(givenDate) <= getvalidDate(fromDate);
}

const validateDateBetweenTwoDates = (fromDate: string, toDate: string, givenDate: string) => {
  return (
    getvalidDate(givenDate) <= getvalidDate(toDate) &&
    getvalidDate(givenDate) >= getvalidDate(fromDate)
  );
}

const nextBookingDate = (bookingDates: Booking[], date: Date) : Date => {
  if (bookingDates.length > 0) {
    const nextDateFormated = format(addDays(date, 1));
    const nextBooking = bookingDates.find(
      (booking) =>
        validateDateBetweenDate(
          booking.checkInDate,
          nextDateFormated
        ) ||
        validateDateBetweenTwoDates(
          booking.checkInDate,
          booking.checkOutDate,
          nextDateFormated
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

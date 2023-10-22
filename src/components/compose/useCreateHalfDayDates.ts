import { ref } from "vue";
import type { Ref } from "vue";

import type {
  Booking,
  BookingColor,
  CheckInCheckOutHalfDay,
  FlatBooking,
} from "../../types";
import {
  getDayDiff,
  getDatesBetweenTwoDates,
  sortDates,
  sortDatesObj,
} from "../helpers";

const createHalfDayDatesWithBookedDates = (
  dates: string[],
): {
  checkIncheckOutHalfDay: Ref<CheckInCheckOutHalfDay>;
  bookedDates: Ref<string[]>;
} => {
  const checkIncheckOutHalfDay: Ref<CheckInCheckOutHalfDay> = ref({});
  const bookedDates = ref(sortDates([...dates])) as Ref<string[]>;

  for (let i = 0; i < bookedDates.value.length; i++) {
    const newDate = bookedDates.value[i] as string;
    const newDateIncrementOne = bookedDates.value[i + 1] as string;

    if (i === 0) {
      checkIncheckOutHalfDay.value[newDate] = {
        checkIn: true,
      };
    }

    if (
      !checkIncheckOutHalfDay.value[newDate] &&
      bookedDates.value[i + 1] &&
      getDayDiff(newDate, newDateIncrementOne) > 1
    ) {
      checkIncheckOutHalfDay.value[newDate] = {
        checkOut: true,
      };
      checkIncheckOutHalfDay.value[newDateIncrementOne] = {
        checkIn: true,
      };
    }

    if (i === bookedDates.value.length - 1) {
      checkIncheckOutHalfDay.value[newDate] = {
        checkOut: true,
      };
    }
  }

  return {
    bookedDates,
    checkIncheckOutHalfDay,
  };
};

const createBookingDatesWithHalfDayDates = (
  checkIncheckOutHalfDay: Ref<CheckInCheckOutHalfDay>,
  bookingDatesProps: Booking[],
): Booking[] => {
  const bookingDates = new Set() as Set<Booking>;
  let increment = 0 as number;
  const booking = {} as Booking;

  Object.keys(checkIncheckOutHalfDay.value).forEach(
    (date: string, i: number) => {
      increment = i;

      if (checkIncheckOutHalfDay.value[date].checkIn)
        booking.checkInDate = date;
      if (checkIncheckOutHalfDay.value[date].checkOut)
        booking.checkOutDate = date;

      if (increment % 2 === 1) {
        bookingDates.add({
          checkInDate: booking.checkInDate,
          checkOutDate: booking.checkOutDate,
        });
      }
    },
  );

  return sortDatesObj([...bookingDatesProps, ...bookingDates]);
};

export const useCreateHalfDayDates = (
  bookingDates: Booking[],
  bookedDatesProps: string[],
  bookingColor: BookingColor,
  formattingFormat: Ref<string>,
): {
  flatBookingDates: Ref<FlatBooking[]>;
  checkIncheckOutHalfDay: Ref<CheckInCheckOutHalfDay>;
  disabledDates: Ref<string[]>;
  newBookingDates: Booking[];
} => {
  const disabledDates: Ref<string[]> = ref([]);
  // Set DisabledDates to []
  const flatBookingDates: Ref<FlatBooking[]> = ref([]);
  // Field DisabledDates whith BookingDates
  const bookingTypeAndDates: {
    [key: string]: string[];
  } = {};

  // Create halfDay dates with booked dates
  const bookedDates: Ref<string[]> =
    createHalfDayDatesWithBookedDates(bookedDatesProps).bookedDates;
  const checkIncheckOutHalfDay: Ref<CheckInCheckOutHalfDay> =
    createHalfDayDatesWithBookedDates(bookedDatesProps).checkIncheckOutHalfDay;

  // Create bookingDates with halfDay
  const newBookingDates: Booking[] = createBookingDatesWithHalfDayDates(
    checkIncheckOutHalfDay,
    bookingDates,
  );

  bookingDates.forEach((booking: Booking) => {
    checkIncheckOutHalfDay.value[booking.checkInDate] = {
      checkIn: true,
    };
    checkIncheckOutHalfDay.value[booking.checkOutDate] = {
      checkOut: true,
    };

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

  objectArray.forEach(([key, value]) => {
    flatBookingDates.value.push({
      color: bookingColor[key] || "#000000",
      key,
      value,
    });
  });

  // Field DisabledDates whith BookedDates
  disabledDates.value = flatBookingDates.value.map((b) => b.value).flat();
  disabledDates.value.push(...bookedDates.value);
  disabledDates.value = sortDates(disabledDates.value);

  return {
    flatBookingDates,
    checkIncheckOutHalfDay,
    disabledDates,
    newBookingDates,
  };
};

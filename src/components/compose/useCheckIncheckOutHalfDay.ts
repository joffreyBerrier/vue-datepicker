import { ref } from "vue";
import type { Ref } from "vue";

import type { Booking, CheckInCheckOutHalfDay } from "~/types";
import { getDayDiff, sortDates } from "../helpers";

const createHalfDayDatesWithBookedDates = (
  dates: string[]
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

export const useCheckIncheckOutHalfDay = (
  bookingDates: Booking[],
  bookedDatesProps: string[]
): Ref<CheckInCheckOutHalfDay> => {
  const checkIncheckOutHalfDay: Ref<CheckInCheckOutHalfDay> =
    createHalfDayDatesWithBookedDates(bookedDatesProps).checkIncheckOutHalfDay;

  bookingDates.forEach((booking: Booking) => {
    if (!checkIncheckOutHalfDay.value[booking.checkInDate]) {
      checkIncheckOutHalfDay.value[booking.checkInDate] = {
        checkIn: true,
      };
    } else {
      checkIncheckOutHalfDay.value[booking.checkInDate] = {
        checkIn: true,
        checkOut: true,
      };
    }

    if (!checkIncheckOutHalfDay.value[booking.checkOutDate]) {
      checkIncheckOutHalfDay.value[booking.checkOutDate] = {
        checkOut: true,
      };
    } else {
      checkIncheckOutHalfDay.value[booking.checkOutDate] = {
        checkIn: true,
        checkOut: true,
      };
    }
  });

  return checkIncheckOutHalfDay;
};

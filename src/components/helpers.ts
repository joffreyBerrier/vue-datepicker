import { addDays, format } from "../plugins/day";
import type { Booking } from "~/types";

const isDateAfter = (time1: Date, time2: Date): boolean => {
  return new Date(time1) > new Date(time2);
};

const isDateBefore = (time1: string | Date, time2: string | Date): boolean => {
  return new Date(time1) < new Date(time2);
};

const getDayDiff = (d1: string, d2: string): number => {
  const t2 = new Date(d2).getTime();
  const t1 = new Date(d1).getTime();

  return parseInt((t2 - t1) / (24 * 3600 * 1000), 10);
};

const resetTimeDate = (date: string): Date => {
  const formatDateAt00 = new Date(date).setHours(0, 0, 0, 0);

  return new Date(formatDateAt00);
};

const validateDateBetweenTwoDates = (
  fromDate: string,
  toDate: string,
  givenDate: string
): boolean => {
  return (
    resetTimeDate(givenDate) <= resetTimeDate(toDate) &&
    resetTimeDate(givenDate) >= resetTimeDate(fromDate)
  );
};

const getDatesBetweenTwoDates = (
  startDate: Date,
  endDate: Date,
  formattingFormat: string
): string[] => {
  const arr = [];

  for (
    let dt = new Date(startDate);
    dt <= endDate;
    dt.setDate(dt.getDate() + 1)
  ) {
    const formatDay = format(new Date(dt), formattingFormat);

    arr.push(formatDay);
  }

  return arr;
};

const getMonthDiff = (d1: Date, d2: Date): number => {
  let months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();

  return months <= 0 ? 0 : months;
};

const sortDatesObj = (dates: Booking[]): Booking[] => {
  return dates.sort((a, b) => {
    const aa = a.checkInDate.split("/").reverse().join();
    const bb = b.checkInDate.split("/").reverse().join();

    return aa < bb ? -1 : aa > bb ? 1 : 0;
  });
};

const sortDates = (dates: string[]): string[] => {
  return dates.sort((a, b) => {
    const aa = a.split("/").reverse().join();
    const bb = b.split("/").reverse().join();

    return aa < bb ? -1 : aa > bb ? 1 : 0;
  });
};

const getDaysArray = (start: Date | string, end: Date | string): Date[] => {
  for (
    // eslint-disable-next-line no-var
    var arr = [], dt = new Date(start);
    dt <= end;
    dt.setDate(dt.getDate() + 1)
  ) {
    arr.push(new Date(dt));
  }

  // eslint-disable-next-line block-scoped-var
  return arr;
};

const isDateBeforeOrEqual = (
  time1: Date | string,
  time2: Date | string
): boolean => {
  return new Date(time1) <= new Date(time2);
};

const substractDays = (date: Date | string, quantity: number): Date => {
  const result = new Date(date);

  result.setDate(result.getDate() - quantity);

  return result;
};

const getNextMonth = (date: Date): Date => {
  let nextMonth;

  if (date.getMonth() === 11) {
    nextMonth = new Date(date.getFullYear() + 1, 0, 1);
  } else {
    nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  }

  return nextMonth;
};

const getNextDay = (date: Date, dayIndex: number): Date => {
  const currentDate = date;

  currentDate.setDate(
    currentDate.getDate() + ((dayIndex - 1 - currentDate.getDay() + 7) % 7) + 1
  );

  return currentDate;
};

export {
  addDays,
  getDatesBetweenTwoDates,
  getDayDiff,
  getDaysArray,
  getMonthDiff,
  getNextDay,
  getNextMonth,
  isDateAfter,
  isDateBefore,
  isDateBeforeOrEqual,
  resetTimeDate,
  sortDates,
  sortDatesObj,
  substractDays,
  validateDateBetweenTwoDates,
};

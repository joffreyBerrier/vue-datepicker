import {
  addDate,
  format,
  getDateDiff,
  getDatesBetweenTwoDates,
  getNextDate,
  isAfter,
  isBefore,
  isBeforeOrEqual,
  isBetweenDate,
  subtractDate,
} from "../plugins/day";
import type { Booking } from "~/types";

const isDateAfter = (time1: Date, time2: Date): boolean => {
  return isAfter(time1, time2);
};

const isDateBefore = (time1: string | Date, time2: string | Date): boolean => {
  return isBefore(time1, time2);
};

const getDayDiff = (d1: string, d2: string): number => {
  return getDateDiff(d1, d2, "day");
};

const validateDateBetweenTwoDates = (
  fromDate: string,
  toDate: string,
  givenDate: string
): boolean => {
  return isBetweenDate(fromDate, toDate, givenDate);
};

const getMonthDiff = (d1: Date, d2: Date): number => {
  return getDateDiff(d1, d2, "month");
};

const isDateBeforeOrEqual = (
  time1: Date | string,
  time2: Date | string
): boolean => {
  return isBeforeOrEqual(time1, time2);
};

const addDays = (date: Date | string, quantity: number): Date => {
  return addDate(date, quantity, "day");
};

const substractDays = (date: Date | string, quantity: number): Date => {
  return subtractDate(date, quantity, "day");
};

const getNextMonth = (date: Date): Date => {
  return addDate(date, 1, "month");
};

const getNextDay = (date: Date, dayIndex: number): Date => {
  return getNextDate(date, dayIndex);
};

const sortDatesObj = (dates: Booking[]): Booking[] => {
  dates.map((d) => {
    return {
      ...d,
      checkInDate: format(d.checkInDate, "YYYY/MM/DD"),
    };
  });

  return dates
    .sort((a, b) => {
      const aa = a.checkInDate.split("/").reverse().join();
      const bb = b.checkInDate.split("/").reverse().join();

      return aa < bb ? -1 : aa > bb ? 1 : 0;
    })
    .map((d) => {
      return {
        ...d,
        checkInDate: format(d.checkInDate, "YYYY-MM-DD"),
      };
    });
};

const sortDates = (dates: string[]): string[] => {
  dates.map((d) => format(d, "YYYY/MM/DD"));

  return dates
    .sort((a, b) => {
      const aa = a.split("/").reverse().join();
      const bb = b.split("/").reverse().join();

      return aa < bb ? -1 : aa > bb ? 1 : 0;
    })
    .map((d) => format(d, "YYYY-MM-DD"));
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
  sortDates,
  sortDatesObj,
  substractDays,
  validateDateBetweenTwoDates,
};

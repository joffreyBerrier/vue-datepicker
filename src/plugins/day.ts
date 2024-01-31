import { default as dayjs } from "dayjs";
import type { UnitType, ManipulateType } from "dayjs";
import { default as isBetween } from "dayjs/plugin/isBetween";
import { default as isSameOrAfter } from "dayjs/plugin/isSameOrAfter";
import { default as isSameOrBefore } from "dayjs/plugin/isSameOrBefore";
import { default as timezone } from "dayjs/plugin/timezone";
import { default as weekday } from "dayjs/plugin/weekday";
import { default as utc } from "dayjs/plugin/utc";

import "dayjs/locale/fr";

dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(utc);
dayjs.extend(weekday);
dayjs.extend(timezone);

// Format DayJs
const format = (date: Date | string, format: string): string => {
  const d = dayjs(date);

  return d.format(format);
};

const getMonth = (date: Date | string) => {
  return dayjs(date).month();
};

const getYear = (date: Date | string) => {
  return dayjs(date).year();
};

const formatUtc = (date: Date | string): string => {
  return dayjs(date).format();
};

const formatDateUtc = (date: Date | string): Date => {
  return dayjs(date).toDate();
};

const isAfter = (time1: Date, time2: Date): boolean => {
  const d1 = dayjs(time1);
  const d2 = dayjs(time2);

  return d1.isAfter(d2, "day");
};

const isAfterOrEqual = (
  time1: string | Date,
  time2: string | Date,
): boolean => {
  const d1 = dayjs(time1);
  const d2 = dayjs(time2);

  // return d1 => d2;
  return d1.isSameOrAfter(d2, "day");
};

const isBefore = (time1: string | Date, time2: string | Date): boolean => {
  const d1 = dayjs(time1);
  const d2 = dayjs(time2);

  return d1.isBefore(d2, "day");
};

const isBeforeOrEqual = (
  time1: string | Date,
  time2: string | Date,
): boolean => {
  const d1 = dayjs(time1);
  const d2 = dayjs(time2);

  return d1.isSameOrBefore(d2, "day");
};

const getDateDiff = (
  time1: string | Date,
  time2: string | Date,
  type: UnitType,
): number => {
  const d1 = dayjs(time1);
  const d2 = dayjs(time2);

  return Math.abs(d1.diff(d2, type));
};

const isBetweenDate = (
  fromDate: string,
  toDate: string,
  givenDate: string | Date,
  orEqual = false,
): boolean => {
  const d1 = dayjs(fromDate);
  const d2 = dayjs(toDate);
  const d3 = dayjs(givenDate);

  if (orEqual) {
    return dayjs(d3).isBetween(d1, d2, "day", "[)");
  }

  return dayjs(d3).isBetween(d1, d2, "day");
};

const addDate = (
  date: Date | string,
  quantity: number,
  type: ManipulateType | undefined,
): Date => {
  const d = dayjs(date);

  return d.add(quantity, type).toDate();
};

const subtractDate = (
  date: Date | string,
  quantity: number,
  type: ManipulateType | undefined,
): Date => {
  const d = dayjs(date);

  return d.subtract(quantity, type).toDate();
};

const getNextDate = (date: Date | string, index: number) => {
  const d = dayjs(date);

  if (d.day() >= index) {
    return d.add(7, "day").day(index).toDate();
  }

  return d.day(index).toDate();
};

const getDatesBetweenTwoDatesDiff = (
  startDate: string | Date,
  endDate: string | Date,
) => {
  const d1 = dayjs(startDate);
  const d2 = dayjs(endDate);

  return getDateDiff(d1.toDate(), d2.toDate(), "day");
};

const getDatesBetweenTwoDates = (
  startDate: string | Date,
  endDate: string | Date,
  formattingFormat: string,
): string[] => {
  const d1 = dayjs(startDate);
  const d2 = dayjs(endDate);
  const lenghDifference: number = getDateDiff(d1.toDate(), d2.toDate(), "day");
  const arr = [];

  for (let index = 0; index < lenghDifference + 1; index++) {
    const day = d1.add(index, "day").format(formattingFormat);

    arr.push(day);
  }

  return arr;
};

// Month
const getFirstDayOfMonth = (date: Date): Date => {
  return dayjs(date).startOf("month").toDate();
};

const getFirstDayOfFirstWeekOfMonth = (date: Date): string => {
  return dayjs(date).startOf("month").weekday(0).format("YYYY-MM-DD");
};

const getNextMonth = (date: Date): Date => {
  return dayjs(date).add(1, "month").startOf("month").toDate();
};

// Add days
const getDaysArray = (start: Date | string, end: Date | string): Date[] => {
  const d1 = dayjs(start);
  const d2 = dayjs(end);
  const lenghDifference: number = getDateDiff(d1.toDate(), d2.toDate(), "day");
  const arr = [];

  for (let index = 0; index < lenghDifference + 1; index++) {
    const day = d1.add(index, "day").toDate();

    arr.push(day);
  }

  return arr;
};

export {
  addDate,
  dayjs,
  format,
  formatDateUtc,
  formatUtc,
  getDateDiff,
  getDatesBetweenTwoDates,
  getDatesBetweenTwoDatesDiff,
  getDaysArray,
  getFirstDayOfFirstWeekOfMonth,
  getFirstDayOfMonth,
  getMonth,
  getNextDate,
  getNextMonth,
  getYear,
  isAfter,
  isAfterOrEqual,
  isBefore,
  isBeforeOrEqual,
  isBetweenDate,
  subtractDate,
};

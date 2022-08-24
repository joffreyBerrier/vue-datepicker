import { default as dayjs } from "dayjs";
import type { UnitType, ManipulateType } from "dayjs";
import { default as isBetween } from "dayjs/plugin/isBetween";
import { default as isSameOrAfter } from "dayjs/plugin/isSameOrAfter";
import { default as isSameOrBefore } from "dayjs/plugin/isSameOrBefore";
import { default as utc } from "dayjs/plugin/utc";
import "dayjs/locale/fr";

dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(utc);

// Format DayJs
const format = (date: Date | string, format: string): string => {
  const d = dayjs(date).utc(true);

  return d.format(format);
};

const getMonth = (date: Date) => {
  return dayjs(date).month();
};

const getYear = (date: Date) => {
  return dayjs(date).year();
};

const formatUtc = (date: Date | string): string => {
  const d = dayjs(date);

  return d.utc(true).format();
};

const formatDateUtc = (date: Date | string): Date => {
  const d = dayjs(date);

  return d.utc(true).toDate();
};

const isAfter = (time1: Date, time2: Date): boolean => {
  const d1 = dayjs(time1).utc(true);
  const d2 = dayjs(time2).utc(true);

  return d1.isAfter(d2, "day");
};

const isAfterOrEqual = (
  time1: string | Date,
  time2: string | Date
): boolean => {
  const d1 = dayjs(time1).utc(true);
  const d2 = dayjs(time2).utc(true);

  // return d1 => d2;
  return d1.isSameOrAfter(d2, "day");
};

const isBefore = (time1: string | Date, time2: string | Date): boolean => {
  const d1 = dayjs(time1).utc(true);
  const d2 = dayjs(time2).utc(true);

  return d1.isBefore(d2, "day");
};

const isBeforeOrEqual = (
  time1: string | Date,
  time2: string | Date
): boolean => {
  const d1 = dayjs(time1).utc(true);
  const d2 = dayjs(time2).utc(true);

  return d1.isSameOrBefore(d2, "day");
};

const getDateDiff = (
  time1: string | Date,
  time2: string | Date,
  type: UnitType
): number => {
  const d1 = dayjs(time1).utc(true);
  const d2 = dayjs(time2).utc(true);

  return Math.abs(d1.diff(d2, type));
};

const isBetweenDate = (
  fromDate: string,
  toDate: string,
  givenDate: string
): boolean => {
  const d1 = dayjs(fromDate).utc(true);
  const d2 = dayjs(toDate).utc(true);
  const d3 = dayjs(givenDate).utc(true);

  return dayjs(d3).isBetween(d1, d2, "day");
};

const addDate = (
  date: Date | string,
  quantity: number,
  type: ManipulateType | undefined
): Date => {
  const d = dayjs(date).utc(true);

  return d.add(quantity, type).toDate();
};

const subtractDate = (
  date: Date | string,
  quantity: number,
  type: ManipulateType | undefined
): Date => {
  const d = dayjs(date).utc(true);

  return d.subtract(quantity, type).toDate();
};

const getNextDate = (date: Date | string, index: number) => {
  const d = dayjs(date).utc(true);

  if (d.day() >= index) {
    return d.add(7, "day").day(index).toDate();
  }

  return d.day(index).toDate();
};

const getDatesBetweenTwoDates = (
  startDate: string | Date,
  endDate: string | Date,
  formattingFormat: string
): string[] => {
  const d1 = dayjs(startDate).utc(true);
  const d2 = dayjs(endDate).utc(true);
  const lenghDifference: number = getDateDiff(d1.toDate(), d2.toDate(), "day");
  const arr = [];

  for (let index = 0; index < lenghDifference + 1; index++) {
    const day = d1.add(index, "day").format(formattingFormat);

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
  getMonth,
  getNextDate,
  getYear,
  isAfter,
  isAfterOrEqual,
  isBefore,
  isBeforeOrEqual,
  isBetweenDate,
  subtractDate,
};

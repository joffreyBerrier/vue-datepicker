import { default as dayjs } from "dayjs";
import { addDate, format } from "../plugins/day";
import { useCreateMonth } from "./compose/useCreateMonth";

import type { Month } from "../types";

const getMonthName = (day: Date): string => {
  const currentMonth = format(day, "MMMM");
  const currentYear = format(day, " YYYY");

  return `${currentMonth} ${currentYear}`;
};

const getFirstDayOfMonth = (date: Date): Date => {
  const d = dayjs(date).utc(true);

  return d.startOf("month").toDate();
};

const getFirstDayOfFirstWeekOfMonth = (
  date: Date,
  firstDayOfWeek: number
): Date => {
  const firstDay = getFirstDayOfMonth(date);
  let offset = firstDayOfWeek - firstDay.getDay();

  if (offset > 0) {
    offset -= 7;
  }

  return new Date(firstDay.setDate(firstDay.getDate() + offset));
};

const getNextMonth = (date: Date): Date => {
  return addDate(date, 1, "month");
};

const createMultipleMonth = (dates: Date[]): Month[] => {
  const months = [] as Month[];

  for (let d = 0; d < dates.length; d++) {
    const currentDate = dates[d] as Date;

    months.push(useCreateMonth(currentDate));
  }

  return months;
};

export {
  createMultipleMonth,
  getFirstDayOfFirstWeekOfMonth,
  getFirstDayOfMonth,
  getMonthName,
  getNextMonth,
};

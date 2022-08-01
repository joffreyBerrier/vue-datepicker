import { default as dayjs } from "dayjs";
import { addDate, format } from "../plugins/day";
import { addDays } from "./helpers";

import type { Month } from "~/types";

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

const createMonth = (date: Date): Month => {
  const firstDayOfWeek = 1 as number;
  const maxDaysInMonth = 42 as number; // a month is covered by 6 weeks max
  const firstDayOfMonth = getFirstDayOfMonth(date) as Date;
  const firstDay = getFirstDayOfFirstWeekOfMonth(date, firstDayOfWeek) as Date;
  const month = {
    days: [],
    monthKey: date.getMonth(),
    monthName: getMonthName(firstDayOfMonth),
    yearKey: date.getFullYear(),
  } as Month;

  for (let i = 0; i < maxDaysInMonth; i++) {
    const day = addDays(firstDay, i) as Date;

    month.days.push({
      belongsToThisMonth: day.getMonth() === month.monthKey,
      date: day,
      dayNumber: format(day, "D"),
      formatDay: format(day, "YYYY-MM-DD"),
    });
  }

  return month;
};

const getNextMonth = (date: Date): Date => {
  return addDate(date, 1, "month");
};

const createMultipleMonth = (dates: Date[]): Month[] => {
  const months = [] as Month[];

  for (let d = 0; d < dates.length; d++) {
    const currentDate = dates[d] as Date;

    months.push(createMonth(currentDate));
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

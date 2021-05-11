import { format } from "fecha";
import { addDays } from "./helpers";

import { Month } from "../types/index";

const getMonthName = (day: Date): string => {
  const currentMonth = format(day, "MMMM");
  const currentYear = format(day, " YYYY");

  return `${currentMonth} ${currentYear}`;
};

const getFirstDayOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const getFirstDayOfFirstWeekOfMonth = (date: Date, firstDayOfWeek: number) => {
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
  let nextMonth;

  if (date.getMonth() === 11) {
    nextMonth = new Date(date.getFullYear() + 1, 0, 1);
  } else {
    nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  }

  return nextMonth;
};

const renderMultipleMonths = (date: Date, max: number): Month[] => {
  let nextMonth = new Date(date);
  const dates = [];

  for (let countMonth = 0; countMonth < max; countMonth++) {
    const tempNextMonth = getNextMonth(nextMonth);

    dates.push(tempNextMonth);
    nextMonth = tempNextMonth;
  }

  return createMultipleMonth(dates);
};

const createMultipleMonth = (dates: Date[]): Month[] => {
  const months = [] as Month[];

  for (let d = 0; d < dates.length; d++) {
    const currentDate = dates[d] as Date;

    months.push(createMonth(currentDate));
  }

  return months;
};

export { createMonth, renderMultipleMonths };

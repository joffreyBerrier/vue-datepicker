import { format } from "../../plugins/day";

import { addDays } from "../helpers";
import {
  getFirstDayOfFirstWeekOfMonth,
  getFirstDayOfMonth,
  getMonthName,
} from "../generateMonth";

import type { Month } from "../../types";

export const useCreateMonth = (date: Date): Month => {
  const firstDayOfWeek = 1 as number;
  const maxDaysInMonth = 42 as number; // a month is covered by 6 weeks max
  const firstDayOfMonth = getFirstDayOfMonth(date);
  const firstDay = getFirstDayOfFirstWeekOfMonth(date, firstDayOfWeek);
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
      dayIndex: day.getDay(),
      dayNumber: format(day, "D"),
      formatDay: format(day, "YYYY-MM-DD"),
      style: {},
    });
  }

  return month;
};

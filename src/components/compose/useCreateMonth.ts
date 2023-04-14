import type { Month } from "../../types";

import {
  format,
  getFirstDayOfFirstWeekOfMonth,
  getFirstDayOfMonth,
} from "../../plugins/day";
import { getMonthName } from "../generateMonth";
import { addDays } from "../helpers";

export const useCreateMonth = (date: Date): Month => {
  const maxDaysInMonth = 42 as number; // a month is covered by 6 weeks max
  const firstDayOfMonth = getFirstDayOfMonth(date);
  const firstDay = getFirstDayOfFirstWeekOfMonth(date);
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

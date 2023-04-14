import {
  format,
  getFirstDayOfFirstWeekOfMonth,
  getFirstDayOfMonth,
  getNextMonth,
} from "../plugins/day";
import { useCreateMonth } from "./compose/useCreateMonth";

import type { Month } from "../types";

const getMonthName = (day: Date): string => {
  const currentMonth = format(day, "MMMM");
  const currentYear = format(day, " YYYY");

  return `${currentMonth} ${currentYear}`;
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

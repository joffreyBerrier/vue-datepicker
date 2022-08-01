import { default as dayjs } from "dayjs";
import { createMultipleMonth, getNextMonth } from "../generateMonth";

import type { Month } from "~/types";

export const useCreateMultipleMonths = (date: Date, max: number): Month[] => {
  let nextMonth = dayjs(date).utc(true).toDate();
  const dates = [];

  for (let countMonth = 0; countMonth < max; countMonth++) {
    const tempNextMonth = getNextMonth(nextMonth);

    dates.push(tempNextMonth);
    nextMonth = tempNextMonth;
  }

  return createMultipleMonth(dates);
};

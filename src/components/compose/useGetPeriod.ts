import type { ComputedRef } from "vue";
import type { Period } from "../../types";
import { isBetweenDate } from "./../../plugins/day";

export const useGetPeriod = (
  periodDates: ComputedRef<Period[]>,
  date: string
): Period | undefined => {
  if (periodDates.value.length > 0) {
    return periodDates.value.find((p: Period) => {
      return isBetweenDate(p.startAt, p.endAt, date, true);
    });
  }

  return undefined;
};

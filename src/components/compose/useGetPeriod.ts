import type { ComputedRef } from "vue";
import type { Period } from "~/types";
import { getDatesBetweenTwoDates } from "../helpers";

export const useGetPeriod = (
  periodDates: ComputedRef<Period[]>,
  period: string,
  formattingFormat: string
): string[] => {
  if (
    periodDates.value.length > 0 &&
    periodDates.value.some((p: Period) => p.periodType === period)
  ) {
    return [
      ...new Set(
        periodDates.value
          .filter((p: Period) => p.periodType === period)
          .map((p: Period) => {
            return getDatesBetweenTwoDates(
              new Date(p.startAt),
              new Date(p.endAt),
              formattingFormat
            );
          })
          .flat()
      ),
    ];
  }

  return [];
};

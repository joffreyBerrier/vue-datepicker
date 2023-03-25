import type { ComputedRef } from "vue";
import type { Period } from "../../types";
import { getDatesBetweenTwoDates } from "../helpers";

export const useGetFlattenedPeriods = (
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
              p.startAt,
              p.endAt,
              formattingFormat
            );
          })
          .flat()
      ),
    ];
  }

  return [];
};

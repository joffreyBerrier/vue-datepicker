import type { Period } from "~/types";
import { getDatesBetweenTwoDates } from "../helpers";

export const useGetPeriod = (
  periodDates: Period[],
  period: string,
  formattingFormat: string
): string[] => {
  if (
    periodDates.length > 0 &&
    periodDates.some((p: Period) => p.periodType === period)
  ) {
    return periodDates
      .filter((p: Period) => p.periodType === period)
      .map((p: Period) => {
        return getDatesBetweenTwoDates(
          new Date(p.startAt),
          new Date(p.endAt),
          formattingFormat
        );
      })[0];
  }

  return [];
};

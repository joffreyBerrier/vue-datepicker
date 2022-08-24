import { getMonth, getYear } from "../../plugins/day";

export const usePaginate = (
  day: Date,
  startDate: Date,
  showYear: boolean
): number => {
  const dayMonth = getMonth(day);
  const dayYear = getYear(day);
  const startYear = getYear(startDate);

  const numberOfYears = dayYear - startYear > 0 ? dayYear - startYear : 0;

  const numberOfMonth = showYear
    ? numberOfYears * 12
    : numberOfYears * 12 + dayMonth;

  return Math.floor(numberOfMonth);
};

import { default as dayjs } from "dayjs";
import { describe, expect, it } from "vitest";
import {
  addDays,
  getDatesBetweenTwoDates,
  getDayDiff,
  getDaysArray,
  getMonthDiff,
  getNextDay,
  getNextMonth,
  isDateAfter,
  isDateBefore,
  isDateBeforeOrEqual,
  sortDates,
  sortDatesObj,
  substractDays,
  validateDateBetweenTwoDates,
} from "../helpers";

describe("isDate", () => {
  describe("isDateAfter", () => {
    const beforeDate = new Date("2020-01-01");
    const afterDate = new Date("2020-01-10");

    it("return false", async () => {
      expect(isDateAfter(beforeDate, afterDate)).toBe(false);
    });

    it("return true", async () => {
      expect(isDateAfter(afterDate, beforeDate)).toBe(true);
    });
  });

  describe("isDateBefore", () => {
    const beforeDate = new Date("2020-01-01");
    const afterDate = new Date("2020-01-10");

    it("return false", async () => {
      expect(isDateBefore(afterDate, beforeDate)).toBe(false);
    });

    it("return true", async () => {
      expect(isDateBefore(beforeDate, afterDate)).toBe(true);
    });
  });

  describe("isDateBeforeOrEqual", () => {
    const beforeDate = new Date("2020-01-01");
    const afterDate = new Date("2020-01-10");

    it("return false", async () => {
      expect(isDateBeforeOrEqual(afterDate, beforeDate)).toBe(false);
    });

    it("return true", async () => {
      expect(isDateBeforeOrEqual(beforeDate, afterDate)).toBe(true);
    });

    it("return true", async () => {
      expect(isDateBeforeOrEqual(beforeDate, beforeDate)).toBe(true);
    });
  });
});

describe("manage Date", () => {
  describe("substractDays", () => {
    const date = new Date("2020-01-01");

    it("return 9", async () => {
      const result = dayjs(dayjs("2019-12-22").utc(true).format()).toDate();

      expect(substractDays(date, 10)).toBe(result);
    });
  });
});

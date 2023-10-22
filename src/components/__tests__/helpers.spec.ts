import { default as dayjs } from "dayjs";
import { describe, expect, it } from "vitest";
import {
  addDays,
  getDatesBetweenTwoDates,
  getDayDiff,
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

    it("return 10 days before - 2019-12-22", async () => {
      const result = dayjs("2019-12-22").utc(true).format("YYYY-MM-DD");

      expect(dayjs(substractDays(date, 10)).format("YYYY-MM-DD")).toBe(result);
    });

    it("return 30 days before - 2019-12-02", async () => {
      const result = dayjs("2019-12-02").utc(true).format("YYYY-MM-DD");

      expect(dayjs(substractDays(date, 30)).format("YYYY-MM-DD")).toBe(result);
    });
  });

  describe("addDays", () => {
    const date = new Date("2020-01-01");

    it("return 10 days after - 2020-01-11", async () => {
      const result = dayjs("2020-01-11").utc(true).format("YYYY-MM-DD");

      expect(dayjs(addDays(date, 10)).format("YYYY-MM-DD")).toBe(result);
    });

    it("return 50 days after - 2020-02-20", async () => {
      const result = dayjs("2020-02-20").utc(true).format("YYYY-MM-DD");

      expect(dayjs(addDays(date, 50)).format("YYYY-MM-DD")).toBe(result);
    });
  });
});

describe("Get Date", () => {
  describe("getDatesBetweenTwoDates", () => {
    it("return an array of days between 1-01 to 10-01", async () => {
      const startDate = new Date("2022-01-01");
      const endDate = new Date("2022-01-10");

      expect(getDatesBetweenTwoDates(startDate, endDate, "YYYY-MM-DD")).toEqual(
        [
          "2022-01-01",
          "2022-01-02",
          "2022-01-03",
          "2022-01-04",
          "2022-01-05",
          "2022-01-06",
          "2022-01-07",
          "2022-01-08",
          "2022-01-09",
          "2022-01-10",
        ],
      );
    });
  });

  describe("getDatesBetweenTwoDates", () => {
    it("return 9, the count of day between 01-01 to 10-01", async () => {
      expect(getDayDiff("2022-01-01", "2022-01-10")).toEqual(9);
    });

    it("return 68, the count of day between 01-01 to 03-10", async () => {
      expect(getDayDiff("2022-01-01", "2022-03-10")).toEqual(68);
    });
  });

  describe("getMonthDiff", () => {
    it("return 0", async () => {
      expect(
        getMonthDiff(new Date("2021-01-01"), new Date("2021-01-10")),
      ).toEqual(0);
    });

    it("return 2", async () => {
      expect(
        getMonthDiff(new Date("2021-01-01"), new Date("2021-03-10")),
      ).toEqual(2);
    });
  });

  describe("getNextDay", () => {
    const date = new Date("2022-01-01");

    it("return 0 eq to Sunday", async () => {
      expect(dayjs(getNextDay(date, 0)).format("YYYY-MM-DD")).toEqual(
        "2022-01-02",
      );
      expect(dayjs(getNextDay(date, 0)).day()).toBe(0);
    });

    it("return 6 eq to Saturday", async () => {
      expect(dayjs(getNextDay(date, 6)).format("YYYY-MM-DD")).toEqual(
        "2022-01-08",
      );
      expect(dayjs(getNextDay(date, 6)).day()).toBe(6);
    });

    it("return 1 eq to Monday", async () => {
      expect(dayjs(getNextDay(date, 1)).format("YYYY-MM-DD")).toEqual(
        "2022-01-03",
      );
      expect(dayjs(getNextDay(date, 1)).day()).toBe(1);
    });
  });

  describe("getNextMonth", () => {
    const date = new Date("2022-01-01");

    it("return February", async () => {
      expect(dayjs(getNextMonth(date)).format("YYYY-MM-DD")).toEqual(
        "2022-02-01",
      );
      expect(dayjs(getNextMonth(date)).month()).toBe(1);
    });
  });

  describe("validateDateBetweenTwoDates", () => {
    it("return true", async () => {
      expect(
        validateDateBetweenTwoDates("2022-01-01", "2022-01-10", "2022-01-05"),
      ).toBe(true);
    });

    it("return false", async () => {
      expect(
        validateDateBetweenTwoDates("2022-01-05", "2022-01-04", "2022-01-06"),
      ).toBe(false);
    });
  });
});

describe("Format Date", () => {
  describe("sortDates", () => {
    const dates = [
      "2020-01-05",
      "2020-01-07",
      "2020-01-02",
      "2020-01-08",
      "2020-01-01",
      "2020-01-10",
      "2020-01-03",
      "2020-01-06",
      "2020-01-09",
      "2020-01-04",
    ];

    it("returns sorted dates", () => {
      expect(sortDates([...dates])).toEqual([
        "2020-01-01",
        "2020-01-02",
        "2020-01-03",
        "2020-01-04",
        "2020-01-05",
        "2020-01-06",
        "2020-01-07",
        "2020-01-08",
        "2020-01-09",
        "2020-01-10",
      ]);
    });
  });

  describe("sortDatesObj", () => {
    const datesObj = [
      { checkInDate: "2020-04-05", checkOutDate: "2020-04-10" },
      { checkInDate: "2020-01-10", checkOutDate: "2020-01-20" },
      { checkInDate: "2020-01-05", checkOutDate: "2020-01-10" },
      { checkInDate: "2020-02-05", checkOutDate: "2020-02-08" },
      { checkInDate: "2022-01-01", checkOutDate: "2022-01-05" },
    ];

    it("returns sorted dates", () => {
      expect(sortDatesObj(datesObj)).toEqual([
        { checkInDate: "2020-01-05", checkOutDate: "2020-01-10" },
        { checkInDate: "2020-01-10", checkOutDate: "2020-01-20" },
        { checkInDate: "2020-02-05", checkOutDate: "2020-02-08" },
        { checkInDate: "2020-04-05", checkOutDate: "2020-04-10" },
        { checkInDate: "2022-01-01", checkOutDate: "2022-01-05" },
      ]);
    });
  });
});

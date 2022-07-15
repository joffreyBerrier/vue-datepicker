import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import Calendar from "../Calendar.vue";

const periodDates = [
  {
    startAt: "2022-08-06",
    endAt: "2022-09-10",
    periodType: "weekly_by_saturday",
    minimumDuration: 2,
  },
  {
    startAt: "2022-09-10",
    endAt: "2022-10-01",
    periodType: "weekly_by_saturday",
    minimumDuration: 2,
  },
  {
    startAt: "2022-10-08",
    endAt: "2022-10-22",
    periodType: "weekly_by_saturday",
    minimumDuration: 2,
  },
  {
    startAt: "2022-10-22",
    endAt: "2022-11-26",
    periodType: "weekly_by_saturday",
    minimumDuration: 3,
  },
  {
    startAt: "2022-12-18",
    endAt: "2023-01-01",
    periodType: "weekly_by_sunday",
    minimumDuration: 1,
  },
  {
    startAt: "2023-01-01",
    endAt: "2023-01-05",
    periodType: "nightly",
    minimumDuration: 3,
  },
  {
    startAt: "2023-01-05",
    endAt: "2023-01-15",
    periodType: "nightly",
    minimumDuration: 7,
  },
  {
    startAt: "2023-01-15",
    endAt: "2023-01-29",
    periodType: "weekly_by_sunday",
    minimumDuration: 1,
  },
  {
    startAt: "2023-01-29",
    endAt: "2023-02-26",
    periodType: "nightly",
    minimumDuration: 10,
  },
  {
    startAt: "2023-02-26",
    endAt: "2023-03-05",
    periodType: "weekly_by_sunday",
    minimumDuration: 1,
  },
  {
    startAt: "2023-03-11",
    endAt: "2023-04-15",
    periodType: "weekly_by_saturday",
    minimumDuration: 3,
  },
  {
    startAt: "2023-04-16",
    endAt: "2023-05-21",
    periodType: "weekly_by_sunday",
    minimumDuration: 1,
  },
  {
    startAt: "2023-05-21",
    endAt: "2023-05-25",
    periodType: "nightly",
    minimumDuration: 2,
  },
  {
    startAt: "2023-05-25",
    endAt: "2023-05-28",
    periodType: "nightly",
    minimumDuration: 3,
  },
  {
    startAt: "2023-05-28",
    endAt: "2023-06-04",
    periodType: "nightly",
    minimumDuration: 7,
  },
  {
    startAt: "2023-11-27",
    endAt: "2023-12-25",
    periodType: "weekly_by_monday",
    minimumDuration: 1,
  },
];

let wrapper: any;

beforeEach(() => {
  wrapper = mount(Calendar);
});

afterEach(() => {
  wrapper.unmount();
});

describe("Calendar", () => {
  describe("case 1 (3 nights min then 7 nights min) > I must be able to select from 3/01 to 10/01", () => {
    beforeEach(async () => {
      wrapper = await mount(Calendar, {
        propsData: {
          showYear: true,
          minNights: 3,
          periodDates,
          startDate: new Date(new Date().getFullYear() - 2, 0, 1),
          endDate: new Date(new Date().getFullYear() + 2, 0, 1),
        },
      });

      const paginateNext = wrapper.get(
        '[data-testid="calendar_paginate-next--button"]'
      );
      await paginateNext.trigger("click");

      const checkInDay = wrapper.get('[data-testid="day-2023-01-03"]');

      await checkInDay.trigger("click");
    });

    it("Should define checkInPeriod equal to nextPeriod.minimumDurationNights", () => {
      expect(wrapper.vm.checkInPeriod.minimumDurationNights).toBe(
        wrapper.vm.nextPeriod.minimumDurationNights
      );
    });

    // it("Should render correct text for tooltip", () => {
    //   expect(wrapper.vm.customTooltip).toBe("7 Nights minimum.");
    // });

    it("Should define dynamicNightCounts to 7", () => {
      expect(wrapper.vm.dynamicNightCounts).toBe(7);
    });

    it("Should define last nextPeriodDisableDates equal to Tuesday", () => {
      // The last day disable must be a Monday to be able to output on Tuesday
      expect(new Date(wrapper.vm.nextPeriodDisableDates[5]).getDay()).toBe(1);
    });

    it("Should define nextPeriod.minimumDuration equal to 7", () => {
      expect(wrapper.vm.nextPeriod.minimumDuration).toBe(7);
    });

    it("Should define nextPeriodDisableDates length equal to 6", () => {
      expect(wrapper.vm.nextPeriodDisableDates.length).toBe(6);
    });

    it("Should define disabled and not-allowed class on day before possible checkout", () => {
      const beforeDay = wrapper.get('[data-testid="day-2023-01-08"]');

      expect(beforeDay.classes()).toContain("calendar_day--in-period");
    });

    it("Should define valid class on possible checkout day", () => {
      const possibleCheckout = wrapper.get('[data-testid="day-2023-01-10"]');

      expect(possibleCheckout.classes()).toContain("calendar_day");
    });
  });

  describe("case 2 (same min duration: 7 nights min then Sunday to Sunday) > I can select from 13/01 to 22/01", () => {
    beforeEach(async () => {
      wrapper = await mount(Calendar, {
        propsData: {
          showYear: true,
          minNights: 3,
          periodDates,
          startDate: new Date(new Date().getFullYear() - 2, 0, 1),
          endDate: new Date(new Date().getFullYear() + 2, 0, 1),
        },
      });

      const paginateNext = wrapper.get(
        '[data-testid="calendar_paginate-next--button"]'
      );
      await paginateNext.trigger("click");

      const checkInDay = wrapper.get('[data-testid="day-2023-01-13"]');
      await checkInDay.trigger("click");
    });

    it("Should define checkInPeriod equal to nextPeriod.minimumDurationNights", () => {
      expect(wrapper.vm.checkInPeriod.minimumDurationNights).toBe(
        wrapper.vm.nextPeriod.minimumDurationNights
      );
    });

    // it("Should render correct text for tooltip", () => {
    //   expect(wrapper.vm.customTooltip).toBe("1 week minimum.");
    // });

    it("Should define dynamicNightCounts to 7", () => {
      expect(wrapper.vm.dynamicNightCounts).toBe(7);
    });

    it("Should define last nextPeriodDisableDates equal to Sunday", () => {
      // The last day disable must be a Saturday to be able to output on Sunday
      expect(new Date(wrapper.vm.nextPeriodDisableDates[7]).getDay()).toBe(6);
    });

    it("Should define nextPeriod.minimumDuration equal to 1", () => {
      expect(wrapper.vm.nextPeriod.minimumDuration).toBe(1);
    });

    it("Should define nextPeriodDisableDates length equal to 8", () => {
      expect(wrapper.vm.nextPeriodDisableDates.length).toBe(8);
    });

    it("Should define disabled and not-allowed class on day before possible checkout", () => {
      const beforeDay = wrapper.get('[data-testid="day-2023-01-21"]');

      // DisableDates
      expect(beforeDay.classes()).toContain("calendar_day--in-period");
    });

    it("Should define valid class on possible checkout day", () => {
      const possibleCheckout = wrapper.get('[data-testid="day-2023-01-22"]');

      // Possible CheckOut
      expect(possibleCheckout.classes()).toContain("calendar_day");
    });
  });

  describe("case 2 (min duration: 10 nights min > only Sunday to Sunday) > I must be able to select from 24/02 to 5/03 Sunday to Sunday takes priority over the 10 night minimum", () => {
    beforeEach(async () => {
      wrapper = await mount(Calendar, {
        propsData: {
          showYear: true,
          minNights: 3,
          periodDates,
          startDate: new Date(new Date().getFullYear() - 2, 0, 1),
          endDate: new Date(new Date().getFullYear() + 2, 0, 1),
        },
      });

      const paginateNext = wrapper.get(
        '[data-testid="calendar_paginate-next--button"]'
      );
      await paginateNext.trigger("click");

      const checkInDay = wrapper.get('[data-testid="day-2023-02-24"]');
      await checkInDay.trigger("click");
    });

    it("Should define checkInPeriod equal to nextPeriod.minimumDurationNights", () => {
      expect(wrapper.vm.checkInPeriod.minimumDurationNights).toBe(7);
    });

    // it("Should render correct text for tooltip", () => {
    //   expect(wrapper.vm.customTooltip).toBe("1 week minimum.");
    // });

    it("Should define dynamicNightCounts to 7", () => {
      expect(wrapper.vm.dynamicNightCounts).toBe(7);
    });

    it("Should define last nextPeriodDisableDates equal to Sunday", () => {
      // The last day disable must be a Saturday to be able to output on Sunday
      expect(new Date(wrapper.vm.nextPeriodDisableDates[7]).getDay()).toBe(6);
    });

    it("Should define nextPeriod.minimumDuration equal to 1", () => {
      expect(wrapper.vm.nextPeriod.minimumDuration).toBe(1);
    });

    it("Should define nextPeriodDisableDates length equal to 8", () => {
      expect(wrapper.vm.nextPeriodDisableDates.length).toBe(8);
    });

    it("Should define disabled and not-allowed class on day before possible checkout", () => {
      const beforeDay = wrapper.get('[data-testid="day-2023-03-04"]');

      expect(beforeDay.classes()).toContain("calendar_day--in-period");
    });

    it("Should define valid class on possible checkout day", () => {
      const possibleCheckout = wrapper.get('[data-testid="day-2023-03-05"]');

      // Possible CheckOut
      expect(possibleCheckout.classes()).toContain("calendar_day");
    });
  });

  describe("case 2 (min duration: 10 nights min > only Saturday to Saturday) > I must be able to select from 03/02 to 11/02 Saturday to Saturday takes priority over the 10 night minimum", () => {
    beforeEach(async () => {
      wrapper = await mount(Calendar, {
        propsData: {
          showYear: true,
          minNights: 3,
          startDate: new Date(new Date().getFullYear() - 2, 0, 1),
          endDate: new Date(new Date().getFullYear() + 2, 0, 1),
          periodDates: [
            {
              startAt: "2023-01-21",
              endAt: "2023-02-04",
              periodType: "nightly",
              minimumDuration: 10,
            },
            {
              startAt: "2023-02-04",
              endAt: "2023-02-11",
              periodType: "weekly_by_saturday",
              minimumDuration: 1,
            },
          ],
        },
      });

      const paginateNext = wrapper.get(
        '[data-testid="calendar_paginate-next--button"]'
      );
      await paginateNext.trigger("click");

      const checkInDay = wrapper.get('[data-testid="day-2023-02-03"]');
      await checkInDay.trigger("click");
    });

    it("Should define checkInPeriod equal to nextPeriod.minimumDurationNights", () => {
      expect(wrapper.vm.checkInPeriod.minimumDurationNights).toBe(7);
    });

    // it("Should render correct text for tooltip", () => {
    //   expect(wrapper.vm.customTooltip).toBe("1 week minimum.");
    // });

    it("Should define dynamicNightCounts to 7", () => {
      expect(wrapper.vm.dynamicNightCounts).toBe(7);
    });

    it("Should define nextPeriod.minimumDuration equal to 7", () => {
      expect(wrapper.vm.dynamicNightCounts).toBe(7);
    });

    it("Should define nextPeriodDisableDates length equal to 7", () => {
      expect(wrapper.vm.nextPeriodDisableDates.length).toBe(7);
    });

    it("Should define disabled and not-allowed class on day before possible checkout", () => {
      const beforeDay = wrapper.get('[data-testid="day-2023-02-10"]');

      expect(beforeDay.classes()).toContain("calendar_day--in-period");
    });

    it("Should define valid class on possible checkout day", () => {
      const possibleCheckout = wrapper.get('[data-testid="day-2023-02-11"]');

      expect(possibleCheckout.classes()).toContain("calendar_day");
    });
  });

  describe("souss case 3 (duration min night < duration Sunday to Sunday): Sunday to Sunday then 3 nights min > I can select from 25/12 to 02/01", () => {
    beforeEach(async () => {
      wrapper = await mount(Calendar, {
        propsData: {
          minNights: 3,
          alwaysVisible: true,
          startDate: new Date("2022-12-01"),
          periodDates: [
            {
              startAt: "2022-12-18",
              endAt: "2023-01-01",
              periodType: "weekly_by_sunday",
              minimumDuration: 1,
            },
            {
              startAt: "2023-01-01",
              endAt: "2023-01-05",
              periodType: "nightly",
              minimumDuration: 3,
            },
          ],
        },
      });

      const checkInDay = wrapper.get('[data-testid="day-2022-12-25"]');
      await checkInDay.trigger("click");
    });

    it("Should define checkInPeriod equal to nextPeriod.minimumDurationNights", () => {
      expect(wrapper.vm.checkInPeriod.minimumDurationNights).toBe(7);
    });

    // it("Should render correct text for tooltip", () => {
    //   expect(wrapper.vm.customTooltip).toBe("1 week minimum.");
    // });

    it("Should define dynamicNightCounts to 7", () => {
      expect(wrapper.vm.dynamicNightCounts).toBe(7);
    });

    it("Should define last nextPeriodDisableDates equal to Sunday", () => {
      // The last day disable must be a Saturday to be able to output on Sunday
      expect(new Date(wrapper.vm.nextPeriodDisableDates[5]).getDay()).toBe(6);
    });

    it("Should define nextPeriod minimumDurationNights equal to 3", () => {
      expect(wrapper.vm.nextPeriod.minimumDurationNights).toBe(3);
    });

    it("Should define nextPeriodDisableDates length equal to 6", () => {
      expect(wrapper.vm.nextPeriodDisableDates.length).toBe(6);
    });

    it("Should define disabled and not-allowed class on day before possible checkout", () => {
      const beforeDay = wrapper.get('[data-testid="day-2022-12-31"]');

      // DisableDates
      expect(beforeDay.classes()).toContain("calendar_day--in-period");
    });

    it("Should define valid class on possible checkout day", () => {
      const possibleCheckoutOne = wrapper.get('[data-testid="day-2023-01-01"]');
      const possibleCheckoutTwo = wrapper.get('[data-testid="day-2023-01-02"]');

      // Possible CheckOut
      expect(possibleCheckoutOne.classes()).toContain("calendar_day");
      expect(possibleCheckoutTwo.classes()).toContain("calendar_day");
    });

    it("Should add afterMinimumDurationValidDay class on days that are between checkIn and possible checkOut day", () => {});
  });

  describe("case 3 (duration min night > duration Sunday to Sunday): Sunday to Sunday then 10 nights min > I can select from 22/01 to 29/01", () => {
    beforeEach(async () => {
      wrapper = await mount(Calendar, {
        propsData: {
          showYear: true,
          minNights: 3,
          startDate: new Date(new Date().getFullYear() - 2, 0, 1),
          endDate: new Date(new Date().getFullYear() + 2, 0, 1),
          periodDates: [
            {
              startAt: "2023-01-01",
              endAt: "2023-01-05",
              periodType: "nightly",
              minimumDuration: 3,
            },
            {
              startAt: "2023-01-05",
              endAt: "2023-01-15",
              periodType: "nightly",
              minimumDuration: 7,
            },
            {
              startAt: "2023-01-15",
              endAt: "2023-01-29",
              periodType: "weekly_by_sunday",
              minimumDuration: 1,
            },
            {
              startAt: "2023-01-29",
              endAt: "2023-02-26",
              periodType: "nightly",
              minimumDuration: 10,
            },
          ],
        },
      });

      const paginateNext = wrapper.get(
        '[data-testid="calendar_paginate-next--button"]'
      );
      await paginateNext.trigger("click");

      const checkInDay = wrapper.get('[data-testid="day-2023-01-22"]');
      await checkInDay.trigger("click");
    });

    it("Should define checkInPeriod equal to 7", () => {
      expect(wrapper.vm.checkInPeriod.minimumDurationNights).toBe(7);
    });

    // it("Should render correct text for tooltip", () => {
    //   expect(wrapper.vm.customTooltip).toBe("1 week minimum.");
    // });

    it("Should define dynamicNightCounts to 7", () => {
      expect(wrapper.vm.dynamicNightCounts).toBe(7);
    });

    it("Should define last nextPeriodDisableDates equal to Sunday", () => {
      // The last day disable must be a Saturday to be able to output on Sunday
      expect(new Date(wrapper.vm.nextPeriodDisableDates[5]).getDay()).toBe(6);
    });

    it("Should define nextPeriod minimumDurationNights equal to 10", () => {
      expect(wrapper.vm.nextPeriod.minimumDurationNights).toBe(10);
    });

    it("Should define nextPeriodDisableDates length equal to 6", () => {
      expect(wrapper.vm.nextPeriodDisableDates.length).toBe(6);
    });

    it("Should define disabled and not-allowed class on day before possible checkout", () => {
      const beforeDay = wrapper.get('[data-testid="day-2023-01-28"]');

      expect(beforeDay.classes()).toContain("calendar_day--in-period");
    });

    it("Should define valid class on possible checkout day", () => {
      const possibleCheckoutOne = wrapper.get('[data-testid="day-2023-01-29"]');
      const possibleCheckoutTwo = wrapper.get('[data-testid="day-2023-01-30"]');

      expect(possibleCheckoutOne.classes()).toContain("calendar_day");
      expect(possibleCheckoutTwo.classes()).toContain("calendar_day");
    });

    it("Should add afterMinimumDurationValidDay class on days that are between checkIn and possible checkOut day", () => {});
  });

  describe("case 4 (same min duration): saturday to saturday (min 2 weeks each period) > I can select from sept 3 to sept 17", () => {
    beforeEach(async () => {
      wrapper = await mount(Calendar, {
        propsData: {
          showYear: true,
          minNights: 3,
          startDate: new Date(new Date().getFullYear() - 2, 0, 1),
          endDate: new Date(new Date().getFullYear() + 2, 0, 1),
          periodDates,
        },
      });

      const checkInDay = wrapper.get('[data-testid="day-2022-09-03"]');
      await checkInDay.trigger("click");
    });

    it("Should define checkInPeriod equal to nextPeriod.minimumDurationNights", () => {
      expect(wrapper.vm.checkInPeriod.minimumDurationNights).toBe(14);
    });

    // it("Should render correct text for tooltip", () => {
    //   expect(wrapper.vm.customTooltip).toBe("2 weeks minimum.");
    // });

    it("Should define dynamicNightCounts to 14", () => {
      expect(wrapper.vm.dynamicNightCounts).toBe(14);
    });

    it("Should define last nextPeriodDisableDates equal to Thursday", () => {
      // The last day disable must be a Thursday to be able to exit on Friday
      expect(new Date(wrapper.vm.nextPeriodDisableDates[12]).getDay()).toBe(5);
    });

    it("Should define nextPeriod.minimumDuration equal to 14", () => {
      expect(wrapper.vm.nextPeriod.minimumDurationNights).toBe(14);
    });

    it("Should define nextPeriodDisableDates length equal to 6", () => {
      expect(wrapper.vm.nextPeriodDisableDates.length).toBe(13);
    });

    it("Should define disabled and not-allowed class on day before possible checkout", () => {
      const beforeDay = wrapper.get('[data-testid="day-2022-09-16"]');

      expect(beforeDay.classes()).toContain("calendar_day--in-period");
    });

    it("Should define valid class on possible checkout day", () => {
      const possibleCheckout = wrapper.get('[data-testid="day-2022-09-17"]');

      expect(possibleCheckout.classes()).toContain("calendar_day");
    });

    it("Should add afterMinimumDurationValidDay class on days that are between checkIn and possible checkOut day", () => {});
  });

  describe("case 4 minimumDuration 4, nextPeriod saturday to saturday (min 2 weeks each period) > I can't select december 17", () => {
    beforeEach(async () => {
      wrapper = await mount(Calendar, {
        propsData: {
          showYear: true,
          minNights: 3,
          startDate: new Date(new Date().getFullYear() - 2, 0, 1),
          endDate: new Date(new Date().getFullYear() + 2, 0, 1),
          periodDates: [
            {
              startAt: "2022-12-05",
              endAt: "2022-12-10",
              minimumDuration: 4,
              periodType: "nightly",
            },
            {
              startAt: "2022-12-10",
              endAt: "2022-12-24",
              minimumDuration: 2,
              periodType: "weekly_by_saturday",
            },
          ],
        },
      });

      const checkInDay = wrapper.get('[data-testid="day-2022-12-05"]');

      await checkInDay.trigger("click");
    });

    it("Should define checkInPeriod equal to nextPeriod.minimumDurationNights", () => {
      expect(wrapper.vm.checkInPeriod.minimumDurationNights).toBe(4);
    });

    // it("Should render correct text for tooltip", () => {
    //   expect(wrapper.vm.customTooltip).toBe("4 Nights minimum.");
    // });

    it("Should define dynamicNightCounts to 14", () => {
      expect(wrapper.vm.dynamicNightCounts).toBe(4);
    });

    it("Should define nextPeriod", () => {
      expect(wrapper.vm.nextPeriod.minimumDurationNights).toBe(14);
    });

    it("Should define nextPeriodDisableDates length equal to 6", () => {
      expect(wrapper.vm.nextPeriodDisableDates.length).toBe(16);
    });

    it("Should define last nextPeriodDisableDates equal to Thursday", () => {
      // The last day disable must be a Thursday to be able to exit on Friday
      expect(new Date(wrapper.vm.nextPeriodDisableDates[15]).getDay()).toBe(5);
    });

    it("Should define disabled and not-allowed class on day before possible checkout", () => {
      const beforeDay = wrapper.get('[data-testid="day-2022-12-17"]');

      expect(beforeDay.classes()).toContain("calendar_day--in-period");
    });

    it("Should define valid class on possible checkout day", () => {
      const possibleCheckoutOne = wrapper.get('[data-testid="day-2022-12-09"]');
      const possibleCheckoutTwo = wrapper.get('[data-testid="day-2022-12-10"]');
      const possibleCheckoutThree = wrapper.get(
        '[data-testid="day-2022-12-24"]'
      );

      expect(possibleCheckoutOne.classes()).toContain("calendar_day");
      expect(possibleCheckoutTwo.classes()).toContain("calendar_day");
      expect(possibleCheckoutThree.classes()).toContain("calendar_day");
    });

    it("Should add afterMinimumDurationValidDay class on days that are between checkIn and possible checkOut day", () => {});
  });

  describe("case 4 (2 different durations): Saturday to Saturday (min 2 weeks and min 3 weeks) > I can select from 15/10 to 05/11", () => {
    beforeEach(async () => {
      wrapper = await mount(Calendar, {
        propsData: {
          showYear: true,
          minNights: 3,
          startDate: new Date(new Date().getFullYear() - 2, 0, 1),
          endDate: new Date(new Date().getFullYear() + 2, 0, 1),
          periodDates,
        },
      });

      const checkInDay = wrapper.get('[data-testid="day-2022-10-15"]');

      await checkInDay.trigger("click");
    });

    it("Should define checkInPeriod equal to nextPeriod.minimumDurationNights", () => {
      expect(wrapper.vm.checkInPeriod.minimumDurationNights).toBe(21);
    });

    // it("Should render correct text for tooltip", () => {
    //   expect(wrapper.vm.customTooltip).toBe("3 weeks minimum.");
    // });

    it("Should define dynamicNightCounts to 21", () => {
      expect(wrapper.vm.dynamicNightCounts).toBe(21);
    });

    it("Should define last nextPeriodDisableDates equal to Thursday", () => {
      // The last day disable must be a Thursday to be able to exit on Friday
      expect(new Date(wrapper.vm.nextPeriodDisableDates[19]).getDay()).toBe(5);
    });

    it("Should define nextPeriod.minimumDuration equal to 21", () => {
      expect(wrapper.vm.dynamicNightCounts).toBe(21);
    });

    it("Should define nextPeriodDisableDates length equal to 6", () => {
      expect(wrapper.vm.nextPeriodDisableDates.length).toBe(20);
    });

    it("Should define disabled and not-allowed class on day before possible checkout", () => {
      const beforeDay = wrapper.get('[data-testid="day-2022-11-04"]');

      // DisableDates
      expect(beforeDay.classes()).toContain("calendar_day--in-period");
    });

    it("Should define valid class on possible checkout day", () => {
      const possibleCheckout = wrapper.get('[data-testid="day-2022-11-05"]');

      // Possible CheckOut
      expect(possibleCheckout.classes()).toContain("calendar_day");
    });
  });

  describe("case 5 (Saturday to Saturday then Sunday to Sunday) > I must not be able to select from 08/04 to 16/04 but I can select from 08/04 to 30/04", () => {
    beforeEach(async () => {
      wrapper = await mount(Calendar, {
        propsData: {
          showYear: true,
          minNights: 3,
          startDate: new Date(new Date().getFullYear() - 2, 0, 1),
          endDate: new Date(new Date().getFullYear() + 2, 0, 1),
          periodDates,
        },
      });

      const paginateNext = wrapper.get(
        '[data-testid="calendar_paginate-next--button"]'
      );
      await paginateNext.trigger("click");

      const checkInDay = wrapper.get('[data-testid="day-2023-04-08"]');
      await checkInDay.trigger("click");
    });

    it("Should define checkInPeriod equal to nextPeriod.minimumDurationNights", () => {
      expect(wrapper.vm.checkInPeriod.minimumDurationNights).toBe(21);
    });

    // it("Should render correct text for tooltip", () => {
    //   expect(wrapper.vm.customTooltip).toBe("3 weeks minimum.");
    // });

    it("Should define dynamicNightCounts to 21", () => {
      expect(wrapper.vm.dynamicNightCounts).toBe(21);
    });

    it("Should define last nextPeriodDisableDates equal to Saturday", () => {
      // The last day disable must be a Saturday to be able to output on Sunday
      expect(new Date(wrapper.vm.nextPeriodDisableDates[6]).getDay()).toBe(6);
    });

    it("Should define nextPeriod.minimumDurationNights to 7", () => {
      expect(wrapper.vm.nextPeriod.minimumDurationNights).toBe(7);
    });

    it("Should define nextPeriodDisableDates length equal to 21", () => {
      expect(wrapper.vm.nextPeriodDisableDates.length).toBe(21);
    });

    it("Should define disabled and not-allowed class on day before possible checkout", () => {
      const beforeDayOne = wrapper.get('[data-testid="day-2023-04-16"]');
      const beforeDayTwo = wrapper.get('[data-testid="day-2023-04-23"]');
      const beforeDayThree = wrapper.get('[data-testid="day-2023-04-29"]');

      // Can't select the 2023-04-16
      expect(beforeDayOne.classes()).toContain("calendar_day--in-period");

      // Can't select the 2023-04-23
      expect(beforeDayTwo.classes()).toContain("calendar_day--in-period");

      // Can't select the 2023-04-29
      expect(beforeDayThree.classes()).toContain("calendar_day--in-period");
    });

    it("Should define valid class on possible checkout day", () => {
      const possibleCheckout = wrapper.get('[data-testid="day-2023-04-30"]');

      expect(possibleCheckout.classes()).toContain("calendar_day");
    });
  });

  describe("case 5 (Saturday to Saturday then Sunday to Sunday) > I must be able to select from 24/12 to 31/12", () => {
    beforeEach(async () => {
      wrapper = await mount(Calendar, {
        propsData: {
          showYear: true,
          minNights: 3,
          startDate: new Date(new Date().getFullYear() - 2, 0, 1),
          endDate: new Date(new Date().getFullYear() + 2, 0, 1),
          periodDates: [
            {
              startAt: "2022-12-24",
              endAt: "2022-12-31",
              periodType: "weekly_by_saturday",
              minimumDuration: 1,
            },
            {
              startAt: "2023-01-01",
              endAt: "2023-01-15",
              periodType: "weekly_by_sunday",
              minimumDuration: 2,
            },
          ],
        },
      });

      const checkInDay = wrapper.get('[data-testid="day-2022-12-24"]');

      await checkInDay.trigger("click");
    });

    it("Should define checkInPeriod equal to nextPeriod.minimumDurationNights", () => {
      expect(wrapper.vm.checkInPeriod.minimumDurationNights).toBe(7);
    });

    // it("Should render correct text for tooltip", () => {
    //   expect(wrapper.vm.customTooltip).toBe("1 week minimum.");
    // });

    it("Should define dynamicNightCounts to 7", () => {
      expect(wrapper.vm.dynamicNightCounts).toBe(7);
    });

    it("Should define nextPeriodDisableDates length equal to 12", () => {
      expect(wrapper.vm.nextPeriodDisableDates.length).toBe(12);
    });

    it("Should define last nextPeriodDisableDates equal to Saturday", () => {
      // The last day disable must be a Saturday to be able to output on Sunday
      expect(new Date(wrapper.vm.nextPeriodDisableDates[5]).getDay()).toBe(5);
    });

    it("Should define nextPeriod.minimumDurationNights to 14", () => {
      expect(wrapper.vm.nextPeriod.minimumDurationNights).toBe(14);
    });

    it("Should define disabled and not-allowed class on day before possible checkout", () => {
      const beforeDayOne = wrapper.get('[data-testid="day-2022-12-30"]');

      // Can't select the 2022-12-11
      expect(beforeDayOne.classes()).toContain("calendar_day--in-period");
    });

    it("Should define valid class on possible checkout day", () => {
      const possibleCheckout = wrapper.get('[data-testid="day-2022-12-31"]');

      expect(possibleCheckout.classes()).toContain("calendar_day");
    });
  });

  // describe.only("case 6 (1 period then no period): Saturday to Saturday (min 1 weeks and default minimumDuration) > I can select from 05/03 to 08/03", () => {
  //   beforeEach(async () => {
  //     wrapper = await mount(Calendar, {
  //       propsData: {
  //         alwaysVisible: true,
  //         minNights: 3,
  //         periodDates,
  //         startDate: new Date("2023-03-01"),
  //       },
  //     });

  //     const checkInDay = wrapper.get('[data-testid="day-2023-03-05"]');
  //     await checkInDay.trigger("click");

  //     await flushPromises();

  //     console.log("checkIn", wrapper.vm.checkIn);
  //   });

  //   it("Should define checkInPeriod equal to nextPeriod.minimumDurationNights", () => {
  //     console.log("wrapper.vm.checkIn", wrapper.vm.checkIn);

  //     expect(wrapper.vm.checkInPeriod.minimumDurationNights).toBe(3);
  //   });

  //   // it("Should render correct text for tooltip", () => {
  //   //   expect(wrapper.vm.customTooltip).toBe("3 Nights minimum.");
  //   // });

  //   it("Should define dynamicNightCounts to 0", () => {
  //     expect(wrapper.vm.dynamicNightCounts).toBe(0);
  //   });

  //   it("Should define nextPeriodDisableDates to []", () => {
  //     expect(wrapper.vm.nextPeriodDisableDates).toEqual([]);
  //   });

  //   it("Should define nextPeriod.minimumDuration equal to 0", () => {
  //     expect(wrapper.vm.dynamicNightCounts).toBe(0);
  //   });

  //   it("Should define nextPeriodDisableDates length equal to 0", () => {
  //     expect(wrapper.vm.nextPeriodDisableDates.length).toBe(0);
  //   });

  //   it("Should define disabled and not-allowed class on day before possible checkout", () => {
  //     const beforeDay = wrapper.get('[data-testid="day-2023-03-07"]');

  //     expect(beforeDay.classes()).toContain("calendar_day--in-period");
  //   });

  //   it("Should define valid class on possible checkout day", () => {
  //     const possibleCheckout = wrapper.get('[data-testid="day-2023-03-08"]');

  //     expect(possibleCheckout.classes()).toContain("calendar_day");
  //   });
  // });

  describe("case 7 (1 period then no period): Monday to Monday (min 1 weeks and default minimumDuration) > I can select from 04/12 to 11/12", () => {
    beforeEach(async () => {
      wrapper = await mount(Calendar, {
        propsData: {
          alwaysVisible: true,
          minNights: 3,
          periodDates,
          startDate: new Date("2023-11-01"),
        },
      });

      const checkInDay = wrapper.get('[data-testid="day-2023-12-04"]');
      await checkInDay.trigger("click");
    });

    it("Should define checkInPeriod equal to nextPeriod.minimumDurationNights", () => {
      expect(wrapper.vm.checkInPeriod.minimumDurationNights).toBe(7);
    });

    it("Should define dynamicNightCounts to 7", () => {
      expect(wrapper.vm.dynamicNightCounts).toBe(7);
    });

    it("Should define nextPeriod.minimumDuration equal to 7", () => {
      expect(wrapper.vm.dynamicNightCounts).toBe(7);
    });

    it("Should define nextPeriodDisableDates length equal to 6", () => {
      expect(wrapper.vm.nextPeriodDisableDates.length).toBe(6);
    });

    it("Should define disabled and not-allowed class on day before possible checkout", () => {
      const beforeDay = wrapper.get('[data-testid="day-2023-12-03"]');

      expect(beforeDay.classes()).toContain("calendar_day--in-period");
    });

    it("Should define valid class on possible checkout day", () => {
      const possibleCheckout = wrapper.get('[data-testid="day-2023-12-11"]');

      expect(possibleCheckout.classes()).toContain("calendar_day");
    });
  });
});

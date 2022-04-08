import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { mount } from "@vue/test-utils";
import CalendarHeader from "~/components/CalendarHeader.vue";

let wrapper: any;

beforeEach(() => {
  wrapper = mount(CalendarHeader, {
    props: {
      months: [
        { monthName: "January" },
        { monthName: "February" },
        { monthName: "March" },
        { monthName: "April" },
      ],
      activeIndex: 1,
    },
    global: {
      stubs: ["base-icon"],
    },
  });
});

afterEach(() => {
  wrapper.unmount();
});

describe("CalendarHeader", () => {
  it("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy();
  });

  describe("prevMonth", () => {
    it("should returns February", async () => {
      expect(wrapper.vm.prevMonth).toBe("February");
    });
  });

  describe("nextMonth", () => {
    it("should returns February", async () => {
      expect(wrapper.vm.nextMonth).toBe("March");
    });
  });

  describe("Prev Button", () => {
    it("should emits prev paginate", async () => {
      const prevButton = wrapper.get('[data-testid="button-prev-month"]');
      await prevButton.trigger("click");

      expect(wrapper.emitted("paginate")[0][0]).toBe("-");
    });

    it("should be disabled", async () => {
      wrapper.setProps({ activeIndex: 0 });
      const prevButton = wrapper.get('[data-testid="button-prev-month"]');
      await prevButton.trigger("click");

      expect(prevButton.isDisabled()).toBeTruthy();
    });
  });

  describe("Next Button", () => {
    it("should emits next paginate", async () => {
      const nextButton = wrapper.get('[data-testid="button-next-month"]');
      await nextButton.trigger("click");

      expect(wrapper.emitted("paginate")[0][0]).toBe("+");
    });

    it("should be disabled", async () => {
      wrapper.setProps({ activeIndex: 2 });
      const nextButton = wrapper.get('[data-testid="button-next-month"]');
      await nextButton.trigger("click");

      expect(nextButton.isDisabled()).toBeTruthy();
    });
  });
});

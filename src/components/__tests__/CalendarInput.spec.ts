import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { format } from "../plugins/day";

import { mount } from "@vue/test-utils";
import CalendarInput from "~/components/CalendarInput.vue";

let wrapper: any;

const dayFormat = (date: Date) => {
  return format(date, "YYYY-MM-DD");
};
const checkIn = new Date();
const checkOut = new Date();

beforeEach(() => {
  wrapper = mount(CalendarInput, {
    props: {
      checkIn,
      checkOut,
      dayFormat,
      placeholder: { checkIn: "Start Date", checkOut: "End date" },
    },
    global: {
      stubs: ["base-icon"],
    },
  });
});

afterEach(() => {
  wrapper.unmount();
});

describe("CalendarInput", () => {
  it("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy();
  });

  it("should emits open-calendar", async () => {
    const calendarInput = wrapper.get('[data-testid="calendar_input"]');
    await calendarInput.trigger("click");

    expect(wrapper.emitted("open-calendar")).toEqual([[]]);
  });

  it("should render checkIn date", () => {
    const checkInDate = wrapper.get('[data-testid="checkIn"]');

    expect(checkInDate.text()).toBe(dayFormat(checkIn));
  });

  it("should render checkOut date", () => {
    const checkOutDate = wrapper.get('[data-testid="checkOut"]');

    expect(checkOutDate.text()).toBe(dayFormat(checkOut));
  });

  it("should render checkIn placeholder", async () => {
    await wrapper.setProps({ checkIn: null, checkOut: null });
    const checkInDate = wrapper.get('[data-testid="checkIn"]');

    expect(checkInDate.text()).toBe("Start Date");
  });

  it("should render checkOut placeholder", async () => {
    await wrapper.setProps({ checkIn: null, checkOut: null });
    const checkOutDate = wrapper.get('[data-testid="checkOut"]');

    expect(checkOutDate.text()).toBe("End date");
  });
});

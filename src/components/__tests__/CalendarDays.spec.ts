import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { mount } from "@vue/test-utils";
import CalendarDays from "~/components/CalendarDays.vue";

let wrapper: any;

beforeEach(() => {
  wrapper = mount(CalendarDays);
});

afterEach(() => {
  wrapper.unmount();
});

describe("CalendarDays", () => {
  it("is a Vue instance", () => {
    expect(wrapper.vm).toBeTruthy();
  });

  it("renders CalendarDays properly", () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});

import { beforeEach, describe, expect, it } from "vitest";

import { mount } from "@vue/test-utils";
import BaseIcon from "../BaseIcon.vue";

let wrapper: any;

beforeEach(() => {
  expect(BaseIcon).toBeTruthy();

  wrapper = mount(BaseIcon);
});

describe("BaseIcon", () => {
  it("renders calendar properly", async () => {
    await wrapper.setProps({ name: "calendar" });

    expect(wrapper.vm.path).toEqual(
      "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    );
  });

  it("renders arrowNarrowRight properly", async () => {
    await wrapper.setProps({ name: "arrowNarrowRight" });

    expect(wrapper.vm.path).toEqual("M17 8l4 4m0 0l-4 4m4-4H3");
  });

  it("renders chevronLeft properly", async () => {
    await wrapper.setProps({ name: "chevronLeft" });

    expect(wrapper.vm.path).toEqual("M15 19l-7-7 7-7");
  });

  it("renders chevronRight properly", async () => {
    await wrapper.setProps({ name: "chevronRight" });

    expect(wrapper.vm.path).toEqual("M9 5l7 7-7 7");
  });
});

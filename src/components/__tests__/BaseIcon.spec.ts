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
      "M15 4V2m0 2v2m0-2h-4.5M3 10v9a2 2 0 002 2h14a2 2 0 002-2v-9H3zM3 10V6a2 2 0 012-2h2M7 2v4M21 10V6a2 2 0 00-2-2h-.5",
    );
  });

  it("renders arrowRight properly", async () => {
    await wrapper.setProps({ name: "arrowRight" });

    expect(wrapper.vm.path).toEqual("M3 12h18m0 0l-8.5-8.5M21 12l-8.5 8.5");
  });

  it("renders chevronLeft properly", async () => {
    await wrapper.setProps({ name: "chevronLeft" });

    expect(wrapper.vm.path).toEqual("M15 6l-6 6 6 6");
  });

  it("renders chevronRight properly", async () => {
    await wrapper.setProps({ name: "chevronRight" });

    expect(wrapper.vm.path).toEqual("M9 6l6 6-6 6");
  });
});

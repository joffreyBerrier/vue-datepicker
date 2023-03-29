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

    expect(wrapper.vm.path).toEqual(
      "M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
    );
  });

  it("renders chevronRight properly", async () => {
    await wrapper.setProps({ name: "chevronRight" });

    expect(wrapper.vm.path).toEqual(
      "M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z"
    );
  });
});

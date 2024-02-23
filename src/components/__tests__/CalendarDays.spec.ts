import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { mount } from "@vue/test-utils";
import CalendarDays from "../CalendarDays.vue";

let wrapper: any;

beforeEach(() => {
  wrapper = mount(CalendarDays, {
    global: {
      provide: {
        t: (key: string): string => {
          const translation: any = {
            days: {
              monday: "Mo",
              tuesday: "Tu",
              wednesday: "We",
              thursday: "Th",
              friday: "Fr",
              saturday: "Sa",
              sunday: "Su",
            },
          };

          if (key.includes(".")) {
            const a = key.split(".");

            const translationValue = translation[a[0]][a[1]];
            return translationValue;
          } else {
            return translation[key];
          }
        },
      },
    },
  });
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

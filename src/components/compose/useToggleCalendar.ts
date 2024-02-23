import type { Ref } from "vue";
import { ref, nextTick, watch } from "vue";

import { calculIndex } from "../helpers";

export const useToggleCalendar = (
  activeMobileIndex: Ref<number>,
  calendarWrapperContent: Ref<HTMLElement | null>,
  heightOfCalendarMonth: Ref<number>,
  isMobile: Ref<boolean>,
  props: any,
) => {
  const showCalendar = props.alwaysVisible ? ref(true) : ref(false);
  const calendarRef: Ref<HTMLElement | null> = ref(null);
  const ignoreOutsideClick = ref(false);

  const handleClickOutside = (event: Event) => {
    const ignoredElement = calendarRef.value;

    if (showCalendar.value && !ignoreOutsideClick.value) {
      if (ignoredElement) {
        const target = event.target as HTMLElement;
        const isIgnoredElementClicked = ignoredElement.contains(target);

        if (!isIgnoredElementClicked) {
          showCalendar.value = false;
        }
      }
    } else {
      ignoreOutsideClick.value = false;
    }
  };

  const addClickOusideListener = () => {
    if (props.alwaysVisible === false) {
      document.addEventListener("click", handleClickOutside, false);
    }
  };
  const removeClickOusideListener = () => {
    if (props.alwaysVisible === false) {
      document.removeEventListener("click", handleClickOutside);
    }
  };

  const scrollToCheckIn = () => {
    heightOfCalendarMonth.value =
      document.querySelector(".calendar_wrap_month")?.getBoundingClientRect()
        ?.height || 0;

    const currentIndex = calculIndex({
      date: props.checkIn,
      startDate: props.startDate,
      showYear: props.showYear,
    });

    if (props.checkIn && props.checkOut) {
      const count = currentIndex - activeMobileIndex.value;

      if (calendarWrapperContent.value) {
        calendarWrapperContent.value.scrollTo({
          top: heightOfCalendarMonth.value * count,
        });
      }
    }
  };

  const openCalendar = () => {
    ignoreOutsideClick.value = true;
    showCalendar.value = true;

    if (isMobile.value) {
      nextTick(() => {
        scrollToCheckIn();
      });
    }
  };
  const closeCalendar = () => {
    if (props.alwaysVisible === false) {
      ignoreOutsideClick.value = true;
      showCalendar.value = false;
    }
  };
  const toggleCalendar = () => {
    ignoreOutsideClick.value = true;
    showCalendar.value = !showCalendar.value;

    if (showCalendar.value && isMobile.value) {
      nextTick(() => {
        scrollToCheckIn();
      });
    }
  };

  watch(
    () => props.alwaysVisible,
    (newVal) => {
      if (newVal) {
        removeClickOusideListener();
        openCalendar();
      } else {
        addClickOusideListener();
      }
    },
  );

  return {
    addClickOusideListener,
    calendarRef,
    closeCalendar,
    openCalendar,
    removeClickOusideListener,
    showCalendar,
    toggleCalendar,
  };
};

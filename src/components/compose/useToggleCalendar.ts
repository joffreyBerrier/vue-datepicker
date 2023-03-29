import type { Ref } from "vue";
import { ref, watch } from "vue";

export const useToggleCalendar = (props: { alwaysVisible: boolean }) => {
  const showCalendar = props.alwaysVisible ? ref(true) : ref(false);
  const calendarRef: Ref<HTMLElement | null> = ref(null);

  const handleClickOutside = (event: Event) => {
    const ignoredElement = calendarRef.value;

    if (ignoredElement && showCalendar.value) {
      const target = event.target as HTMLElement;
      const isIgnoredElementClicked = ignoredElement.contains(target);

      if (!isIgnoredElementClicked) {
        showCalendar.value = false;
      }
    }
  };

  const addClickOusideListener = () => {
    document.addEventListener("click", handleClickOutside, false);
  };
  const removeClickOusideListener = () => {
    document.removeEventListener("click", handleClickOutside);
  };

  const openCalendar = () => {
    showCalendar.value = !showCalendar.value;
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
    }
  );

  return {
    addClickOusideListener,
    calendarRef,
    openCalendar,
    removeClickOusideListener,
    showCalendar,
  };
};

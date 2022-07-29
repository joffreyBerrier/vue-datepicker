import { ref, watch } from "vue";

export const useToggleCalendar = (props) => {
  const showCalendar = props.alwaysVisible ? ref(true) : ref(false);
  const calendarRef = ref(null);

  const handleClickOutside = (event: MouseEvent & { target: HTMLElement }) => {
    const ignoredElement = calendarRef.value;

    if (ignoredElement && showCalendar.value) {
      const isIgnoredElementClicked = ignoredElement.contains(event.target);

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

import { ref, watch, onBeforeMount, onUnmounted, nextTick } from 'vue'

export const useToggleCalendar = (props) => {
  const showCalendar = ref(true)
  const calendarRef = ref(null)

  const handleClickOutside = (event: MouseEvent & { target: HTMLElement }) => {
    const ignoredElement = calendarRef.value

    if (ignoredElement && showCalendar.value) {
      const isIgnoredElementClicked = ignoredElement.contains(event.target)

      if (!isIgnoredElementClicked) {
        showCalendar.value = false
      }
    }
  }

  const addClickOusideListener = () => {
    document.addEventListener('click', handleClickOutside, false)
  }
  const removeClickOusideListener = () => {
    document.removeEventListener('click', handleClickOutside)
  }

  const openCalendar = () => {
    showCalendar.value = !showCalendar.value
  }

  watch(
    () => props.showYear,
    async (newVal) => {
      if (newVal) {
        removeClickOusideListener()
        await nextTick()

        openCalendar()
      } else {
        addClickOusideListener()
      }
    }
  )

  onBeforeMount(() => {
    if (!props.showYear) addClickOusideListener()
  })
  onUnmounted(() => {
    if (!props.showYear) removeClickOusideListener()
  })

  return {
    calendarRef,
    openCalendar,
    showCalendar,
  }
}

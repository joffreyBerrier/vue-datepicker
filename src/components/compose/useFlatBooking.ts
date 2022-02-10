import { ref, Ref } from 'vue'

import { Booking, BookingColor, FlatBooking } from '../../types'
import { getDatesBetweenTwoDates } from '../helpers'

export const useFlatBooking = (
  bookingDates: Booking[],
  bookingColor: BookingColor,
  formattingFormat: Ref<string>
): Ref<FlatBooking[]> => {
  const flatBookingDates: Ref<FlatBooking[]> = ref([])
  const bookingTypeAndDates: {
    [key: string]: string[]
  } = {}

  bookingDates.forEach((booking: Booking) => {
    const flatBookingDatesString: Ref<string[]> = ref(
      getDatesBetweenTwoDates(
        new Date(booking.checkInDate),
        new Date(booking.checkOutDate),
        formattingFormat.value
      )
    )

    if (booking.type) {
      if (bookingTypeAndDates[booking.type]) {
        bookingTypeAndDates[booking.type].push(...flatBookingDatesString.value)
      } else {
        bookingTypeAndDates[booking.type] = flatBookingDatesString.value
      }
    }
  })

  const objectArray = Object.entries(bookingTypeAndDates) as unknown as [
    string,
    string[]
  ][]

  objectArray.forEach(([key, value]) => {
    flatBookingDates.value.push({
      color: bookingColor[key] || '#000000',
      key,
      value,
    })
  })

  return flatBookingDates
}

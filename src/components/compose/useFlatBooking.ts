import { ref } from 'vue'
import type { Ref } from 'vue'

import type { Booking, BookingColor, FlatBooking } from '../../types'
import { getDatesBetweenTwoDates } from '../helpers'

export const useFlatBooking = (
  bookingDates: Booking[],
  bookingColor: BookingColor,
  formattingFormat: Ref<string>
): Ref<FlatBooking[]> => {
  if (!bookingDates?.length) return ref([])

  const flatBookingDates = ref<FlatBooking[]>([])
  const bookingTypeAndDates: {
    [key: string]: string[]
  } = {}

  bookingDates.forEach((booking: Booking) => {
    const flatBookingDatesString = ref(
      getDatesBetweenTwoDates(booking.checkInDate, booking.checkOutDate, formattingFormat.value)
    )

    if (booking.type) {
      if (bookingTypeAndDates[booking.type]) {
        bookingTypeAndDates[booking.type].push(...flatBookingDatesString.value)
      } else {
        bookingTypeAndDates[booking.type] = flatBookingDatesString.value
      }
    }
  })

  const objectArray = Object.entries(bookingTypeAndDates) as unknown as [string, string[]][]

  objectArray.forEach(([key, value]) => {
    flatBookingDates.value.push({
      color: bookingColor[key] || '#000000',
      key,
      value
    })
  })

  return flatBookingDates
}

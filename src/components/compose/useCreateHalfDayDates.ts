import { PropType, ref } from 'vue'

import { Booking, CheckInCheckOutHalfDay, Day } from '../../types'
import {
  getDayDiff,
  getDatesBetweenTwoDates,
  sortDates,
  sortDatesObj,
} from '../helpers'

const createHalfDayDatesWithBookedDates = (
  dates: string[]
): {
  checkIncheckOutHalfDay: CheckInCheckOutHalfDay
  bookedDates: string[]
} => {
  const checkIncheckOutHalfDay: CheckInCheckOutHalfDay = {}
  const bookedDates = sortDates([...dates])

  for (let i = 0; i < bookedDates.length; i++) {
    const newDate = bookedDates[i] as string
    const newDateIncrementOne = bookedDates[i + 1] as string

    if (i === 0) {
      checkIncheckOutHalfDay[newDate] = {
        checkIn: true,
      }
    }

    if (
      !checkIncheckOutHalfDay[newDate] &&
      bookedDates[i + 1] &&
      getDayDiff(newDate, newDateIncrementOne) > 1
    ) {
      checkIncheckOutHalfDay[newDate] = {
        checkOut: true,
      }
      checkIncheckOutHalfDay[newDateIncrementOne] = {
        checkIn: true,
      }
    }

    if (i === bookedDates.length - 1) {
      checkIncheckOutHalfDay[newDate] = {
        checkOut: true,
      }
    }
  }

  return {
    checkIncheckOutHalfDay,
    bookedDates,
  }
}

const createBookingDatesWithHalfDayDates = (
  checkIncheckOutHalfDay: CheckInCheckOutHalfDay
): PropType<Booking[]> => {
  const bookingDates = new Set() as Set<Booking>
  let increment = 0 as number
  const booking = {} as Booking

  Object.keys(checkIncheckOutHalfDay).forEach((date: string, i: number) => {
    increment = i

    if (checkIncheckOutHalfDay[date].checkIn) booking.checkInDate = date
    if (checkIncheckOutHalfDay[date].checkOut) booking.checkOutDate = date

    if (increment % 2 === 1) {
      bookingDates.add({
        checkInDate: booking.checkInDate,
        checkOutDate: booking.checkOutDate,
      })
    }
  })

  return sortDatesObj([...bookingDates])
}

export const useCreateHalfDayDates = (
  bookedDatesProps,
  bookingDatesProps,
  formattingFormat
) => {
  let checkIncheckOutHalfDay = ref({})
  let bookedDates = ref([])

  // Create halfDay dates with booked dates
  const res = createHalfDayDatesWithBookedDates(bookedDatesProps)
  checkIncheckOutHalfDay = res.checkIncheckOutHalfDay
  bookedDates = res.bookedDates

  // Create bookingDates with halfDay
  const newBookingDates = createBookingDatesWithHalfDayDates(
    checkIncheckOutHalfDay
  )

  // Set DisabledDates to []
  const flatBookingDates = ref([])
  const disabledDates = ref([])

  // Field DisabledDates whith BookingDates
  const bookingTypeAndDates: {
    [key: string]: string[]
  } = {}
  // Tamere
  bookingDatesProps.forEach((booking: Booking) => {
    checkIncheckOutHalfDay[booking.checkInDate] = {
      checkIn: true,
    }
    checkIncheckOutHalfDay[booking.checkOutDate] = {
      checkOut: true,
    }

    const flatBookingDate = getDatesBetweenTwoDates(
      new Date(booking.checkInDate),
      new Date(booking.checkOutDate),
      formattingFormat
    )

    if (booking.type) {
      if (bookingTypeAndDates[booking.type]) {
        bookingTypeAndDates[booking.type].push(...flatBookingDate)
      } else {
        bookingTypeAndDates[booking.type] = flatBookingDate
      }
    }
  })

  const objectArray = Object.entries(bookingTypeAndDates)

  objectArray.forEach(([key, value]) => {
    flatBookingDates.value.push({
      color: bookingColor[key] || '#000000',
      key,
      value,
    })

    value.forEach((day) => {
      bookingStyle[day] = bookingColor[key] || '#000000'
    })
  })

  // Field DisabledDates whith BookedDates
  disabledDates = flatBookingDates.value.map((b) => b.value).flat()
  disabledDates.value.push(...bookedDates)
  disabledDates = sortDates(disabledDates)

  checkIncheckOutHalfDay = checkIncheckOutHalfDay

  // Add style on days
  months.forEach((m) => {
    m.days.forEach((day: Day) => {
      day.style = {
        background: !app.checkIncheckOutHalfDay[day.formatDay]
          ? app.bookingStyle[day.formatDay]
          : '',
      }
    })
  })

  return {
    checkIncheckOutHalfDay,
    disabledDates,
  }
}

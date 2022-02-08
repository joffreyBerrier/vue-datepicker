// Calendar
interface Booking {
  checkInDate: string
  checkOutDate: string
  type?: string
}
interface BookingColor {
  [key: string]: string
}
interface HeaderDay {
  key: number
  name: string
}
interface CheckInCheckOutHalfDay {
  [key: string]: {
    checkOut?: boolean
    checkIn?: boolean
  }
}
interface FlatBooking {
  color: string
  key: string
  value: string[]
}
interface Day {
  belongsToThisMonth: boolean
  date: Date
  dayNumber: string
  formatDay: string
  style: {
    [key: string]: string
  }
}
interface Month {
  days: Day[]
  monthKey: number
  monthName: string
  yearKey: number
}

interface Placeholder {
  checkIn: string
  checkOut: string
}

// BaseIcon
interface Icon {
  [key: string]: string
}

interface Period {
  startAt: string
  endAt: string
  minimumDuration: number
  periodType: string
}
interface CurrentPeriod {
  startAt: string
  endAt: string
  minimumDuration: number
  periodType: string
  nextEnableDate: Date
}

export {
  Booking,
  BookingColor,
  CheckInCheckOutHalfDay,
  CurrentPeriod,
  Day,
  FlatBooking,
  HeaderDay,
  Icon,
  Month,
  Period,
  Placeholder,
}

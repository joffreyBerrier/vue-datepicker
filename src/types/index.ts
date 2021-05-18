// Calendar
interface CheckInOrCheckOut {
  checkIn?: boolean
  checkOut?: boolean
}
interface CheckInCheckOutHalfDay {
  [key: string]: CheckInOrCheckOut
}
interface Day {
  belongsToThisMonth: boolean
  date: Date
  dayNumber: string
  formatDay: string
}
interface Month {
  days: Day[]
  monthKey: number
  monthName: string
  yearKey: number
}
interface Booking {
  checkInDate: string
  checkOutDate: string
  type?: string
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
  CheckInCheckOutHalfDay,
  CurrentPeriod,
  Day,
  Icon,
  Month,
  Period,
  Placeholder,
}

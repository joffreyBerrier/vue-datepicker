// Calendar
interface CheckInOrCheckOut {
  checkIn?: boolean;
  checkOut?: boolean;
}
interface CheckInCheckOutHalfDay {
  [key: string]: CheckInOrCheckOut;
}
interface Day {
  belongsToThisMonth: boolean;
  date: Date;
  dayNumber: string;
  formatDay: string;
}
interface Month {
  days: Day[];
  monthKey: number;
  monthName: string;
  yearKey: number;
}
interface Booking {
  checkInDate: string;
  checkInTime: number;
  checkOutDate: string;
  checkOutTime: number;
  type: string;
}
interface Placeholder {
  checkIn: string;
  checkOut: string;
}

// BaseIcon
interface Icon {
  [key: string]: string;
}

export {
  Booking,
  CheckInCheckOutHalfDay,
  Day,
  Icon,
  Month,
  Placeholder,
}

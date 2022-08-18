// Type definitions for vue-calendar 1.1.0
// Project: vue-calendar
// Definitions by: Joffrey Berrier
import type { ComputedRef } from "vue";

interface Booking {
  1?: { id: string; type: string };
  2?: { id: string; type: string };
  checkInDate: string;
  checkOutDate: string;
  id?: string;
  type?: string;
}
interface BookingColor {
  [key: string]: string;
}
interface HeaderDay {
  key: number;
  name: string;
}
interface CheckInCheckOutHalfDay {
  [key: string]: {
    checkOut?: boolean;
    checkIn?: boolean;
  };
}
interface FlatBooking {
  color: string;
  key: string;
  value: string[];
}
interface Day {
  belongsToThisMonth: boolean;
  date: Date;
  dayNumber: string;
  formatDay: string;
  style: {
    [key: string]: string;
  };
}
interface Month {
  days: Day[];
  monthKey: number;
  monthName: string;
  yearKey: number;
}

interface Placeholder {
  checkIn: string | ComputedRef<string>;
  checkOut: string | ComputedRef<string>;
}

interface Icon {
  [key: string]: string;
}

interface Period {
  startAt: string;
  endAt: string;
  minimumDuration: number;
  minimumDurationNights: number;
  periodType: string;
}
interface CurrentPeriod {
  startAt: string;
  endAt: string;
  minimumDuration: number;
  minimumDurationNights: number;
  periodType: string;
  nextEnableDate: Date;
}

export {
  Booking,
  BookingColor,
  HeaderDay,
  CheckInCheckOutHalfDay,
  FlatBooking,
  Day,
  Month,
  Placeholder,
  Icon,
  Period,
  CurrentPeriod,
};

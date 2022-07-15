// Calendar
import type { ComputedRef } from "vue";

export interface Booking {
  checkInDate: string;
  checkOutDate: string;
  type?: string;
}
export interface BookingColor {
  [key: string]: string;
}
export interface HeaderDay {
  key: number;
  name: string;
}
export interface CheckInCheckOutHalfDay {
  [key: string]: {
    checkOut?: boolean;
    checkIn?: boolean;
  };
}
export interface FlatBooking {
  color: string;
  key: string;
  value: string[];
}
export interface Day {
  belongsToThisMonth: boolean;
  date: Date;
  dayNumber: string;
  formatDay: string;
  style: {
    [key: string]: string;
  };
}
export interface Month {
  days: Day[];
  monthKey: number;
  monthName: string;
  yearKey: number;
}

export interface Placeholder {
  checkIn: string | ComputedRef<string>;
  checkOut: string | ComputedRef<string>;
}

// BaseIcon
export interface Icon {
  [key: string]: string;
}

export interface Period {
  startAt: string;
  endAt: string;
  minimumDuration: number;
  minimumDurationNights: number;
  periodType: string;
}
export interface CurrentPeriod {
  startAt: string;
  endAt: string;
  minimumDuration: number;
  minimumDurationNights: number;
  periodType: string;
  nextEnableDate: Date;
}

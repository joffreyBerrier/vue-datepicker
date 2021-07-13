import { format } from 'fecha'

import { addDays } from '../helpers'
import {
  getFirstDayOfMonth,
  getFirstDayOfFirstWeekOfMonth,
  getMonthName,
} from '../generateMonth'

import { Month } from '../../types'

export const useCreateMonth = (date: Date): Month => {
  const firstDayOfWeek = 1 as number
  const maxDaysInMonth = 42 as number // a month is covered by 6 weeks max
  const firstDayOfMonth = getFirstDayOfMonth(date)
  const firstDay = getFirstDayOfFirstWeekOfMonth(date, firstDayOfWeek)
  const month = {
    days: [],
    monthKey: date.getMonth(),
    monthName: getMonthName(firstDayOfMonth),
    yearKey: date.getFullYear(),
  } as Month

  for (let i = 0; i < maxDaysInMonth; i++) {
    const day = addDays(firstDay, i) as Date

    month.days.push({
      belongsToThisMonth: day.getMonth() === month.monthKey,
      date: day,
      dayNumber: format(day, 'D'),
      formatDay: format(day, 'YYYY-MM-DD'),
    })
  }

  return month
}

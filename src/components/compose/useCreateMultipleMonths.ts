import { createMultipleMonth, getNextMonth } from '../generateMonth'

import { Month } from '../../types'

export const useCreateMultipleMonths = (date: Date, max: number): Month[] => {
  let nextMonth = new Date(date)
  const dates = []

  for (let countMonth = 0; countMonth < max; countMonth++) {
    const tempNextMonth = getNextMonth(nextMonth)

    dates.push(tempNextMonth)
    nextMonth = tempNextMonth
  }

  return createMultipleMonth(dates)
}

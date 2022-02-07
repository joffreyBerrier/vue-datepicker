import { format } from 'fecha'

const addDays = (date: string | Date, quantity: number): Date => {
  const result = new Date(date)

  result.setDate(result.getDate() + quantity)

  return result
}

const isDateAfter = (time1: Date, time2: Date): boolean => {
  return new Date(time1) > new Date(time2)
}

const isDateBefore = (time1: Date, time2: Date): boolean => {
  return new Date(time1) < new Date(time2)
}

const getDayDiff = (d1: string, d2: string): number => {
  const t2 = new Date(d2).getTime()
  const t1 = new Date(d1).getTime()

  return parseInt((t2 - t1) / (24 * 3600 * 1000), 10)
}

const resetTimeDate = (date: string): Date => {
  const formatDateAt00 = new Date(date).setHours(0, 0, 0, 0)

  return new Date(formatDateAt00)
}

const validateDateBetweenTwoDates = (
  fromDate: string,
  toDate: string,
  givenDate: string
): boolean => {
  return (
    resetTimeDate(givenDate) <= resetTimeDate(toDate) &&
    resetTimeDate(givenDate) >= resetTimeDate(fromDate)
  )
}

const getDatesBetweenTwoDates = (
  startDate: Date,
  endDate: Date,
  formattingFormat: string
): string[] => {
  const arr = []

  for (
    let dt = new Date(startDate);
    dt <= endDate;
    dt.setDate(dt.getDate() + 1)
  ) {
    const formatDay = format(new Date(dt), formattingFormat)

    arr.push(formatDay)
  }

  return arr
}

const getMonthDiff = (d1: Date, d2: Date): number => {
  let months
  months = (d2.getFullYear() - d1.getFullYear()) * 12
  months -= d1.getMonth()
  months += d2.getMonth()

  return months <= 0 ? 0 : months
}

export {
  addDays,
  getDatesBetweenTwoDates,
  getDayDiff,
  isDateAfter,
  isDateBefore,
  getMonthDiff,
  resetTimeDate,
  validateDateBetweenTwoDates,
}

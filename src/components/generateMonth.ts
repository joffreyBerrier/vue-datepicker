import { format } from 'fecha';

interface Day {
  belongsToThisMonth: boolean;
  date: Date;
  dayNumber: number;
  formatDay: string;
}
interface Month {
  days: Day[];
  monthKey: number;
  monthName: string;
  yearKey: number;
}

const getMonthName = (day: Date) => {
  const currentMonth = format(day, "MMMM");
  const currentYear = format(day, " YYYY");

  return `${currentMonth} ${currentYear}`;
}

const getFirstDayOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

const getFirstDay = (date: Date, firstDayOfWeek: number) => {
  const firstDay = getFirstDayOfMonth(date);
  let offset = 0;

  if (firstDayOfWeek > 0) {
    offset = firstDay.getDay() === 0 ? -7 + firstDayOfWeek : firstDayOfWeek;
  }

  return new Date(
    firstDay.setDate(firstDay.getDate() - (firstDay.getDay() - offset))
  );
}

const addDays = (date: Date, quantity: number) => {
  const result = new Date(date);

  result.setDate(result.getDate() + quantity);

  return result;
}

const createMonth = (date: Date): Month => {
  const firstDayOfMonth = getFirstDayOfMonth(date);
  const firstDay = getFirstDay(date, 1);
  const month = {
    days: [],
    monthKey: date.getMonth(),
    monthName: getMonthName(firstDayOfMonth),
    yearKey: date.getFullYear(),
  } as any;

  for (let i = 0; i < 42; i++) {
    const day = addDays(firstDay, i);

    month.days.push({
      belongsToThisMonth: day.getMonth() === date.getMonth(),
      date: day,
      dayNumber: format(day, "D"),
      formatDay: format(day, "DD/MM/YYYY"),
    });
  }

  return month;
}

const getNextMonth = (date: Date) => {
  let nextMonth;

  if (date.getMonth() === 11) {
    nextMonth = new Date(date.getFullYear() + 1, 0, 1);
  } else {
    nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  }

  return nextMonth;
}

const renderMultipleMonth = (date: Date, max: number) => {
  let nextMonth = new Date(date);
  const dates = [];

  for (let countMonth = 0; countMonth < max; countMonth++) {
    const tempNextMonth = getNextMonth(nextMonth);

    dates.push(tempNextMonth);
    nextMonth = tempNextMonth;
  }

  return createMultipleMonth(dates);
}

const createMultipleMonth = (dates: Date[]): Month[] => {
  const months = [] as Month[];

  for (let d = 0; d < dates.length; d++) {
    const currentDate = dates[d] as Date;

    months.push(createMonth(currentDate));
  }

  return months
}

export {
  createMonth, renderMultipleMonth
}

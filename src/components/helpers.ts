const addDays = (date: string | Date, quantity: number): Date => {
  const result = new Date(date);

  result.setDate(result.getDate() + quantity);

  return result;
}

const isDateAfter = (time1: Date, time2: Date): boolean => {
  return new Date(time1) > new Date(time2);
}

const isDateBefore = (time1: Date, time2: Date): boolean => {
  return new Date(time1) < new Date(time2);
}

const getDayDiff = (d1: string, d2: string): number => {
  const t2 = new Date(d2).getTime();
  const t1 = new Date(d1).getTime();

  return parseInt((t2 - t1) / (24 * 3600 * 1000), 10);
}

export {
  addDays,
  getDayDiff,
  isDateAfter,
  isDateBefore
}

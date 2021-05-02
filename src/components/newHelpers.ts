const addDays = (date: string | Date, quantity: number): Date => {
  const result = new Date(date);

  result.setDate(result.getDate() + quantity);

  return result;
}

const isDateAfter = (time1: Date, time2: Date) => {
  return new Date(time1) > new Date(time2);
}

const isDateBefore = (time1: Date, time2: Date) => {
  return new Date(time1) < new Date(time2);
}

export {
  addDays,
  isDateAfter,
  isDateBefore
}

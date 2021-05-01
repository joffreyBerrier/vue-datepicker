const isDateBefore = (time1: Date, time2: Date) => {
  return new Date(time1) < new Date(time2);
}

export {
  isDateBefore
}

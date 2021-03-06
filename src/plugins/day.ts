import { default as dayjs } from "dayjs";

// Format DayJs
const format = (date: Date, format: string): string => {
  const d = dayjs(date);

  return d.format(format);
};

const addDays = (date: Date | string, quantity: number): Date => {
  const d = dayjs(date);

  return d.add(quantity, "day").toDate();
};

export { addDays, format };

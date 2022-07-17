import dayjs from "dayjs";


export function getMonth(year = dayjs().year(), month) {
  // console.log(month)
  month = Math.floor(month);
  const firstDayOfTheMonth = dayjs(new Date(year, month, 1)).day();
  let currentMonthCount = 0 - firstDayOfTheMonth;
  const daysMatrix = new Array(5).fill([]).map(() => {
    return new Array(7).fill(null).map(() => {
      currentMonthCount++;
      return dayjs(new Date(year, month, currentMonthCount));
    });
  });
  return daysMatrix;
}

export function getMonthDay() {
  return dayjs().month();
}

export function getYear() {
  return dayjs().year();
}


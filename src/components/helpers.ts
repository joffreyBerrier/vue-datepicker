import {
  addDate,
  format,
  getDateDiff,
  getDatesBetweenTwoDates,
  getDaysArray,
  getNextDate,
  isAfter,
  isBefore,
  isBeforeOrEqual,
  isBetweenDate,
  subtractDate,
} from "../plugins/day";
import type { Booking } from "../types";

const convertHexToRGBA = (hexCode: string, opacity = 1): string => {
  if (hexCode) {
    let hex = hexCode.replace("#", "");

    if (hex.length === 3) {
      hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    if (opacity > 1 && opacity <= 100) {
      opacity = opacity / 100;
    }

    return `rgba(${r},${g},${b},${opacity})`;
  }

  return "";
};

const isDateAfter = (time1: Date, time2: Date): boolean => {
  return isAfter(time1, time2);
};

const isDateBefore = (time1: string | Date, time2: string | Date): boolean => {
  return isBefore(time1, time2);
};

const getDayDiff = (d1: string, d2: string): number => {
  return getDateDiff(d1, d2, "day");
};

const validateDateBetweenTwoDates = (
  fromDate: string,
  toDate: string,
  givenDate: string | Date
): boolean => {
  return isBetweenDate(fromDate, toDate, givenDate);
};

const getMonthDiff = (d1: Date, d2: Date): number => {
  return getDateDiff(d1, d2, "month");
};

const isDateBeforeOrEqual = (
  time1: Date | string,
  time2: Date | string
): boolean => {
  return isBeforeOrEqual(time1, time2);
};

const addDays = (date: Date | string, quantity: number): Date => {
  return addDate(date, quantity, "day");
};

const substractDays = (date: Date | string, quantity: number): Date => {
  return subtractDate(date, quantity, "day");
};

const getNextMonth = (date: Date): Date => {
  return addDate(date, 1, "month");
};

const getNextDay = (date: Date, dayIndex: number): Date => {
  return getNextDate(date, dayIndex);
};

const sortDatesObj = (dates: Booking[]): Booking[] => {
  dates.map((d) => {
    return {
      ...d,
      checkInDate: format(d.checkInDate, "YYYY/MM/DD"),
    };
  });

  return dates
    .sort((a, b) => {
      const aa = a.checkInDate.split("/").reverse().join();
      const bb = b.checkInDate.split("/").reverse().join();

      return aa < bb ? -1 : aa > bb ? 1 : 0;
    })
    .map((d) => {
      return {
        ...d,
        checkInDate: format(d.checkInDate, "YYYY-MM-DD"),
      };
    });
};

const sortDates = (dates: string[]): string[] => {
  dates.map((d) => format(d, "YYYY/MM/DD"));

  return dates
    .sort((a, b) => {
      const aa = a.split("/").reverse().join();
      const bb = b.split("/").reverse().join();

      return aa < bb ? -1 : aa > bb ? 1 : 0;
    })
    .map((d) => format(d, "YYYY-MM-DD"));
};

const deviceIsMobile = () => {
  let check = false;

  if (window) {
    /* eslint-disable */
    (function (a) {
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
          a
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          a.substr(0, 4)
        )
      )
        check = true;
    })(navigator.userAgent || navigator.vendor);

    return check;
  }

  return check;
};

const toCamelCase = (str: string) => {
  let newStr = "";

  if (str) {
    let wordArr = str.split(/[-_]/g);
    for (let i in wordArr) {
      if (Number(i) > 0) {
        newStr += wordArr[i].charAt(0).toUpperCase() + wordArr[i].slice(1);
      } else {
        newStr += wordArr[i];
      }
    }
  } else {
    return newStr;
  }
  return newStr;
};

export {
  addDays,
  convertHexToRGBA,
  deviceIsMobile,
  getDatesBetweenTwoDates,
  getDayDiff,
  getDaysArray,
  getMonthDiff,
  getNextDay,
  getNextMonth,
  isDateAfter,
  isDateBefore,
  isDateBeforeOrEqual,
  sortDates,
  sortDatesObj,
  substractDays,
  toCamelCase,
  validateDateBetweenTwoDates,
};

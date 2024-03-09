import { Region, getPublicHolidaysByDateRange, type PublicHoliday } from './getPublicHoliday';

// Constants for the monthly pass total days: 30 days
const MONTHLY_PASS_TOTAL_DAYS: number = 30;

export enum TripType {
  RoundTrip = 2,
  SingleTrip = 1
}

export enum WorkingDay {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6
}

export enum DayType {
  WorkingDay = 1,
  PublicHoliday = 2,
  OffDay = 3
}

type CalendarData = {
  date: Date;
  displayDate: string;
  type: DayType;
  publicHoliday: PublicHoliday | null | undefined;
};

export type PassUtilization = {
  workingDayCount: number;
  publicHolidayCount: number;
  offDayCount: number;
  utilizationDayCount: number;
  totalDayCount: number;
  calendar: any[][];
};

const isSameDay = (date1: Date, date2: Date) => {
  // Compare date but not time
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const getDayUtilization = async (
  startDate: Date,
  workingDays: Array<WorkingDay>,
  region: Region,
  monthlyPassTotalDays?: number
): Promise<PassUtilization> => {
  // Override to default montly pass total days
  if (!monthlyPassTotalDays) {
    monthlyPassTotalDays = MONTHLY_PASS_TOTAL_DAYS;
  }

  // Get end date by monthly pass total days from start date
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + monthlyPassTotalDays);

  // Get public holidays in range
  const publicHolidayInRange = await getPublicHolidaysByDateRange(region, startDate, endDate);

  let workingDayCount = 0;
  let publicHolidayCount = 0;
  let offDayCount = 0;
  const calendarData: Array<CalendarData> = [];

  // Loop through each day in the monthly pass
  // 1. Classify the day type and increment their counter
  // 2. Prepare the calendar data for calender view
  let currentDate = new Date(startDate);
  for (let i = 0; i < monthlyPassTotalDays; i++) {
    const day = currentDate.getDay(); // 0 - sun, 1 - mon, 2 - tue, ...
    const displayDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}`;
    let type = 0;
    let publicHoliday = null;

    // Check if the current date is a public holiday
    if (publicHolidayInRange.some((ph) => isSameDay(new Date(ph.date), currentDate))) {
      publicHolidayCount++;
      publicHoliday = publicHolidayInRange.find((ph) => isSameDay(new Date(ph.date), currentDate));
      type = DayType.PublicHoliday;
    }
    // Check if the current date is a working day
    else if (workingDays.includes(day)) {
      workingDayCount++;
      type = DayType.WorkingDay;
    }
    // else the current date is an off day
    else {
      offDayCount++;
      type = DayType.OffDay;
    }

    calendarData.push({
      date: new Date(currentDate),
      displayDate,
      type,
      publicHoliday
    });

    currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1)); // Set next day
  }

  // Prepare the calendar view
  const flattenCalendar = [
    ...new Array(calendarData[0].date.getDay()).fill(null),
    ...calendarData,
    ...new Array(7 - calendarData[calendarData.length - 1].date.getDay() - 1).fill(null)
  ];

  const calendar = [];
  let calendarWeek = [];

  while (flattenCalendar.length != 0) {
    calendarWeek.push(flattenCalendar.shift());

    if (calendarWeek.length == 7) {
      calendar.push([...calendarWeek]);
      calendarWeek = [];
    }
  }

  // Return day utilization
  return {
    workingDayCount,
    publicHolidayCount,
    offDayCount,
    utilizationDayCount: workingDayCount,
    totalDayCount: monthlyPassTotalDays,
    calendar
  };
};

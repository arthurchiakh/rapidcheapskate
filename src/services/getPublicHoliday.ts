export type PublicHoliday = {
  date: string;
  holiday: string;
  unixTimeStamp: number;
};

export enum Region {
  KualaLumpur = 'kualaLumpur',
  Selangor = 'selangor'
}

export const getPublicHolidaysByDateRange = async (
  region: Region,
  startDate: Date,
  endDate: Date
): Promise<Array<PublicHoliday>> => {
  // Get years from start date to end date
  const years = [];
  for (let year = startDate.getFullYear(); year <= endDate.getFullYear(); year++) {
    years.push(year);
  }

  // Get public holidays for each year
  const publicHolidays = await Promise.all(
    years.map(async (year) => {
      return await getPublicHolidaysByYear(region, year.toString());
    })
  );

  // Filter by date range
  const publicHolidaysInRange = publicHolidays.flat().filter((ph) => {
    const date = new Date(ph.date);
    return date >= startDate && date <= endDate;
  });

  return publicHolidaysInRange;
};

// Cache for storing the public holiday for each region and year
const publicHolidayCache: { [key: string]: Array<PublicHoliday> } = {};

// Function to get the public holiday for a region and year
const getPublicHolidaysByYear = async (
  region: Region,
  year: string
): Promise<Array<PublicHoliday>> => {
  const publicHolidayCacheKey = `${region}-${year}`;

  if (!Object.prototype.hasOwnProperty.call(publicHolidayCache, publicHolidayCacheKey)) {
    publicHolidayCache[publicHolidayCacheKey] = await getPublicHolidaysByYearFromRemote(
      region,
      year
    );
  }

  return publicHolidayCache[publicHolidayCacheKey];
};

// Function to fetch the public holiday from the remote
const getPublicHolidaysByYearFromRemote = async (
  region: Region,
  year: string
): Promise<Array<PublicHoliday>> => {
  try {
    const filePath = `/publicHolidays/${region.toString()}-${year}.json`;
    const response = await fetch(filePath);
    const data: Array<PublicHoliday> = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching fare data: ${error}`);
    throw error;
  }
};

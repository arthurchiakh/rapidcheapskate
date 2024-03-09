export type Fare = {
  cash: number;
  cashless: number;
  consession: number;
  monthly: number;
  weekly: number;
};

export type RouteFare = {
  from: string;
  to: string;
  fares: Fare;
};

// Cache for storing the fare for each route fare
const routeFareCache: { [key: string]: RouteFare } = {};

// Function to get the fare for a route
export const getFare = async (
  fromStationCode: string,
  toStationCode: string
): Promise<RouteFare> => {
  // Fare for going from A to B is the same as going from B to A
  // We always want to calculate the fare from the smaller station code to the larger station code
  if (fromStationCode > toStationCode) {
    // Swap using destructuring
    [fromStationCode, toStationCode] = [toStationCode, fromStationCode];
  }

  const routeFareCacheKey = `${fromStationCode}-${toStationCode}`;

  // Check if we have already fetched the fare for this route
  if (!Object.prototype.hasOwnProperty.call(routeFareCache, routeFareCacheKey)) {
    routeFareCache[routeFareCacheKey] = await GetRouteFareFromRemote(
      fromStationCode,
      toStationCode
    );
  }

  return routeFareCache[routeFareCacheKey];
};

// Function to fetch the fare from the remote
const GetRouteFareFromRemote = async (
  fromStationCode: string,
  toStationCode: string
): Promise<RouteFare> => {
  try {
    const filePath = `${import.meta.env.VITE_BASE_URL}/routeFares/${fromStationCode}-${toStationCode}.json`;
    const response = await fetch(filePath);
    const data: RouteFare = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching fare data: ${error}`);
    throw error;
  }
};

export type DayType = 'WORK' |'CLANDAY' |'WEEKEND' |'HOLIDAY' |'LEAVE' | 'SICK';

export const HOME = 'Thuis';

export type Day = {
  type: DayType;
  location?: number;
}

export interface ConfiguredTimesheet {
  days: Day[];
  month: string;
  monthDisplay: string;
}

export interface Location {
  id: number;
  name: string;
  distance: number;
  lat: number;
  lon: number;
}

export type DayType = 'WORK' |'CLANDAY' |'WEEKEND' |'HOLIDAY' |'LEAVE' | 'SICK';

export type Day = {
  type: DayType;
  location?: string;
}

export interface ConfiguredTimesheet {
  days: Day[];
  month: string;
  monthDisplay: string;
}

export interface Location {
  title: string;
  icon: string;
  km: number;
}

export type Locations = {[key: string]: Location};

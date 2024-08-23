export type DayType = 'WORK' |'CLANDAY' |'WEEKEND' |'HOLIDAY' |'LEAVE' | 'SICK';

export type Day = {
  type: DayType;
  location?: string;
}

export interface Timesheet {
  days: Day[],
  monthDisplay: string
}

export interface Location {
  title: string;
  icon: string;
}

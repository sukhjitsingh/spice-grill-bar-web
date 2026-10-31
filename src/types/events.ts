export interface RecurringEvent {
  id: string;
  title: string;
  category: string;
  /** Any date the event actually happened or will happen (YYYY-MM-DD); later dates step from it. */
  anchorDate: string;
  everyWeeks: number;
  time: string;
  /** Used for schema endDate only; display uses endLabel when present. */
  endTime: string;
  endLabel?: string;
  price: number;
  description: string;
}

export interface DatedEvent {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  endTime?: string;
  price?: number;
  theme?: string;
  signupUrl?: string;
  image?: string;
  description: string;
}

export interface EventsData {
  recurring: RecurringEvent[];
  events: DatedEvent[];
  sportsScheduleUrl: string;
}

export interface Occurrence {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  endTime?: string;
  endLabel?: string;
  price?: number;
  description: string;
  anchor: string;
}

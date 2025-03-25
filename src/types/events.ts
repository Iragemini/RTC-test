export type Period = 'CURRENT' | `PERIOD_${number}`;
export type EventStatus = 'PRE' | 'LIVE' | 'REMOVED';
export type CompetitorType = 'HOME' | 'AWAY';

export interface IScore {
  type: Period;
  home: string;
  away: string;
}

export interface IScores {
  [key: string]: IScore;
}

export interface Competitor {
  type: CompetitorType;
  name: string;
}

export interface Competitors {
  HOME: Competitor;
  AWAY: Competitor;
}

export interface IStoredEvent {
  id: string;
  status: EventStatus;
  scores: IScores;
  startTime: string;
  sport: string;
  competitors: Competitors;
  competition: string;
}

export type Events = Map<string, IStoredEvent>;

export interface IEventsService {}

export interface IEventsStorage {
  saveEvent: (eventId: string, payload: IStoredEvent) => Promise<void>;
  updateEvent: (eventId: string, payload: IStoredEvent) => Promise<void>;
  removeEvent: (eventId: string) => Promise<void>;
  getEventById: (eventId: string) => Promise<IStoredEvent | null>;
  getActiveEvents: () => Promise<Events>;
  getAllEvents: () => Promise<Events>;
}

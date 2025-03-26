export interface IScorePeriods {
  period: string;
  home: string;
  away: string;
}

export interface IEvent {
  eventId: string;
  sportId: string;
  competitionId: string;
  startTime: string;
  homeCompetitorId: string;
  awayCompetitorId: string;
  sportEventStatusId: string;
  scorePeriods: IScorePeriods[];
}

export interface IStateService {
  getState: () => Promise<IEvent[]>;
}

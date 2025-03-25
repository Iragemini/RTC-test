import { COMPETITORS, STATUSES } from '../constants';
import {
  EventStatus,
  IEvent,
  IEventsStorage,
  IStoredEvent,
  TransformedMappings,
  ICompetitors,
  IScore,
  Period,
  IEventsService,
} from '../types';

const UNKNOWN = 'UNKNOWN';

export default class EventsService implements IEventsService {
  constructor(private storage: IEventsStorage) {
    this.storage = storage;
  }

  /**
   * Modify events to the format they can be stored
   */
  static applyMappings(events: IEvent[] = [], mappings: TransformedMappings = {}): IStoredEvent[] {
    if (!events.length || !Object.keys(mappings).length) {
      return [];
    }
    return events.map((event: IEvent) => {
      const scorePeriods = event.scorePeriods.map((scorePeriod) => ({
        ...scorePeriod,
        period: (mappings[scorePeriod.period] as Period) || (scorePeriod.period as Period),
      }));
      const scores = scorePeriods.reduce<Record<string, IScore>>((acc, scorePeriod) => {
        const { period, home, away } = scorePeriod;

        acc[period] = {
          type: period,
          home,
          away,
        };

        return acc;
      }, {});

      const competitors: ICompetitors = {
        [COMPETITORS.HOME]: {
          type: COMPETITORS.HOME,
          name: mappings[event.homeCompetitorId] || UNKNOWN,
        },
        [COMPETITORS.AWAY]: {
          type: COMPETITORS.AWAY,
          name: mappings[event.awayCompetitorId] || UNKNOWN,
        },
      };

      const status = (mappings[event.sportEventStatusId] as EventStatus) || STATUSES.PRE;

      return {
        id: event.eventId,
        status,
        scores,
        startTime: new Date(Number(event.startTime)).toISOString(),
        sport: mappings[event.sportId] || UNKNOWN,
        competitors,
        competition: mappings[event.competitionId] || UNKNOWN,
      };
    });
  }

  /**
   * Process the events
   */
  async processEvents(events: IEvent[], mappings: TransformedMappings): Promise<void> {}

  /**
   * Save events to the storage
   */
  async saveEvents(events: IEvent[], mappings: TransformedMappings): Promise<void> {
    const eventsBatch = EventsService.applyMappings(events, mappings);

    const saveBatch = eventsBatch.map((event) => {
      const eventId = event.id;

      return this.storage.saveEvent(eventId, event);
    });

    await Promise.all(saveBatch);
  }
}

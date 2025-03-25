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
  Events,
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
  async processEvents(events: IEvent[], mappings: TransformedMappings): Promise<void> {
    const activeEvents = await this.storage.getActiveEvents();

    const eventIds = events.reduce<string[]>((acc, event) => {
      const { eventId } = event;
      acc.push(eventId);
      return acc;
    }, []);

    const eventsBatch = EventsService.applyMappings(events, mappings);

    if (eventIds.some((id) => activeEvents.has(id))) {
      await this.updateEvents(eventsBatch);
      return;
    }

    await this.saveEvents(eventsBatch);

    if (activeEvents.size) {
      const finishedIds = [...activeEvents.keys()];
      await this.removeEvents(finishedIds);
    }
  }

  /**
   * Save events to the storage
   */
  async saveEvents(events: IStoredEvent[]): Promise<void> {
    const saveBatch = events.map((event) => {
      const eventId = event.id;

      return this.storage.saveEvent(eventId, event);
    });

    await Promise.all(saveBatch);
  }

  /**
   * Save events to the storage
   */
  async updateEvents(events: IStoredEvent[]): Promise<void> {
    const updateBatch = events.map((event) => {
      const eventId = event.id;

      return this.storage.updateEvent(eventId, event);
    });

    await Promise.all(updateBatch);
  }

  /**
   * Mark events as REMOVED
   */
  async removeEvents(eventIds: string[]): Promise<void> {
    const updateBatch = eventIds.map((id) => {
      return this.storage.removeEvent(id);
    });

    await Promise.all(updateBatch);
  }

  /**
   * Get active events from the storage
   */
  async getActiveEvents(): Promise<Events> {
    const events = await this.storage.getActiveEvents();
    return events;
  }
}

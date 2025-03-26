import { STATUSES } from '../constants';
import { IEventsStorage, IStoredEvent } from '../types';

export default class EventsStorage implements IEventsStorage {
  private storage: Map<string, IStoredEvent>;

  constructor() {
    this.storage = new Map<string, IStoredEvent>();
  }

  /**
   * Add new event to the storage
   */
  async saveEvent(eventId: string, payload: IStoredEvent): Promise<void> {
    this.storage.set(eventId, payload);
  }

  /**
   * Update existing event
   */
  async updateEvent(eventId: string, payload: IStoredEvent): Promise<void> {
    const currentState = await this.getEventById(eventId);
    this.storage.set(eventId, {
      ...currentState,
      ...payload,
    });
  }

  /**
   * Mark event as REMOVED
   */
  async removeEvent(eventId: string): Promise<void> {
    const event = await this.getEventById(eventId);

    if (event) {
      const payload = {
        ...event,
        status: STATUSES.REMOVED,
      };

      this.storage.set(eventId, payload);
    }
  }

  /**
   * Get event by the provided id
   */
  async getEventById(eventId: string): Promise<IStoredEvent | null> {
    return this.storage.get(eventId) ?? null;
  }

  /**
   * Get all active events
   */
  async getActiveEvents(): Promise<Map<string, IStoredEvent>> {
    const events = new Map(
      [...this.storage].filter(([, value]) => value.status !== STATUSES.REMOVED)
    );
    return events;
  }

  /**
   * Get current state
   */
  async getAllEvents() {
    return this.storage;
  }
}

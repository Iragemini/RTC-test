import { describe, vi, test, beforeAll, expect } from 'vitest';
import EventsStorage from '../../src/storage/events';
import { eventIds, payloads, statuses } from '../__mocks__/data/events';

const { eventId, unknownEventId, activeEventId } = eventIds;
const { payload, updatedPayload, removedPayload } = payloads;
const { updatedStatus, removedStatus } = statuses;

describe('Event storage tests', () => {
  let eventsStorage: EventsStorage;

  beforeAll(() => {
    vi.clearAllMocks();
    eventsStorage = new EventsStorage();
  });

  test('Should return current state', async () => {
    const storage = await eventsStorage.getAllEvents();
    expect(storage.size).toBe(0);
  });

  test('Should save event to the state', async () => {
    await eventsStorage.saveEvent(eventId, payload);
    const storage = await eventsStorage.getAllEvents();

    expect(storage.has(eventId)).toBe(true);
    expect(storage.get(eventId)).toEqual(payload);
  });

  test('Should return event by id if the event exists', async () => {
    await eventsStorage.saveEvent(eventId, payload);
    const event = await eventsStorage.getEventById(eventId);

    expect(event).exist;
  });

  test('Should return null if the event does not exist', async () => {
    const event = await eventsStorage.getEventById(unknownEventId);

    expect(event).toBeNull();
  });

  test('Should update event', async () => {
    await eventsStorage.updateEvent(eventId, updatedPayload);
    const event = await eventsStorage.getEventById(eventId);

    expect(event).exist;
    const { status } = event!;
    expect(status).toEqual(updatedStatus);
  });

  test('Should mark event as REMOVED', async () => {
    await eventsStorage.removeEvent(eventId);
    const event = await eventsStorage.getEventById(eventId);

    expect(event).exist;
    expect(event).toEqual(removedPayload);

    const { status } = event!;
    expect(status).toEqual(removedStatus);
  });

  test('Should return only active events', async () => {
    await eventsStorage.saveEvent(eventId, payload);
    await eventsStorage.saveEvent(activeEventId, payload);

    const storage = await eventsStorage.getAllEvents();
    expect(storage.size).toEqual(2);

    await eventsStorage.removeEvent(eventId);
    expect(storage.size).toEqual(2);

    const activeEvents = await eventsStorage.getActiveEvents();
    expect(activeEvents.size).toEqual(1);
  });
});

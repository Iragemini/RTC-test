import { describe, vi, test, beforeAll, expect } from 'vitest';
import { EventsService } from '../../src/services';
import EventsStorage from '../../src/storage/events';
import { transformedMappings } from '../__mocks__/data/mappings';
import { mappedEvents } from '../__mocks__/data/state';
import { eventsBatch, payloads } from '../__mocks__/data/events';
import { IEventsStorage, IStoredEvent } from '../../src/types';

const { payload } = payloads;

vi.mock('../../src/storage/events', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      saveEvent: vi.fn(),
      getActiveEvents: vi.fn().mockResolvedValue(new Map()),
      updateEvent: vi.fn(),
      removeEvent: vi.fn(),
    })),
  };
});

describe('Event service tests', () => {
  let storage: IEventsStorage;
  let eventService: EventsService;

  beforeAll(() => {
    vi.clearAllMocks();
    storage = new EventsStorage();
    eventService = new EventsService(storage);

    vi.spyOn(eventService, 'saveEvents');
    vi.spyOn(eventService, 'updateEvents');
    vi.spyOn(eventService, 'removeEvents');
  });

  test('Should apply mapping correctly', async () => {
    expect(EventsService.applyMappings(mappedEvents, transformedMappings)).toEqual(eventsBatch);
  });

  test('Should return an empty array on empty input', async () => {
    expect(EventsService.applyMappings(undefined, undefined)).toEqual([]);
  });

  test('Should save events in the correct format', async () => {
    await eventService.saveEvents(eventsBatch as IStoredEvent[]);

    expect(storage.saveEvent).toHaveBeenCalledTimes(eventsBatch.length);
    expect(storage.saveEvent).toHaveBeenCalledWith(eventsBatch[0].id, eventsBatch[0]);
    expect(storage.saveEvent).toHaveBeenCalledWith(eventsBatch[1].id, eventsBatch[1]);
  });

  test('Should add new events', async () => {
    await eventService.processEvents(mappedEvents, transformedMappings);

    expect(eventService.saveEvents).toHaveBeenCalledOnce();
    expect(eventService.removeEvents).not.toHaveBeenCalled();
  });

  test('Should mark finished events as REMOVED', async () => {
    const state = new Map();
    state.set(payload.id, payload);
    vi.mocked(storage.getActiveEvents).mockResolvedValueOnce(state);
    await eventService.processEvents(mappedEvents, transformedMappings);

    expect(eventService.saveEvents).toHaveBeenCalledOnce();
    expect(eventService.removeEvents).toHaveBeenCalledWith([payload.id]);
  });

  test('Should update active events', async () => {
    const state = new Map();
    state.set(mappedEvents[0].eventId, {});
    vi.mocked(storage.getActiveEvents).mockResolvedValueOnce(state);
    await eventService.processEvents(mappedEvents, transformedMappings);

    expect(eventService.updateEvents).toHaveBeenCalledOnce();
    expect(eventService.removeEvents).not.toHaveBeenCalled();
    expect(eventService.saveEvents).not.toHaveBeenCalled();
  });

  test('Should return active events', async () => {
    const state = new Map();
    state.set(payload.id, payload);
    vi.mocked(storage.getActiveEvents).mockResolvedValueOnce(state);
    const events = await eventService.getActiveEvents();

    expect(storage.getActiveEvents).toHaveBeenCalledOnce();
    expect(events).toEqual(Object.fromEntries(state));
  });
});

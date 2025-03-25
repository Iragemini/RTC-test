import { describe, vi, test, beforeAll, expect } from 'vitest';
import { EventsService } from '../../src/services';
import EventsStorage from '../../src/storage/events';
import { transformedMappings } from '../__mocks__/data/mappings';
import { mappedEvents } from '../__mocks__/data/state';
import { eventsBatch } from '../__mocks__/data/events';
import { IEventsStorage } from '../../src/types';

vi.mock('../../src/storage/events', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      saveEvent: vi.fn(),
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
  });

  test('Should apply mapping correctly', async () => {
    expect(EventsService.applyMappings(mappedEvents, transformedMappings)).toEqual(eventsBatch);
  });

  test('Should return an empty array on empty input', async () => {
    expect(EventsService.applyMappings(undefined, undefined)).toEqual([]);
  });

  test('Should save events in the correct format', async () => {
    await eventService.saveEvents(mappedEvents, transformedMappings);

    expect(storage.saveEvent).toHaveBeenCalledTimes(mappedEvents.length);
    expect(storage.saveEvent).toHaveBeenCalledWith(eventsBatch[0].id, eventsBatch[0]);
    expect(storage.saveEvent).toHaveBeenCalledWith(eventsBatch[1].id, eventsBatch[1]);
  });
});

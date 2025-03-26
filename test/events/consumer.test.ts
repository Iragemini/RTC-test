import { vi, expect, describe, test, beforeEach, afterEach } from 'vitest';
import EventsConsumer from '../../src/events/consumer';
import { StateService, MappingsService, EventsService } from '../../src/services';
import ApiError from '../../src/errors/ApiError';
import SimulationAPIClient from '../../src/api/client';
import { API_ERROR, BASE_URL } from '../constants';
import EventsStorage from '../../src/storage/events';
import { mappedEvents } from '../__mocks__/data/state';
import { transformedMappings } from '../__mocks__/data/mappings';

vi.mock('../../src/api/client', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      getMappings: vi.fn().mockResolvedValue({}),
    })),
  };
});

vi.mock('../../src/storage/events', () => {
  return {
    default: vi.fn().mockImplementation(() => ({})),
  };
});

vi.mock('../../src/services', () => {
  return {
    StateService: vi.fn().mockImplementation(() => ({
      getState: vi.fn().mockResolvedValue(mappedEvents),
    })),
    MappingsService: vi.fn().mockImplementation(() => ({
      getMappings: vi.fn().mockResolvedValue(transformedMappings),
    })),
    EventsService: vi.fn().mockImplementation(() => ({
      processEvents: vi.fn(),
    })),
  };
});

describe('EventsConsumer', () => {
  let client: SimulationAPIClient;
  let stateService: StateService;
  let mappingsService: MappingsService;
  let eventsService: EventsService;
  let eventsStorage: EventsStorage;
  let consumer: EventsConsumer;
  const pollingInterval = 1000;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    client = new SimulationAPIClient(BASE_URL);
    stateService = new StateService(client);
    mappingsService = new MappingsService(client);
    eventsStorage = new EventsStorage();
    eventsService = new EventsService(eventsStorage);
    consumer = new EventsConsumer(stateService, mappingsService, eventsService, {
      pollingInterval,
    });
    vi.spyOn(consumer, 'processEvent');
  });

  afterEach(() => {
    consumer.stop();
    vi.useRealTimers();
  });

  test('Should call fetch and process events on consumer start', async () => {
    await consumer.start();

    expect(stateService.getState).toHaveBeenCalledTimes(1);
    expect(mappingsService.getMappings).toHaveBeenCalledTimes(1);
    expect(consumer.processEvent).toHaveBeenCalledTimes(1);
  });

  test('Should call stateService.getState periodically', async () => {
    await consumer.start();

    await vi.advanceTimersByTimeAsync(pollingInterval * 3);

    expect(stateService.getState).toHaveBeenCalledTimes(4);
    expect(mappingsService.getMappings).toHaveBeenCalledTimes(4);
    expect(consumer.processEvent).toHaveBeenCalledTimes(4);
  });

  test('Should handle errors correctly if stateService.getState or mappingsService.getMappings fails', async () => {
    vi.mocked(stateService.getState).mockRejectedValueOnce(new Error(API_ERROR));

    await expect(consumer.start()).rejects.toThrowError(ApiError);

    expect(stateService.getState).toHaveBeenCalledTimes(1);
    expect(mappingsService.getMappings).toHaveBeenCalledTimes(0);
    expect(consumer.processEvent).not.toHaveBeenCalled();
  });

  test('Should call events service to process events', async () => {
    await consumer.processEvent([], {});

    expect(eventsService.processEvents).toHaveBeenCalledTimes(1);
  });

  test('Should process events only if the state is not empty', async () => {
    vi.mocked(stateService.getState).mockResolvedValueOnce([]);
    await consumer.start();

    expect(stateService.getState).toHaveBeenCalledTimes(1);
    expect(mappingsService.getMappings).toHaveBeenCalledTimes(1);
    expect(consumer.processEvent).not.toHaveBeenCalled();
  });

  test('Should throw error when events service fails', async () => {
    vi.mocked(eventsService.processEvents).mockRejectedValueOnce(new Error(API_ERROR));

    await expect(consumer.processEvent([], {})).rejects.toThrowError();
    expect(eventsService.processEvents).toHaveBeenCalledTimes(1);
  });

  test('Should stop polling when stop() is called', async () => {
    await consumer.start();

    consumer.stop();

    await vi.advanceTimersByTimeAsync(pollingInterval * 3);

    expect(stateService.getState).toHaveBeenCalledTimes(1);
    expect(mappingsService.getMappings).toHaveBeenCalledTimes(1);
    expect(consumer.processEvent).toHaveBeenCalledTimes(1);
  });
});

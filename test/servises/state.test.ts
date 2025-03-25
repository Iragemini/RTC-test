import { describe, vi, test, beforeAll, expect } from 'vitest';
import StateService from '../../src/services/state';
import ApiError from '../../src/errors/ApiError';
import mockState, { mappedEvents } from '../__mocks__/data/state';
import SimulationAPIClient from '../../src/api/client';
import { API_ERROR, BASE_URL } from '../constants';

vi.mock('../../src/api/client', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      getState: vi.fn().mockResolvedValue(mockState),
    })),
  };
});

describe('Mapping service tests', () => {
  let stateService: StateService;
  let client: SimulationAPIClient;

  beforeAll(() => {
    vi.clearAllMocks();
    client = new SimulationAPIClient(BASE_URL);
    stateService = new StateService(client);
  });

  test('Should return mapped events', async () => {
    const result = await stateService.getState();

    expect(client.getState).toHaveBeenCalledOnce();
    expect(result).toEqual(mappedEvents);
  });

  test('Should handle errors', async () => {
    vi.mocked(client.getState).mockRejectedValueOnce(new Error(API_ERROR));

    await expect(stateService.getState()).rejects.toThrowError(ApiError);
  });
});

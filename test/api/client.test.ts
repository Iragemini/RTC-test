import { describe, vi, test, beforeEach, expect } from 'vitest';
import axios from 'axios';
import SimulationAPIClient, { GET_STATE_POSTFIX } from '../../src/api/client';
import mockState from './__mocks__/data/state';

vi.mock('axios');

const BASE_URL = 'http//localhost:3000';
const API_ERROR = 'An error occurred while calling the simulation API.';

describe('Simulated API Client', () => {
  let client: SimulationAPIClient;

  beforeEach(() => {
    vi.clearAllMocks();
    client = new SimulationAPIClient(BASE_URL);
  });
  test('Should fetch state from API', async () => {
    vi.mocked(axios.get).mockResolvedValueOnce({ data: mockState });

    const result = await client.getState();

    expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/${GET_STATE_POSTFIX}`);
    expect(result).toEqual(mockState);
  });

  test('should handle API errors', async () => {
    vi.mocked(axios.get).mockRejectedValueOnce(new Error(API_ERROR));

    await expect(client.getState()).rejects.toThrow(API_ERROR);
    expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/${GET_STATE_POSTFIX}`);
  });
});

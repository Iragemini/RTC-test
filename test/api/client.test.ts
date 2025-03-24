import { describe, vi, test, beforeEach, expect } from 'vitest';
import axios from 'axios';
import SimulationAPIClient, { GET_STATE_POSTFIX } from '../../src/api/client';
import mockState from './__mocks__/data/state';

vi.mock('axios');

const baseUrl = 'http//localhost:3000';

describe('Simulated API Client', () => {
  let client: SimulationAPIClient;

  beforeEach(() => {
    vi.clearAllMocks();
    client = new SimulationAPIClient(baseUrl);
  });
  test('Should fetch state from API', async () => {
    vi.mocked(axios.get).mockResolvedValueOnce({ data: mockState });

    const result = await client.getState();

    expect(axios.get).toHaveBeenCalledWith(`${baseUrl}/${GET_STATE_POSTFIX}`);
    expect(result).toEqual(mockState);
  });
});

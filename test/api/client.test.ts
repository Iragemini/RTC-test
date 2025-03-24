import { describe, vi, test, beforeEach, expect } from 'vitest';
import axios from 'axios';
import SimulationAPIClient, { GET_STATE_POSTFIX, GET_MAPPINGS_POSTFIX } from '../../src/api/client';
import mockState from './__mocks__/data/state';
import mockMappings from './__mocks__/data/mappings';

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

  test('Should handle get state API errors', async () => {
    vi.mocked(axios.get).mockRejectedValueOnce(new Error(API_ERROR));

    await expect(client.getState()).rejects.toThrow(API_ERROR);
    expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/${GET_STATE_POSTFIX}`);
  });

  test('Should fetch mappings from API', async () => {
    vi.mocked(axios.get).mockResolvedValueOnce({ data: mockMappings });

    const result = await client.getMappings();

    expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/${GET_MAPPINGS_POSTFIX}`);
    expect(result).toEqual(mockMappings);
  });

  test('Should handle get mappings API errors', async () => {
    vi.mocked(axios.get).mockRejectedValueOnce(new Error(API_ERROR));

    await expect(client.getMappings()).rejects.toThrow(API_ERROR);
    expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/${GET_MAPPINGS_POSTFIX}`);
  });
});

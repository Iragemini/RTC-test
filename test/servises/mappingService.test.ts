import { describe, vi, test, beforeAll, expect } from 'vitest';
import MappingsService from '../../src/services/mappingsService';
import ApiError from '../../src/errors/ApiError';
import mockMappings, { transformedMappings } from '../api/__mocks__/data/mappings';
import SimulationAPIClient from '../../src/api/client';
import { API_ERROR, BASE_URL } from '../constants';

vi.mock('../../src/api/client', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      getMappings: vi.fn().mockResolvedValue(mockMappings),
    })),
  };
});

describe('Mapping service tests', () => {
  let mappingService: MappingsService;
  let client: SimulationAPIClient;

  beforeAll(() => {
    vi.clearAllMocks();
    client = new SimulationAPIClient(BASE_URL);
    mappingService = new MappingsService(client);
  });

  test('Should return transformed mappings', async () => {
    const result = await mappingService.getMappings();

    expect(client.getMappings).toHaveBeenCalledOnce();
    expect(result).toEqual(transformedMappings);
  });

  test('Should handle errors', async () => {
    vi.mocked(client.getMappings).mockRejectedValueOnce(new Error(API_ERROR));

    await expect(mappingService.getMappings()).rejects.toThrow(ApiError);
  });
});

import SimulationAPIClient from '../api/client';
import ApiError from '../errors/ApiError';
import { TransformedMappings } from '../types';

const FAILED_TO_FETCH_MESSAGE = 'Failed to fetch mappings';

/**
 * Create a new instance of MappingsService
 */
export default class MappingsService {
  constructor(private client: SimulationAPIClient) {}

  /**
   * Transform an input mappings string to key-value pairs.
   */
  static transformMappings(mappings: string): TransformedMappings {
    return Object.fromEntries(
      mappings.split(';').map((entry) => {
        const [key, value] = entry.split(':');
        return [key, value];
      })
    );
  }

  /**
   * Get the map for sport event properties to their unique IDs.
   *
   * @example
   * response = {
   * '29190088-763e-4d1c-861a-d16dbfcf858c': 'Real Madrid',
   * '33ff69aa-c714-470c-b90d-d3883c95adce': 'Barcelona',
   * 'b582b685-e75c-4139-8274-d19f078eabef': 'Manchester United',
   * '4df1b17c-3bfe-4bbb-8b60-12661c2bb190': 'Liverpool',
   * }
   */
  async getMappings(): Promise<TransformedMappings> {
    try {
      const { mappings } = await this.client.getMappings();

      return MappingsService.transformMappings(mappings);
    } catch (error) {
      let message = FAILED_TO_FETCH_MESSAGE;

      if (error.response) {
        const { data } = error.response;
        message = JSON.stringify(data);
      }
      throw new ApiError(message);
    }
  }
}

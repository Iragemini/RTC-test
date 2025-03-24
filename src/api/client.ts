import axios from 'axios';
import { IMappings, ISimulationAPIClient, IState } from './types';

export const GET_STATE_POSTFIX = 'api/state';
export const GET_MAPPINGS_POSTFIX = 'api/mappings';

export default class SimulationAPIClient implements ISimulationAPIClient {
  constructor(private baseUrl: string) {}

  async getState(): Promise<IState> {
    const { data } = await axios.get(`${this.baseUrl}/${GET_STATE_POSTFIX}`);

    return data;
  }

  async getMappings(): Promise<IMappings> {
    const { data } = await axios.get(`${this.baseUrl}/${GET_MAPPINGS_POSTFIX}`);

    return data;
  }
}

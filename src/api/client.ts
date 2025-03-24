import axios from 'axios';
import { ISimulationAPIClient, IState } from './types';

export const GET_STATE_POSTFIX = 'api/state';

export default class SimulationAPIClient implements ISimulationAPIClient {
  constructor(private baseUrl: string) {}

  async getState(): Promise<IState> {
    const { data } = await axios.get(`${this.baseUrl}/${GET_STATE_POSTFIX}`);

    return data;
  }
}

import SimulationAPIClient from '../api/client';
import ApiError from '../errors/ApiError';
import { IEvent, IScorePeriods } from '../types';

const FAILED_TO_FETCH_MESSAGE = 'Failed to fetch state';

export default class StateService {
  constructor(private client: SimulationAPIClient) {}

  /**
   * Map events into structured objects
   */
  static mapEvents(odds: string): IEvent[] {
    const events = odds.split('\n');

    return events.map((event: string) => {
      const values = event.split(',');

      const lastElement = values[values.length - 1];
      let scorePeriods: IScorePeriods[] = [];

      if (lastElement.includes('@')) {
        scorePeriods = lastElement.split('|').map((scoreString: string) => {
          const [period, score] = scoreString.split('@');
          const [home, away] = score.split(':');
          return { period, home, away };
        });
      }
      return {
        eventId: values[0],
        sportId: values[1],
        competitionId: values[2],
        startTime: values[3],
        homeCompetitorId: values[4],
        awayCompetitorId: values[5],
        sportEventStatusId: values[6],
        scorePeriods,
      };
    });
  }

  /**
   * Get sport events
   */
  async getState(): Promise<IEvent[]> {
    try {
      const { odds } = await this.client.getState();

      return StateService.mapEvents(odds);
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

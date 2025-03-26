import {
  IStateService,
  IMappingsService,
  TransformedMappings,
  IEvent,
  IEventsService,
} from '../types';
import ApiError from '../errors/ApiError';

interface IConsumerConfig {
  pollingInterval: number;
}

export default class EventsConsumer {
  private pollingIntervalId?: NodeJS.Timeout;

  constructor(
    private stateService: IStateService,
    private mappingsService: IMappingsService,
    private eventsService: IEventsService,
    private config: IConsumerConfig
  ) {}

  /**
   * Start polling events
   */
  async start() {
    const { pollingInterval } = this.config;

    await this.fetchAndProcessEvents();

    this.pollingIntervalId = setInterval(async () => {
      await this.fetchAndProcessEvents().catch((error) => {
        console.error('Error consuming data:', error);
      });
    }, pollingInterval);
  }

  /**
   * Fetch state and mappings from API and process the data
   */
  private async fetchAndProcessEvents() {
    try {
      const state = await this.stateService.getState();
      const mappings = await this.mappingsService.getMappings();
      if (state.length) {
        await this.processEvent(state, mappings);
      }
    } catch (error) {
      throw error instanceof ApiError
        ? error
        : new ApiError(error.message || 'Failed to consume data');
    }
  }

  /**
   * Process events
   */
  async processEvent(state: IEvent[], mappings: TransformedMappings) {
    try {
      await this.eventsService.processEvents(state, mappings);
    } catch (error) {
      console.error('Failed to process events');
      throw error;
    }
  }

  /**
   * Stop polling events
   */
  stop() {
    if (this.pollingIntervalId) {
      clearInterval(this.pollingIntervalId);
      this.pollingIntervalId = undefined;
    }
  }
}

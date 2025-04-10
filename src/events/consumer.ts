import {
  IStateService,
  IMappingsService,
  TransformedMappings,
  IEvent,
  IEventsService,
} from '../types';

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

    try {
      await this.fetchAndProcessEvents();
    } catch (err) {
      console.log('can not fetch');
    }

    this.pollingIntervalId = setInterval(async () => {
      try {
        await this.fetchAndProcessEvents();
      } catch (error) {
        console.error('Failed to consume data:', error);
      }
    }, pollingInterval);
  }

  /**
   * Fetch state and mappings from API and process the data
   */
  private async fetchAndProcessEvents() {
    let state = [] as IEvent[];
    let mappings = {} as TransformedMappings;

    try {
      state = await this.stateService.getState();
      mappings = await this.mappingsService.getMappings();
    } catch (error) {
      console.error('Failed to consume data:', error);
    } finally {
      if (state.length) {
        await this.processEvent(state, mappings);
      }
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

import EventsStorage from './storage/events';
import EventsConsumer from './events/consumer';
import { EventsService, StateService, MappingsService } from './services';
import SimulationAPIClient from './api/client';
import { config } from '../config/config';

const {
  simulationBaseUrl,
  consumer: { pollingInterval },
} = config;

const client = new SimulationAPIClient(simulationBaseUrl);
const stateService = new StateService(client);
const mappingsService = new MappingsService(client);
const storage = new EventsStorage();
const eventsService = new EventsService(storage);
const eventsConsumer = new EventsConsumer(stateService, mappingsService, eventsService, {
  pollingInterval,
});

export { eventsConsumer, eventsService };

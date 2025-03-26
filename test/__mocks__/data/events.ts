import { IStoredEvent, EventStatus } from '../../../src/types';
import { STATUSES } from '../../../src/constants';

const unknownEventId = 'unknown_event';
const activeEventId = '8eccf850-571f-4e18-8cb3-2c9e3afade7y';
const eventId: string = '3eccf850-571f-4e18-8cb3-2c9e3afade7b';
const payload: IStoredEvent = {
  id: '3eccf850-571f-4e18-8cb3-2c9e3afade7b',
  status: 'PRE',
  scores: {
    CURRENT: {
      type: 'CURRENT',
      home: '0',
      away: '0',
    },
  },
  startTime: '2024-03-04T10:36:07.812Z',
  sport: 'FOOTBALL',
  competitors: {
    HOME: {
      type: 'HOME',
      name: 'Juventus',
    },
    AWAY: {
      type: 'AWAY',
      name: 'Paris Saint-Germain',
    },
  },
  competition: 'UEFA Champions League',
};

const eventsBatch = [
  {
    id: '995e0722-4118-4f8e-a517-82f6ea240673',
    status: 'PRE',
    scores: {},
    startTime: '2024-03-08T12:20:32.183Z',
    sport: 'FOOTBALL',
    competitors: {
      HOME: {
        type: 'HOME',
        name: 'Real Madrid',
      },
      AWAY: {
        type: 'AWAY',
        name: 'Bayern Munich',
      },
    },
    competition: 'UEFA Europa League',
  },
  {
    id: '4bb7b78f-6a23-43d0-a61a-1341f03f64e0',
    status: 'LIVE',
    scores: {
      CURRENT: {
        type: 'CURRENT',
        home: '1',
        away: '2',
      },
      PERIOD_1: {
        type: 'PERIOD_1',
        home: '1',
        away: '2',
      },
    },
    startTime: '2024-03-08T12:19:40.135Z',
    sport: 'FOOTBALL',
    competitors: {
      HOME: {
        type: 'HOME',
        name: 'Manchester City',
      },
      AWAY: {
        type: 'AWAY',
        name: 'Manchester United',
      },
    },
    competition: 'NBA - pre-season',
  },
];

const updatedStatus: EventStatus = STATUSES.LIVE;
const removedStatus: EventStatus = STATUSES.REMOVED;
const updatedPayload = {
  ...payload,
  status: updatedStatus,
};
const removedPayload = {
  ...payload,
  status: removedStatus,
};

const statuses = {
  updatedStatus,
  removedStatus,
};

const eventIds = {
  eventId,
  unknownEventId,
  activeEventId,
};

const payloads = {
  payload,
  updatedPayload,
  removedPayload,
};

export { eventIds, payloads, statuses, eventsBatch };

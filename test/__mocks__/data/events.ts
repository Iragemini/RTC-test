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

export { eventIds, payloads, statuses };

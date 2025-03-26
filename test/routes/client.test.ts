import request from 'supertest';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import { clientRouter } from '../../src/routes';
import { IEventsService } from '../../src/types';
import { payloads } from '../__mocks__/data/events';

const { payload } = payloads;

const mockEventsService = {
  getActiveEvents: vi.fn(),
};

let app: express.Express;

beforeEach(() => {
  app = express();
  app.use(express.json());
  app.use(
    '/client',
    clientRouter({ eventsService: mockEventsService as unknown as IEventsService })
  );
});

describe('Client router', () => {
  test('GET /state should return a 200 status and data', async () => {
    const activeEvents = {
      [payload.id]: {
        ...payload,
      },
    };
    mockEventsService.getActiveEvents.mockResolvedValue(activeEvents);

    const response = await request(app).get('/client/state');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(activeEvents);
    expect(mockEventsService.getActiveEvents).toHaveBeenCalledTimes(1);
  });
});

import { Router, Request, Response } from 'express';
import { ActiveEvents, IEventsService } from '../types';

interface IDependencies {
  eventsService: IEventsService;
}
interface StateResponse extends Response {
  json(body: ActiveEvents): this;
}

const clientRouter = (dependencies: IDependencies): Router => {
  const router = Router();
  const { eventsService } = dependencies;

  router.get('/state', async (req: Request, res: StateResponse): Promise<void> => {
    const data = await eventsService.getActiveEvents();
    res.status(200).json(data);
  });

  return router;
};

export default clientRouter;

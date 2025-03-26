import { Router, Request, Response } from 'express';
import { IEventsService } from '../types';

interface IDependencies {
  eventsService: IEventsService;
}

const clientRouter = (dependencies: IDependencies) => {
  const router = Router();
  const { eventsService } = dependencies;

  router.get('/state', async (req: Request, res: Response) => {
    const data = await eventsService.getActiveEvents();
    res.status(200).json(data);
  });

  return router;
};

export default clientRouter;

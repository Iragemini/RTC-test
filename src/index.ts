import express, { Request, Response, NextFunction } from 'express';
import { config } from '../config/config';
import { eventsConsumer, eventsService } from './dependencies';
import { clientRouter } from './routes';

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const {
  server: { port },
} = config;
const app = express();

app.use(express.json());

app.use('/client', clientRouter({ eventsService }));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: 'Route not found' });
  next();
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(port, async () => {
  console.log(`Server is running at port ${port}...`);

  try {
    await eventsConsumer.start();
    console.log('Events consumer started successfully');
  } catch (error) {
    console.error('Failed to start events consumer:', error);
    eventsConsumer.stop();
    process.exit(1);
  }
});

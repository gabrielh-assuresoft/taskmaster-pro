import express from 'express';
import { errorHandler } from './middlewares/error.middleware';
import { taskRoutes } from './routes/task.routes';

export function createApp(): express.Application {
  const app = express();
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.status(200).json({ success: true, data: { status: 'ok' } });
  });

  app.use('/tasks', taskRoutes);
  app.use(errorHandler);

  return app;
}

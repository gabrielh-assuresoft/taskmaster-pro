import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { TaskRepository } from '../repositories/task.repository';
import { TaskService } from '../services/task.service';

const repository = new TaskRepository();
const service = new TaskService(repository);
const controller = new TaskController(service);

export const taskRoutes = Router();

taskRoutes.get('/', controller.list);
taskRoutes.post('/', controller.create);
taskRoutes.put('/:id', controller.update);
taskRoutes.delete('/:id', controller.remove);

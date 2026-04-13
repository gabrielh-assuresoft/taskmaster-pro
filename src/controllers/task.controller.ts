import type { NextFunction, Request, Response } from 'express';
import type { TaskService } from '../services/task.service';

export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.taskService.listTasks(req.query);
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.taskService.createTask(req.body);
      res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.taskService.updateTask(req.params, req.body);
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.taskService.deleteTask(req.params);
      res.status(200).json({ success: true, data: null });
    } catch (err) {
      next(err);
    }
  };
}

import type { Task } from '@prisma/client';
import {
  createTaskSchema,
  listTasksQuerySchema,
  taskIdParamSchema,
  updateTaskSchema,
} from '../models/task.model';
import { NotFoundError } from '../errors/app.error';
import type { ITaskRepository } from '../repositories/task.repository';

export class TaskService {
  constructor(private readonly tasks: ITaskRepository) {}

  async createTask(rawBody: unknown): Promise<Task> {
    const input = createTaskSchema.parse(rawBody);
    return this.tasks.create({
      title: input.title,
      description: input.description,
      status: input.status ?? 'pending',
    });
  }

  async listTasks(rawQuery: unknown): Promise<Task[]> {
    const query = listTasksQuerySchema.parse(rawQuery);
    return this.tasks.findAll(
      query.status !== undefined ? { status: query.status } : undefined,
    );
  }

  async updateTask(rawParams: unknown, rawBody: unknown): Promise<Task> {
    const { id } = taskIdParamSchema.parse(rawParams);
    const body = updateTaskSchema.parse(rawBody);

    const existing = await this.tasks.findById(id);
    if (!existing) {
      throw new NotFoundError('Task', id);
    }

    const updated = await this.tasks.update(id, {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.status !== undefined && { status: body.status }),
    });

    if (!updated) {
      throw new NotFoundError('Task', id);
    }

    return updated;
  }

  async deleteTask(rawParams: unknown): Promise<void> {
    const { id } = taskIdParamSchema.parse(rawParams);
    const existing = await this.tasks.findById(id);
    if (!existing) {
      throw new NotFoundError('Task', id);
    }
    const deleted = await this.tasks.delete(id);
    if (!deleted) {
      throw new NotFoundError('Task', id);
    }
  }
}

import type { Prisma, Task } from '@prisma/client';
import { prisma } from '../config/prisma';

export type TaskStatusValue = 'pending' | 'completed';

export interface ITaskRepository {
  create(data: Prisma.TaskCreateInput): Promise<Task>;
  findAll(filter?: { status?: TaskStatusValue }): Promise<Task[]>;
  findById(id: number): Promise<Task | null>;
  update(id: number, data: Prisma.TaskUpdateInput): Promise<Task | null>;
  delete(id: number): Promise<boolean>;
}

export class TaskRepository implements ITaskRepository {
  async create(data: Prisma.TaskCreateInput): Promise<Task> {
    return prisma.task.create({ data });
  }

  async findAll(filter?: { status?: TaskStatusValue }): Promise<Task[]> {
    return prisma.task.findMany({
      where: filter?.status ? { status: filter.status } : {},
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: number): Promise<Task | null> {
    return prisma.task.findUnique({ where: { id } });
  }

  async update(id: number, data: Prisma.TaskUpdateInput): Promise<Task | null> {
    try {
      return await prisma.task.update({ where: { id }, data });
    } catch {
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await prisma.task.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}

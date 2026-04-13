import type { Task } from '@prisma/client';
import { NotFoundError } from '../src/errors/app.error';
import type { ITaskRepository } from '../src/repositories/task.repository';
import { TaskService } from '../src/services/task.service';

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 1,
    title: 'Sample',
    description: null,
    status: 'pending',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    ...overrides,
  };
}

describe('TaskService', () => {
  let repo: jest.Mocked<ITaskRepository>;
  let service: TaskService;

  beforeEach(() => {
    repo = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    service = new TaskService(repo);
  });

  describe('createTask', () => {
    it('creates a task with default status pending', async () => {
      const created = makeTask();
      repo.create.mockResolvedValue(created);

      const result = await service.createTask({ title: 'Hello' });

      expect(repo.create).toHaveBeenCalledWith({
        title: 'Hello',
        description: undefined,
        status: 'pending',
      });
      expect(result).toEqual(created);
    });

    it('respects optional description and status', async () => {
      const created = makeTask({ status: 'completed' });
      repo.create.mockResolvedValue(created);

      await service.createTask({
        title: 'T',
        description: 'D',
        status: 'completed',
      });

      expect(repo.create).toHaveBeenCalledWith({
        title: 'T',
        description: 'D',
        status: 'completed',
      });
    });

    it('rejects invalid status', async () => {
      await expect(
        service.createTask({ title: 'x', status: 'done' as never }),
      ).rejects.toThrow();
      expect(repo.create).not.toHaveBeenCalled();
    });
  });

  describe('listTasks', () => {
    it('lists all tasks when no status filter', async () => {
      repo.findAll.mockResolvedValue([makeTask()]);

      await service.listTasks({});

      expect(repo.findAll).toHaveBeenCalledWith(undefined);
    });

    it('filters by status in the service layer', async () => {
      repo.findAll.mockResolvedValue([]);

      await service.listTasks({ status: 'completed' });

      expect(repo.findAll).toHaveBeenCalledWith({ status: 'completed' });
    });

    it('rejects invalid query status', async () => {
      await expect(service.listTasks({ status: 'x' })).rejects.toThrow();
      expect(repo.findAll).not.toHaveBeenCalled();
    });
  });

  describe('updateTask', () => {
    it('throws NotFoundError when task does not exist', async () => {
      repo.findById.mockResolvedValue(null);

      await expect(
        service.updateTask({ id: '99' }, { title: 'N' }),
      ).rejects.toThrow(NotFoundError);

      expect(repo.update).not.toHaveBeenCalled();
    });

    it('updates when task exists', async () => {
      const existing = makeTask({ id: 2 });
      const updated = makeTask({ id: 2, title: 'New' });
      repo.findById.mockResolvedValue(existing);
      repo.update.mockResolvedValue(updated);

      const result = await service.updateTask(
        { id: '2' },
        { title: 'New', status: 'completed' },
      );

      expect(repo.update).toHaveBeenCalledWith(2, {
        title: 'New',
        status: 'completed',
      });
      expect(result).toEqual(updated);
    });
  });

  describe('deleteTask', () => {
    it('throws NotFoundError when task does not exist', async () => {
      repo.findById.mockResolvedValue(null);

      await expect(service.deleteTask({ id: '5' })).rejects.toThrow(
        NotFoundError,
      );
      expect(repo.delete).not.toHaveBeenCalled();
    });

    it('deletes when task exists', async () => {
      repo.findById.mockResolvedValue(makeTask({ id: 3 }));
      repo.delete.mockResolvedValue(true);

      await service.deleteTask({ id: '3' });

      expect(repo.delete).toHaveBeenCalledWith(3);
    });
  });
});

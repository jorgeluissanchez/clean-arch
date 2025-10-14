import { TaskRepositoryPort } from '../../domain/repository/task.repository.port';
import { Task } from '../../domain/entity/task.entity';

export class TaskToggleUseCase {
  constructor(private readonly taskRepo: TaskRepositoryPort) {}

  async execute(id: string): Promise<Task> {
    if (!id) {
      throw new Error('ID is required');
    }
    return await this.taskRepo.toggleCompleteById(id);
  }
}

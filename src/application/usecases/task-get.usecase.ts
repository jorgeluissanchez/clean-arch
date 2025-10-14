import { TaskRepositoryPort } from '../../domain/repository/task.repository.port';
import { Task } from '../../domain/entity/task.entity';

export class TaskGetUseCase {
  constructor(private readonly taskRepo: TaskRepositoryPort) {}

  async execute(id: string): Promise<Task | null> {
    return this.taskRepo.findById(id);
  }
}

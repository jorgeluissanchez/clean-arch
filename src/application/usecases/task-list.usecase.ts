import { TaskRepositoryPort } from '../../domain/repository/task.repository.port';
import { Task } from '../../domain/entity/task.entity';
import { ListTaskDto } from '../dto/task-list.dto';

export class TaskListUseCase {
  constructor(private readonly taskRepo: TaskRepositoryPort) {}

  async execute(input: ListTaskDto): Promise<Task[]> {
    return this.taskRepo.findAll({
      search: input.search,
      categoryId: input.categoryId,
      completed: input.completed
    });
  }
}

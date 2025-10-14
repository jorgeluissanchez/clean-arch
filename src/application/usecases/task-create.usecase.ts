import { randomUUID } from 'crypto';
import { Task } from '../../domain/entity/task.entity';
import { TaskRepositoryPort } from '../../domain/repository/task.repository.port';
import { CreateTaskDto } from '../dto/task-create.dto';
import { CategoryRepositoryPort } from '../../domain/repository/category.repository.port';

export class TaskCreateUseCase {
  constructor(
    private readonly taskRepo: TaskRepositoryPort,
    private readonly categoryRepo: CategoryRepositoryPort,
  ) {}

  async execute(input: CreateTaskDto): Promise<Task> {
    const titleTaken = await this.taskRepo.existsByTitle(input.title);
    if (titleTaken) {
      throw new Error('Title already in use');
    }
    const categoryIdExists = await this.categoryRepo.findById(input.categoryId);
    if (!categoryIdExists) {
      throw new Error('CategoryId does not exist');
    }
    const task = new Task(randomUUID(), input.title, false, input.categoryId);
    return this.taskRepo.save(task);
  }
}

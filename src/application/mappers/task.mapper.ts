import { Task } from '../../domain/entity/task.entity';
import { TaskDto } from '../dto/task.dto';

export const toTaskDto = (d: Task): TaskDto => ({
  id: d.id,
  title: d.title,
  categoryId: d.categoryId,
  completed: d.completed,
});

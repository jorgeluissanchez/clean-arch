import { TaskRepositoryPort } from '../../../domain/repository/task.repository.port';
import { Task } from '../../../domain/entity/task.entity';
import { ListTaskDto } from '../../../application/dto/task-list.dto';

export class InMemoryTaskRepository implements TaskRepositoryPort {
  private store = new Map<string, Task>();

  async save(user: Task): Promise<Task> {
    this.store.set(user.id, user);
    return user;
  }
  async findById(id: string): Promise<Task | null> {
    return this.store.get(id) ?? null;
  }
  async findAll(filter?: ListTaskDto): Promise<Task[]> {
    let tasks = Array.from(this.store.values());
    
    if (filter?.search) {
      tasks = tasks.filter(task => 
        task.title.toLowerCase().includes(filter.search!.toLowerCase())
      );
    }
    
    if (filter?.categoryId) {
      tasks = tasks.filter(task => task.categoryId === filter.categoryId);
    }
    
    if (filter?.completed !== undefined) {
      tasks = tasks.filter(task => task.completed === filter.completed);
    }
    
    return tasks;
  }
  async existsByTitle(title: string): Promise<boolean> {
    return Array.from(this.store.values()).some(u => u.title.toLowerCase() === title.toLowerCase());
  }

  async toggleCompleteById(id: string): Promise<Task> {
    const task = this.store.get(id);
    if (!task) {
      throw new Error('Task not found');
    }
    task.completed = !task.completed;
    this.store.set(id, task);
    return task;
  }
}

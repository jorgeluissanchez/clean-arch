import { TaskRepositoryPort } from '../../../domain/repository/task.repository.port';
import { ListTaskDto } from '../../../application/dto/task-list.dto';
import { Task } from '../../../domain/entity/task.entity';
import { PrismaService } from './prisma.service';

export class PrismaTaskRepository implements TaskRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async save(task: Task): Promise<Task> {
    const saved = await this.prisma.task.upsert({
      where: { id: task.id },
      update: { title: task.title, completed: task.completed, categoryId: task.categoryId },
      create: { id: task.id, title: task.title, completed: task.completed, categoryId: task.categoryId },
    });
    return new Task(saved.id, saved.title, saved.completed, saved.categoryId);
  }

  async findById(id: string): Promise<Task | null> {
    const found = await this.prisma.task.findUnique({ where: { id } });
    return found ? new Task(found.id, found.title, found.completed, found.categoryId) : null;
  }

  async findAll(filter?: ListTaskDto): Promise<Task[]> {
    const where: any = {};
    
    if (filter?.search) {
      where.title = {
        contains: filter.search,
        mode: 'insensitive'
      };
    }
    
    if (filter?.categoryId) {
      where.categoryId = filter.categoryId;
    }
    
    if (filter?.completed !== undefined) {
      where.completed = filter.completed;
    }

    const rows = await this.prisma.task.findMany({ where });
    return rows.map(r => new Task(r.id, r.title, r.completed, r.categoryId));
  }

  async existsByTitle(title: string): Promise<boolean> {
    const count = await this.prisma.task.count({ where: { 
      title: { equals: title, mode: 'insensitive' } 
    } });
    return count > 0;
  }

  async toggleCompleteById(id: string): Promise<Task> {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new Error('Task not found');
    }
    const updated = await this.prisma.task.update({
      where: { id },
      data: { completed: !task.completed },
    });
    return new Task(updated.id, updated.title, updated.completed, updated.categoryId);
  }
}

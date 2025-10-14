import { CategoryRepositoryPort } from '../../../domain/repository/category.repository.port';
import { Category } from '../../../domain/entity/category.entity';
import { PrismaService } from './prisma.service';

export class PrismaCategoryRepository implements CategoryRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async save(category: Category): Promise<Category> {
    const saved = await this.prisma.category.upsert({
      where: { id: category.id },
      update: { name: category.name },
      create: { id: category.id, name: category.name },
    });
    return new Category(saved.id, saved.name);
  }

  async findById(id: string): Promise<Category | null> {
    const found = await this.prisma.category.findUnique({ where: { id } });
    return found ? new Category(found.id, found.name) : null;
  }

  async findAll(): Promise<Category[]> {
    const rows = await this.prisma.category.findMany();
    return rows.map(r => new Category(r.id, r.name));
  }

  async existsByName(name: string): Promise<boolean> {
    const count = await this.prisma.category.count({ where: { 
      name: {
        equals: name, mode: 'insensitive'
      }
     } });
    return count > 0;
  }
}

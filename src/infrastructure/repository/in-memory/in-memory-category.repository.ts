import { CategoryRepositoryPort } from '../../../domain/repository/category.repository.port';
import { Category } from '../../../domain/entity/category.entity';

export class InMemoryCategoryRepository implements CategoryRepositoryPort {
  private store = new Map<string, Category>();

  async save(user: Category): Promise<Category> {
    this.store.set(user.id, user);
    return user;
  }
  async findById(id: string): Promise<Category | null> {
    return this.store.get(id) ?? null;
  }
  async findAll(): Promise<Category[]> {
    return Array.from(this.store.values());
  }
  async existsByName(name: string): Promise<boolean> {
    return Array.from(this.store.values()).some(u => u.name.toLowerCase() === name.toLowerCase());
  }
}

import { CategoryRepositoryPort } from '../../domain/repository/category.repository.port';
import { Category } from '../../domain/entity/category.entity';

export class CategoryGetUseCase {
  constructor(private readonly categoryRepo: CategoryRepositoryPort) {}

  async execute(id: string): Promise<Category | null> {
    return this.categoryRepo.findById(id);
  }
}

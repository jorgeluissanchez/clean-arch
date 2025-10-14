import { CategoryRepositoryPort } from '../../domain/repository/category.repository.port';
import { Category } from '../../domain/entity/category.entity';

export class CategoryListUseCase {
  constructor(private readonly categoryRepo: CategoryRepositoryPort) {}

  async execute(): Promise<Category[]> {
    return this.categoryRepo.findAll();
  }
}

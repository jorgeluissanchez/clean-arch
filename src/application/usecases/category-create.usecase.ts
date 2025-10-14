import { randomUUID } from 'crypto';
import { Category } from '../../domain/entity/category.entity';
import { CategoryRepositoryPort } from '../../domain/repository/category.repository.port';
import { CreateCategoryDto } from '../dto/category-create.dto';

export class CategoryCreateUseCase {
  constructor(private readonly categoryRepo: CategoryRepositoryPort) {}

  async execute(input: CreateCategoryDto): Promise<Category> {
    const nameTaken = await this.categoryRepo.existsByName(input.name);
    if (nameTaken) {
      throw new Error('Name already in use');
    }
    const category = new Category(randomUUID(), input.name);
    return this.categoryRepo.save(category);
  }
}

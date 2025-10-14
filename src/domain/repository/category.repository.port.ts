import { Category } from "../entity/category.entity";

export interface CategoryRepositoryPort {
  save(user: Category): Promise<Category>;
  findById(id: string): Promise<Category | null>;
  findAll(): Promise<Category[]>;
  existsByName(name: string): Promise<boolean>;
}

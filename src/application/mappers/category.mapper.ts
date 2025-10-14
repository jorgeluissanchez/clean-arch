import { Category } from '../../domain/entity/category.entity';
import { CategoryDto } from '../dto/category.dto';

export const toCategoryDto = (d: Category): CategoryDto => ({
  id: d.id,
  name: d.name
});

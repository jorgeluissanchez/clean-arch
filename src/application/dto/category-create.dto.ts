import { CategoryDto } from "./category.dto";

export type CreateCategoryDto = Omit<CategoryDto, "id">;
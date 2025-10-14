import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { CategoryCreateUseCase } from '../../application/usecases/category-create.usecase';
import { CategoryGetUseCase } from '../../application/usecases/category-get.usecase';
import { CategoryListUseCase } from '../../application/usecases/category-list.usecase';
import { toCategoryDto } from '../../application/mappers/category.mapper';

class CreateCategoryRequest {
  @ApiProperty() name!: string;
}

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryCreate: CategoryCreateUseCase,
    private readonly categoryGet: CategoryGetUseCase,
    private readonly categoryList: CategoryListUseCase,
  ) {}

  @Post()
  async create(@Body() body: CreateCategoryRequest) {
    if (!body?.name) {
      throw new Error('name are required');
    }
    const category = await this.categoryCreate.execute({ name: body.name });
    return toCategoryDto(category);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    const category = await this.categoryGet.execute(id);
    if (!category) return { message: 'Not found' };
    return toCategoryDto(category);
  }

  @Get()
  async list() {
    const categories = await this.categoryList.execute();
    return categories.map(toCategoryDto);
  }
} 
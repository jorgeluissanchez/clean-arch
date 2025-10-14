import { Controller, Get, Post, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { CategoryCreateUseCase } from '../../application/usecases/category-create.usecase';
import { CategoryGetUseCase } from '../../application/usecases/category-get.usecase';
import { CategoryListUseCase } from '../../application/usecases/category-list.usecase';
import { toCategoryDto } from '../../application/mappers/category.mapper';

class CreateCategoryRequest {
  @ApiProperty({ description: 'Category name' })
  @IsString()
  @IsNotEmpty()
  name!: string;
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
    try {
      const category = await this.categoryCreate.execute({ name: body.name });
      return toCategoryDto(category);
    } catch (error) {
      if (error.message) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    try {
      const category = await this.categoryGet.execute(id);
      if (!category) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      }
      return toCategoryDto(category);
    } catch (error) {
      if (error.message) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async list() {
    try {
      const categories = await this.categoryList.execute();
      return categories.map(toCategoryDto);
    } catch (error) {
      if (error.message) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
} 
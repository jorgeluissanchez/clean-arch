import { Module } from '@nestjs/common';
import { CategoryController } from '../controller/category.controller';
import { CATEGORY_REPOSITORY } from '../../application/tokens';
import { InMemoryCategoryRepository } from '../../infrastructure/repository/in-memory/in-memory-category.repository';
import { CategoryCreateUseCase } from '../../application/usecases/category-create.usecase';
import { CategoryGetUseCase } from '../../application/usecases/category-get.usecase';
import { CategoryListUseCase } from '../../application/usecases/category-list.usecase';
import { PrismaService } from '../../infrastructure/repository/prisma/prisma.service';
import { PrismaCategoryRepository } from '../../infrastructure/repository/prisma/prisma-category.repository';

const usePrisma = !!process.env.DATABASE_URL;

@Module({
  controllers: [CategoryController],
  providers: [
    ...(usePrisma ? [PrismaService] : []),
    {
      provide: CATEGORY_REPOSITORY,
      useFactory: (prisma?: PrismaService) => {
        return usePrisma ? new PrismaCategoryRepository(prisma!) : new InMemoryCategoryRepository();
      },
      inject: usePrisma ? [PrismaService] : [],
    },
    {
      provide: CategoryCreateUseCase,
      useFactory: (repo: any) => new CategoryCreateUseCase(repo),
      inject: [CATEGORY_REPOSITORY],
    },
    {
      provide: CategoryGetUseCase,
      useFactory: (repo: any) => new CategoryGetUseCase(repo),
      inject: [CATEGORY_REPOSITORY],
    },
    {
      provide: CategoryListUseCase,
      useFactory: (repo: any) => new CategoryListUseCase(repo),
      inject: [CATEGORY_REPOSITORY],
    },
  ],
})
export class CategoryHttpModule {}

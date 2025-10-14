import { Module } from '@nestjs/common';
import { TaskController } from '../controller/task.controller';
import { TASK_REPOSITORY, CATEGORY_REPOSITORY } from '../../application/tokens';
import { InMemoryTaskRepository } from '../../infrastructure/repository/in-memory/in-memory-task.repository';
import { InMemoryCategoryRepository } from '../../infrastructure/repository/in-memory/in-memory-category.repository';
import { TaskCreateUseCase } from '../../application/usecases/task-create.usecase';
import { TaskGetUseCase } from '../../application/usecases/task-get.usecase';
import { TaskListUseCase } from '../../application/usecases/task-list.usecase';
import { TaskToggleUseCase } from '../../application/usecases/task-toggle.usecase';
import { PrismaService } from '../../infrastructure/repository/prisma/prisma.service';
import { PrismaTaskRepository } from '../../infrastructure/repository/prisma/prisma-task.repository';
import { PrismaCategoryRepository } from '../../infrastructure/repository/prisma/prisma-category.repository';

const usePrisma = !!process.env.DATABASE_URL;

@Module({
  controllers: [TaskController],
  providers: [
    ...(usePrisma ? [PrismaService] : []),
    {
      provide: TASK_REPOSITORY,
      useFactory: (prisma?: PrismaService) => {
        return usePrisma ? new PrismaTaskRepository(prisma!) : new InMemoryTaskRepository();
      },
      inject: usePrisma ? [PrismaService] : [],
    },
    {
      provide: CATEGORY_REPOSITORY,
      useFactory: (prisma?: PrismaService) => {
        return usePrisma ? new PrismaCategoryRepository(prisma!) : new InMemoryCategoryRepository();
      },
      inject: usePrisma ? [PrismaService] : [],
    },
    {
      provide: TaskCreateUseCase,
      useFactory: (taskRepo: any, categoryRepo: any) => new TaskCreateUseCase(taskRepo, categoryRepo),
      inject: [TASK_REPOSITORY, CATEGORY_REPOSITORY],
    },
    {
      provide: TaskGetUseCase,
      useFactory: (repo: any) => new TaskGetUseCase(repo),
      inject: [TASK_REPOSITORY],
    },
    {
      provide: TaskListUseCase,
      useFactory: (repo: any) => new TaskListUseCase(repo),
      inject: [TASK_REPOSITORY],
    },
    {
      provide: TaskToggleUseCase,
      useFactory: (repo: any) => new TaskToggleUseCase(repo),
      inject: [TASK_REPOSITORY],
    },
  ],
})
export class TaskHttpModule {}

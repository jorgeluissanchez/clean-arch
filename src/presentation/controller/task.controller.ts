import { Controller, Get, Post, Param, Body, Query, Patch } from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { TaskCreateUseCase } from '../../application/usecases/task-create.usecase';
import { TaskGetUseCase } from '../../application/usecases/task-get.usecase';
import { TaskListUseCase } from '../../application/usecases/task-list.usecase';
import { TaskToggleUseCase } from '../../application/usecases/task-toggle.usecase';
import { toTaskDto } from '../../application/mappers/task.mapper';

class CreateTaskRequest {
  @ApiProperty() title!: string;
  @ApiProperty() categoryId!: string;
}

@ApiTags('task')
@Controller('task')
export class TaskController {
  constructor(
    private readonly taskCreate: TaskCreateUseCase,
    private readonly taskGet: TaskGetUseCase,
    private readonly taskList: TaskListUseCase,
    private readonly taskToggle: TaskToggleUseCase,
  ) {}

  @Post()
  async create(@Body() body: CreateTaskRequest) {
    if (!body?.title && !body?.categoryId) {
      throw new Error('title are required');
    }
    const task = await this.taskCreate.execute({ title: body.title, categoryId: body.categoryId });
    return toTaskDto(task);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    const task = await this.taskGet.execute(id);
    if (!task) return { message: 'Not found' };
    return toTaskDto(task);
  }

  @Get()
  async list(
    @Query('categoryId') categoryId?: string,
    @Query('completed') completed?: boolean,
    @Query('search') search?: string,
  ) {
    const tasks = await this.taskList.execute({ categoryId, completed, search });
    return tasks.map(toTaskDto);
  }

  @Patch(':id/toggle')
  async toggle(@Param('id') id: string) {
    const task = await this.taskToggle.execute(id);
    return toTaskDto(task);
  }
}

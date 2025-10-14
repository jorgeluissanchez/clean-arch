import { Controller, Get, Post, Param, Body, Query, Patch, HttpException, HttpStatus } from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { TaskCreateUseCase } from '../../application/usecases/task-create.usecase';
import { TaskGetUseCase } from '../../application/usecases/task-get.usecase';
import { TaskListUseCase } from '../../application/usecases/task-list.usecase';
import { TaskToggleUseCase } from '../../application/usecases/task-toggle.usecase';
import { toTaskDto } from '../../application/mappers/task.mapper';

class CreateTaskRequest {
  @ApiProperty({ description: 'Task title' })
  @IsString()
  @IsNotEmpty()
  title!: string;
  
  @ApiProperty({ description: 'Category ID' })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  categoryId!: string;
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
    try {
      const task = await this.taskCreate.execute({ title: body.title, categoryId: body.categoryId });
      return toTaskDto(task);
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
      const task = await this.taskGet.execute(id);
      if (!task) {
        throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
      }
      return toTaskDto(task);
    } catch (error) {
      if (error.message) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async list(
    @Query('categoryId') categoryId?: string,
    @Query('completed') completed?: boolean,
    @Query('search') search?: string,
  ) {
    try {
      const tasks = await this.taskList.execute({ categoryId, completed, search });
      return tasks.map(toTaskDto);
    } catch (error) {
      if (error.message) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id/toggle')
  async toggle(@Param('id') id: string) {
    try {
      const task = await this.taskToggle.execute(id);
      return toTaskDto(task);
    } catch (error) {
      if (error.message) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

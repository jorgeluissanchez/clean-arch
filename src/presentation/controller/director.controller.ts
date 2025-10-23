import { Controller, Get, Post, Param, Body, HttpException, HttpStatus, Delete, Patch } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiPropertyOptional, ApiTags } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { DirectorCreateUseCase } from '../../application/usecases/director-create.usecase';
import { DirectorUpdateUseCase } from '../../application/usecases/director-update.usecase';
import { DirectorGetUseCase } from '../../application/usecases/director-get.usecase';
import { DirectorDeleteUseCase } from '../../application/usecases/director-delete.usecase';
import { DirectorListUseCase } from '../../application/usecases/director-list.usecase';
import { MovieListByDirectorUseCase } from '../../application/usecases/movie-get.usecase';
import { toDirectorDto } from '../../application/mappers/director.mapper';
import { toMovieDto } from '../../application/mappers/movie.mapper';

class CreateDirectorRequest {
  @ApiProperty({ description: 'Director name' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'Director nationality' })
  @IsString()
  @IsNotEmpty()
  nationality!: string;
  
  @ApiProperty({ description: 'Director birth day' })
  @IsString()
  @IsNotEmpty()
  birth_day!: string;
}

class UpdateDirectorRequest {
  @ApiPropertyOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  nationality?: string;
  
  @ApiPropertyOptional()
  @IsString()
  birth_day?: string;
}

@ApiTags('director')
@Controller('director')
export class DirectorController {
  constructor(
    private readonly directorCreate: DirectorCreateUseCase,
    private readonly directorUpdate: DirectorUpdateUseCase,
    private readonly directorGet: DirectorGetUseCase,
    private readonly directorList: DirectorListUseCase,
    private readonly directorDelete: DirectorDeleteUseCase,
    private readonly movieListByDirector: MovieListByDirectorUseCase,

  ) {}

  @Post()
  async create(@Body() body: CreateDirectorRequest) {
    try {
      const director = await this.directorCreate.execute({ name: body.name, nationality: body.nationality, birth_day: body.birth_day });
      return toDirectorDto(director);
    } catch (error) {
      if (error.message) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateDirectorRequest) {
    try {
      const director = await this.directorUpdate.execute(id, body);
      return toDirectorDto(director);
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
      const director = await this.directorGet.execute(id);
      if (!director) {
        throw new HttpException('Director not found', HttpStatus.NOT_FOUND);
      }
      return toDirectorDto(director);
    } catch (error) {
      if (error.message) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      const director = await this.directorGet.execute(id);
      if (!director) {
        throw new HttpException('Director not found', HttpStatus.NOT_FOUND);
      }
      const deleteDirector = await this.directorDelete.execute(id);
      return deleteDirector;
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
      const categories = await this.directorList.execute();
      return categories.map(toDirectorDto);
    } catch (error) {
      if (error.message) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id/movies')
  async listMovies(@Param('id') id: string) {
    try {
      const movies = await this.movieListByDirector.execute(id);
      return movies.map(toMovieDto);
    } catch (error) {
      if (error.message) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
} 
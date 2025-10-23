import { Movie } from '../../domain/entity/movie.entity';
import { MovieRepositoryPort } from '../../domain/repository/movie.repository.port';
import { DirectorRepositoryPort } from '../../domain/repository/director.repository.port';

export type UpdateMovieDto = {
  title?: string;
  year?: string;
  directorId?: string;
};

export class MovieUpdateUseCase {
  constructor(
    private readonly movieRepo: MovieRepositoryPort,
    private readonly directorRepo: DirectorRepositoryPort,
  ) {}

  async execute(id: string, input: UpdateMovieDto): Promise<Movie> {
    const existing = await this.movieRepo.findById(id);
    if (!existing) {
      throw new Error('Movie not found');
    }

    let directorIdToUse = existing.directorId;
    if (input.directorId && input.directorId !== existing.directorId) {
      const directorIdExists = await this.directorRepo.findById(input.directorId);
      if (!directorIdExists) {
        throw new Error('directorId does not exist');
      }
      directorIdToUse = input.directorId;
    }

    const updated = new Movie(
      existing.id,
      input.title ?? existing.title,
      input.year ?? existing.year,
      directorIdToUse,
      existing.director,
    );

    return this.movieRepo.save(updated);
  }
}

import { MovieRepositoryPort } from '../../domain/repository/movie.repository.port';
import { Movie } from '../../domain/entity/movie.entity';

export class MovieGetUseCase {
  constructor(private readonly movieRepo: MovieRepositoryPort) {}

  async execute(id: string): Promise<Movie | null> {
    return this.movieRepo.findById(id);
  }
}

export class MovieListByDirectorUseCase {
  constructor(private readonly movieRepo: MovieRepositoryPort) {}

  async execute(directorId: string): Promise<Movie[]> {
    return this.movieRepo.findByDirectorId(directorId);
  }
}

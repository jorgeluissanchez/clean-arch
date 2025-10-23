import { Movie } from '../../domain/entity/movie.entity';
import { MovieDto } from '../dto/movie.dto';
import { DirectorDto } from '../dto/director.dto';

export const toMovieDto = (d: Movie): MovieDto => {
  const director: DirectorDto | undefined = d.director
    ? { id: d.director.id, name: d.director.name, nationality: d.director.nationality, birth_day: d.director.birth_day }
    : undefined;
  return {
    id: d.id,
    title: d.title,
    year: d.year,
    directorId: d.directorId,
    director,
  };
};

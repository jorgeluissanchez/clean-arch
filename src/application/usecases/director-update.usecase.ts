import { Director } from '../../domain/entity/director.entity';
import { DirectorRepositoryPort } from '../../domain/repository/director.repository.port';

export type UpdateDirectorDto = {
  name?: string;
  nationality?: string;
  birth_day?: string;
};

export class DirectorUpdateUseCase {
  constructor(private readonly directorRepo: DirectorRepositoryPort) {}

  async execute(id: string, input: UpdateDirectorDto): Promise<Director> {
    const existing = await this.directorRepo.findById(id);
    if (!existing) {
      throw new Error('Director not found');
    }

    if (input.name && input.name !== existing.name) {
      const nameTaken = await this.directorRepo.existsByName(input.name);
      if (nameTaken) {
        throw new Error('Name already in use');
      }
    }

    const updated = new Director(
      existing.id,
      input.name ?? existing.name,
      input.nationality ?? existing.nationality,
      input.birth_day ?? existing.birth_day,
    );

    return this.directorRepo.save(updated);
  }
}

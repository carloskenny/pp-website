import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TRIPS_REPOSITORY, TripsRepository } from '../domain/trips.repository';
import { UpdateTripInput } from '../schemas/trips.schema';

@Injectable()
export class UpdateTripUseCase {
  constructor(
    @Inject(TRIPS_REPOSITORY) private readonly tripsRepository: TripsRepository,
  ) {}

  async execute(id: string, input: UpdateTripInput) {
    const existing = await this.tripsRepository.findById(id);
    if (!existing) throw new NotFoundException('Trip not found');

    if (input.slug && input.slug !== existing.slug) {
      const tripWithSlug = await this.tripsRepository.findBySlug(input.slug);
      if (tripWithSlug && tripWithSlug.id !== id) {
        throw new ConflictException('Trip slug already exists');
      }
    }

    return this.tripsRepository.update(id, input);
  }
}

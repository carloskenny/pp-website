import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { TRIPS_REPOSITORY, TripsRepository } from '../domain/trips.repository';
import { CreateTripInput } from '../schemas/trips.schema';

@Injectable()
export class CreateTripUseCase {
  constructor(
    @Inject(TRIPS_REPOSITORY) private readonly tripsRepository: TripsRepository,
  ) {}

  async execute(input: CreateTripInput) {
    const existing = await this.tripsRepository.findBySlug(input.slug);
    if (existing) {
      throw new ConflictException('Trip slug already exists');
    }
    return this.tripsRepository.create(input);
  }
}

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  TRIPS_REPOSITORY,
  TripsRepository,
} from '../domain/trips.repository';

@Injectable()
export class FindTripBySlugUseCase {
  constructor(
    @Inject(TRIPS_REPOSITORY) private readonly tripsRepository: TripsRepository,
  ) {}

  async execute(slug: string) {
    const trip = await this.tripsRepository.findBySlug(slug);
    if (!trip) throw new NotFoundException('Trip not found');
    return trip;
  }
}

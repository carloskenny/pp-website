import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TRIPS_REPOSITORY, TripsRepository } from '../domain/trips.repository';

@Injectable()
export class FindTripBySlugUseCase {
  constructor(
    @Inject(TRIPS_REPOSITORY) private readonly tripsRepository: TripsRepository,
  ) {}

  async execute(slug: string, options: { publishedOnly?: boolean } = {}) {
    const trip = options.publishedOnly
      ? await this.tripsRepository.findPublishedBySlug(slug)
      : await this.tripsRepository.findBySlug(slug);
    if (!trip) throw new NotFoundException('Trip not found');
    return trip;
  }
}

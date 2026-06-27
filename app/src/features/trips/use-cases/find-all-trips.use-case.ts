import { Inject, Injectable } from '@nestjs/common';
import { TRIPS_REPOSITORY, TripsRepository } from '../domain/trips.repository';

@Injectable()
export class FindAllTripsUseCase {
  constructor(
    @Inject(TRIPS_REPOSITORY) private readonly tripsRepository: TripsRepository,
  ) {}

  execute(options: { publishedOnly?: boolean } = {}) {
    if (options.publishedOnly) {
      return this.tripsRepository.findPublished();
    }

    return this.tripsRepository.findAll();
  }
}

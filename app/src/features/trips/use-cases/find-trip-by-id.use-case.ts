import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  TRIPS_REPOSITORY,
  TripsRepository,
} from '../domain/trips.repository';

@Injectable()
export class FindTripByIdUseCase {
  constructor(
    @Inject(TRIPS_REPOSITORY) private readonly tripsRepository: TripsRepository,
  ) {}

  async execute(id: string) {
    const trip = await this.tripsRepository.findById(id);
    if (!trip) throw new NotFoundException('Trip not found');
    return trip;
  }
}

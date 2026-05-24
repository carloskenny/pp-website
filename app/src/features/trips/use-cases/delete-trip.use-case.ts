import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  TRIPS_REPOSITORY,
  TripsRepository,
} from '../domain/trips.repository';

@Injectable()
export class DeleteTripUseCase {
  constructor(
    @Inject(TRIPS_REPOSITORY) private readonly tripsRepository: TripsRepository,
  ) {}

  async execute(id: string) {
    const existing = await this.tripsRepository.findById(id);
    if (!existing) throw new NotFoundException('Trip not found');
    return this.tripsRepository.delete(id);
  }
}

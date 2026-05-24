import { Inject, Injectable } from '@nestjs/common';
import {
  TRIPS_REPOSITORY,
  TripsRepository,
} from '../domain/trips.repository';

@Injectable()
export class FindAllTripsUseCase {
  constructor(
    @Inject(TRIPS_REPOSITORY) private readonly tripsRepository: TripsRepository,
  ) {}

  execute() {
    return this.tripsRepository.findAll();
  }
}

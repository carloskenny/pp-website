import { Inject, Injectable } from '@nestjs/common';
import {
  RESERVATIONS_REPOSITORY,
  ReservationsRepository,
} from '../domain/reservations.repository';

@Injectable()
export class FindAllReservationsUseCase {
  constructor(
    @Inject(RESERVATIONS_REPOSITORY)
    private readonly reservationsRepository: ReservationsRepository,
  ) {}

  execute(filters: { tripId?: string } = {}) {
    if (filters.tripId) {
      return this.reservationsRepository.findByTripId(filters.tripId);
    }

    return this.reservationsRepository.findAll();
  }
}

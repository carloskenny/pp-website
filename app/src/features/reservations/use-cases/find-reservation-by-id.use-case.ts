import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  RESERVATIONS_REPOSITORY,
  ReservationsRepository,
} from '../domain/reservations.repository';

@Injectable()
export class FindReservationByIdUseCase {
  constructor(
    @Inject(RESERVATIONS_REPOSITORY)
    private readonly reservationsRepository: ReservationsRepository,
  ) {}

  async execute(id: string) {
    const reservation = await this.reservationsRepository.findById(id);
    if (!reservation) throw new NotFoundException('Reservation not found');
    return reservation;
  }
}

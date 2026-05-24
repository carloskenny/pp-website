import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  RESERVATIONS_REPOSITORY,
  ReservationsRepository,
} from '../domain/reservations.repository';
import { UpdateReservationStatusInput } from '../schemas/reservations.schema';

@Injectable()
export class UpdateReservationStatusUseCase {
  constructor(
    @Inject(RESERVATIONS_REPOSITORY)
    private readonly reservationsRepository: ReservationsRepository,
  ) {}

  async execute(id: string, input: UpdateReservationStatusInput) {
    const reservation = await this.reservationsRepository.findById(id);
    if (!reservation) throw new NotFoundException('Reservation not found');
    return this.reservationsRepository.updateStatus(id, input);
  }
}

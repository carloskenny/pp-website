import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import {
  RESERVATIONS_REPOSITORY,
  ReservationsRepository,
} from '../domain/reservations.repository';
import { CreateReservationInput } from '../schemas/reservations.schema';

@Injectable()
export class CreateReservationUseCase {
  constructor(
    @Inject(RESERVATIONS_REPOSITORY)
    private readonly reservationsRepository: ReservationsRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(input: CreateReservationInput) {
    const trip = await this.prisma.trip.findUnique({ where: { id: input.tripId } });
    if (!trip) throw new NotFoundException('Trip not found');

    if (input.boardingPointId) {
      const boardingPoint = await this.prisma.tripBoardingPoint.findUnique({
        where: { id: input.boardingPointId },
      });
      if (!boardingPoint) throw new NotFoundException('Boarding point not found');
    }

    return this.reservationsRepository.create(input);
  }
}

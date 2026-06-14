import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import {
  RESERVATIONS_REPOSITORY,
  ReservationsRepository,
} from '../domain/reservations.repository';
import { CreateReservationInput } from '../schemas/reservations.schema';
import { UpsertTrilheiroUseCase } from '../../trilheiros/use-cases/upsert-trilheiro.use-case';

@Injectable()
export class CreateReservationUseCase {
  constructor(
    @Inject(RESERVATIONS_REPOSITORY)
    private readonly reservationsRepository: ReservationsRepository,
    private readonly prisma: PrismaService,
    private readonly upsertTrilheiroUseCase: UpsertTrilheiroUseCase,
  ) {}

  async execute(input: CreateReservationInput) {
    const trip = await this.prisma.trip.findUnique({ where: { id: input.tripId } });
    if (!trip) throw new NotFoundException('Trip not found');

    if (input.boardingPointId) {
      const boardingPoint = await this.prisma.tripBoardingPoint.findUnique({
        where: { id: input.boardingPointId },
      });
      if (!boardingPoint) throw new NotFoundException('Boarding point not found');
      if (boardingPoint.tripId !== input.tripId) {
        throw new NotFoundException('Boarding point not found for this trip');
      }
    }

    const trilheiro = await this.upsertTrilheiroUseCase.execute({
      fullName: input.fullName,
      email: input.email,
      phone: input.whatsapp,
      documentNumber: input.cpf ?? null,
      birthDate: input.birthDate ?? null,
      status: 'INCOMPLETE',
      registrationStep: 'minimal',
      lastAccessAt: new Date(),
    });

    return this.reservationsRepository.create({
      ...input,
      trilheiroId: trilheiro.id,
    });
  }
}

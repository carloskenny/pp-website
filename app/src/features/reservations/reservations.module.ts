import { Module } from '@nestjs/common';
import { ReservationsController } from './http/reservations.controller';
import { RESERVATIONS_REPOSITORY } from './domain/reservations.repository';
import { ReservationsPrismaRepository } from './infra/reservations-prisma.repository';
import { CreateReservationUseCase } from './use-cases/create-reservation.use-case';
import { FindAllReservationsUseCase } from './use-cases/find-all-reservations.use-case';
import { FindReservationByIdUseCase } from './use-cases/find-reservation-by-id.use-case';
import { UpdateReservationStatusUseCase } from './use-cases/update-reservation-status.use-case';

@Module({
  controllers: [ReservationsController],
  providers: [
    { provide: RESERVATIONS_REPOSITORY, useClass: ReservationsPrismaRepository },
    FindAllReservationsUseCase,
    FindReservationByIdUseCase,
    CreateReservationUseCase,
    UpdateReservationStatusUseCase,
  ],
})
export class ReservationsModule {}

import { Module } from '@nestjs/common';
import { TripsController } from './http/trips.controller';
import { TripsPrismaRepository } from './infra/trips-prisma.repository';
import { TRIPS_REPOSITORY } from './domain/trips.repository';
import { CreateTripUseCase } from './use-cases/create-trip.use-case';
import { DeleteTripUseCase } from './use-cases/delete-trip.use-case';
import { FindAllTripsUseCase } from './use-cases/find-all-trips.use-case';
import { FindTripByIdUseCase } from './use-cases/find-trip-by-id.use-case';
import { FindTripBySlugUseCase } from './use-cases/find-trip-by-slug.use-case';
import { UpdateTripUseCase } from './use-cases/update-trip.use-case';
import { SecurityModule } from '../../shared/security/security.module';

@Module({
  imports: [SecurityModule],
  controllers: [TripsController],
  providers: [
    { provide: TRIPS_REPOSITORY, useClass: TripsPrismaRepository },
    FindAllTripsUseCase,
    FindTripByIdUseCase,
    FindTripBySlugUseCase,
    CreateTripUseCase,
    UpdateTripUseCase,
    DeleteTripUseCase,
  ],
  exports: [TRIPS_REPOSITORY],
})
export class TripsModule {}

import { Prisma } from '@prisma/client';
import {
  CreateReservationInput,
  UpdateReservationStatusInput,
} from '../schemas/reservations.schema';

export const RESERVATIONS_REPOSITORY = Symbol('RESERVATIONS_REPOSITORY');

export type ReservationWithRelations = Prisma.ReservationGetPayload<{
  include: {
    trilheiro: {
      select: {
        id: true;
        fullName: true;
        email: true;
        phone: true;
        status: true;
      };
    };
    trip: {
      select: {
        id: true;
        slug: true;
        title: true;
        destination: true;
        dateLabel: true;
      };
    };
    boardingPoint: {
      select: {
        id: true;
        label: true;
      };
    };
  };
}>;

export type CreateReservationData = CreateReservationInput & {
  trilheiroId?: string | null;
};

export type ReservationsRepository = {
  findAll(): Promise<ReservationWithRelations[]>;
  findByTripId(tripId: string): Promise<ReservationWithRelations[]>;
  findById(id: string): Promise<ReservationWithRelations | null>;
  create(input: CreateReservationData): Promise<ReservationWithRelations>;
  updateStatus(
    id: string,
    input: UpdateReservationStatusInput,
  ): Promise<ReservationWithRelations>;
};

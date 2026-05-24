import { Reservation } from '@prisma/client';
import {
  CreateReservationInput,
  UpdateReservationStatusInput,
} from '../schemas/reservations.schema';

export const RESERVATIONS_REPOSITORY = Symbol('RESERVATIONS_REPOSITORY');

export type ReservationsRepository = {
  findAll(): Promise<Reservation[]>;
  findById(id: string): Promise<Reservation | null>;
  create(input: CreateReservationInput): Promise<Reservation>;
  updateStatus(
    id: string,
    input: UpdateReservationStatusInput,
  ): Promise<Reservation>;
};

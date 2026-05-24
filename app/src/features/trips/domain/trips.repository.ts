import { Trip } from '@prisma/client';
import { CreateTripInput, UpdateTripInput } from '../schemas/trips.schema';

export const TRIPS_REPOSITORY = Symbol('TRIPS_REPOSITORY');

export type TripsRepository = {
  findAll(): Promise<Trip[]>;
  findById(id: string): Promise<Trip | null>;
  findBySlug(slug: string): Promise<Trip | null>;
  create(input: CreateTripInput): Promise<Trip>;
  update(id: string, input: UpdateTripInput): Promise<Trip>;
  delete(id: string): Promise<Trip>;
};

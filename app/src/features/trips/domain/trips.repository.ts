import { Prisma } from '@prisma/client';
import { CreateTripInput, UpdateTripInput } from '../schemas/trips.schema';

export const TRIPS_REPOSITORY = Symbol('TRIPS_REPOSITORY');

export type TripWithBoardingPoints = Prisma.TripGetPayload<{
  include: {
    boardingPoints: {
      select: {
        id: true;
        label: true;
        order: true;
      };
    };
    interests: {
      select: {
        id: true;
        type: true;
        order: true;
      };
    };
  };
}>;

export type PublicTripCard = Prisma.TripGetPayload<{
  select: {
    id: true;
    title: true;
    slug: true;
    destination: true;
    dateLabel: true;
    eventDate: true;
    departureTime: true;
    experienceType: true;
    price: true;
    capacity: true;
    difficulty: true;
    mainImageUrl: true;
    status: true;
    interests: {
      select: {
        id: true;
        type: true;
        order: true;
      };
    };
  };
}> & {
  availableSpots: number | null;
};

export type TripsRepository = {
  findAll(): Promise<TripWithBoardingPoints[]>;
  findPublished(): Promise<PublicTripCard[]>;
  findById(id: string): Promise<TripWithBoardingPoints | null>;
  findBySlug(slug: string): Promise<TripWithBoardingPoints | null>;
  findPublishedBySlug(slug: string): Promise<TripWithBoardingPoints | null>;
  create(input: CreateTripInput): Promise<TripWithBoardingPoints>;
  update(id: string, input: UpdateTripInput): Promise<TripWithBoardingPoints>;
  delete(id: string): Promise<TripWithBoardingPoints>;
};

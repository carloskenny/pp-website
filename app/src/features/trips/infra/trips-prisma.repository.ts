import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { PublicTripCard, TripsRepository } from '../domain/trips.repository';
import { CreateTripInput, UpdateTripInput } from '../schemas/trips.schema';

@Injectable()
export class TripsPrismaRepository implements TripsRepository {
  constructor(private readonly prisma: PrismaService) {}

  private readonly includeBoardingPoints = {
    boardingPoints: {
      select: {
        id: true,
        label: true,
        order: true,
      },
      orderBy: { order: 'asc' as const },
    },
    interests: {
      select: {
        id: true,
        type: true,
        order: true,
      },
      orderBy: { order: 'asc' as const },
    },
  } as const;

  private readonly publicTripSelect = {
    id: true,
    title: true,
    slug: true,
    destination: true,
    dateLabel: true,
    eventDate: true,
    departureTime: true,
    experienceType: true,
    price: true,
    capacity: true,
    difficulty: true,
    mainImageUrl: true,
    status: true,
    interests: {
      select: {
        id: true,
        type: true,
        order: true,
      },
      orderBy: { order: 'asc' as const },
    },
  } as const;

  private async withAvailableSpots(
    trips: Array<
      {
        id: string;
        capacity: number | null;
      } & Omit<PublicTripCard, 'availableSpots' | 'capacity'>
    >,
  ) {
    return Promise.all(
      trips.map(async (trip) => {
        const reservationCount = await this.prisma.reservation.count({
          where: {
            tripId: trip.id,
            status: { not: 'canceled' },
          },
        });

        return {
          ...trip,
          availableSpots:
            typeof trip.capacity === 'number'
              ? Math.max(trip.capacity - reservationCount, 0)
              : null,
        } satisfies PublicTripCard;
      }),
    );
  }

  findAll() {
    return this.prisma.trip.findMany({
      orderBy: { createdAt: 'desc' },
      include: this.includeBoardingPoints,
    });
  }

  findPublished() {
    return this.prisma.trip
      .findMany({
        where: { status: 'active' },
        orderBy: [{ eventDate: 'asc' }, { createdAt: 'asc' }],
        select: this.publicTripSelect,
      })
      .then((trips) => this.withAvailableSpots(trips));
  }

  findById(id: string) {
    return this.prisma.trip.findUnique({
      where: { id },
      include: this.includeBoardingPoints,
    });
  }

  findBySlug(slug: string) {
    return this.prisma.trip.findUnique({
      where: { slug },
      include: this.includeBoardingPoints,
    });
  }

  findPublishedBySlug(slug: string) {
    return this.prisma.trip.findFirst({
      where: { slug, status: 'active' },
      include: this.includeBoardingPoints,
    });
  }

  create(input: CreateTripInput) {
    const { boardingPoints, interests, ...tripInput } = input;

    return this.prisma.trip.create({
      data: {
        ...tripInput,
        boardingPoints:
          boardingPoints !== undefined
            ? {
                create: boardingPoints.map((boardingPoint, index) => ({
                  label: boardingPoint.label,
                  order: boardingPoint.order ?? index,
                })),
              }
            : undefined,
        interests:
          interests !== undefined
            ? {
                create: interests.map((type, index) => ({
                  type,
                  order: index,
                })),
              }
            : undefined,
      },
      include: this.includeBoardingPoints,
    });
  }

  update(id: string, input: UpdateTripInput) {
    const { boardingPoints, interests, ...tripInput } = input;

    return this.prisma.$transaction(async (tx) => {
      if (boardingPoints !== undefined) {
        await tx.tripBoardingPoint.deleteMany({ where: { tripId: id } });
      }

      if (interests !== undefined) {
        await tx.tripInterest.deleteMany({ where: { tripId: id } });
      }

      return tx.trip.update({
        where: { id },
        data: {
          ...tripInput,
          boardingPoints:
            boardingPoints !== undefined
              ? {
                  create: boardingPoints.map((boardingPoint, index) => ({
                    label: boardingPoint.label,
                    order: boardingPoint.order ?? index,
                  })),
                }
              : undefined,
          interests:
            interests !== undefined
              ? {
                  create: interests.map((type, index) => ({
                    type,
                    order: index,
                  })),
                }
              : undefined,
        },
        include: this.includeBoardingPoints,
      });
    });
  }

  delete(id: string) {
    return this.prisma.trip.delete({
      where: { id },
      include: this.includeBoardingPoints,
    });
  }
}

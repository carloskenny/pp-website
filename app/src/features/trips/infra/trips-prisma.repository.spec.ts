import { TripsPrismaRepository } from './trips-prisma.repository';
import { PrismaService } from '../../../shared/prisma/prisma.service';

describe('TripsPrismaRepository', () => {
  it('returns only published trips ordered by date with available spots', async () => {
    const prisma = {
      trip: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'trip-1',
            title: 'Trip 1',
            slug: 'trip-1',
            destination: 'Destino 1',
            dateLabel: '01/06/2026',
            eventDate: new Date('2026-06-01T10:00:00.000Z'),
            departureTime: '05:30',
            experienceType: 'trail',
            price: 199,
            capacity: 40,
            difficulty: 'easy',
            mainImageUrl: 'https://example.com/image.jpg',
            status: 'active',
            interests: [{ id: 'interest-1', type: 'mountain', order: 0 }],
          },
          {
            id: 'trip-2',
            title: 'Trip 2',
            slug: 'trip-2',
            destination: 'Destino 2',
            dateLabel: '02/06/2026',
            eventDate: new Date('2026-06-02T10:00:00.000Z'),
            departureTime: '06:30',
            experienceType: 'tour',
            price: 299,
            capacity: 20,
            difficulty: 'moderate',
            mainImageUrl: null,
            status: 'active',
            interests: [{ id: 'interest-2', type: 'sunset', order: 0 }],
          },
        ]),
      },
      reservation: {
        count: jest.fn().mockResolvedValueOnce(12).mockResolvedValueOnce(20),
      },
    } as unknown as PrismaService;

    const repository = new TripsPrismaRepository(prisma);
    const trips = await repository.findPublished();

    expect(prisma.trip.findMany).toHaveBeenCalledWith({
      where: { status: 'active' },
      orderBy: [{ eventDate: 'asc' }, { createdAt: 'asc' }],
      select: expect.objectContaining({
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
        interests: expect.any(Object),
      }),
    });

    expect(prisma.reservation.count).toHaveBeenNthCalledWith(1, {
      where: {
        tripId: 'trip-1',
        status: { not: 'canceled' },
      },
    });
    expect(prisma.reservation.count).toHaveBeenNthCalledWith(2, {
      where: {
        tripId: 'trip-2',
        status: { not: 'canceled' },
      },
    });
    expect(trips).toEqual([
      expect.objectContaining({
        id: 'trip-1',
        availableSpots: 28,
      }),
      expect.objectContaining({
        id: 'trip-2',
        availableSpots: 0,
      }),
    ]);
  });
});

import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { ReservationsRepository } from '../domain/reservations.repository';
import { CreateReservationUseCase } from './create-reservation.use-case';

const input = {
  tripId: 'trip-1',
  fullName: 'User Test',
  email: 'user@test.com',
  whatsapp: '41999999999',
};

describe('CreateReservationUseCase', () => {
  const repository: ReservationsRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn().mockResolvedValue({ id: '1', ...input } as never),
    updateStatus: jest.fn(),
  };

  const prisma = {
    trip: { findUnique: jest.fn() },
    tripBoardingPoint: { findUnique: jest.fn() },
  } as unknown as PrismaService;

  it('creates reservation when trip exists', async () => {
    (prisma.trip.findUnique as jest.Mock).mockResolvedValue({ id: 'trip-1' });
    const useCase = new CreateReservationUseCase(repository, prisma);
    await expect(useCase.execute(input)).resolves.toMatchObject({ id: '1' });
  });

  it('throws when trip does not exist', async () => {
    (prisma.trip.findUnique as jest.Mock).mockResolvedValue(null);
    const useCase = new CreateReservationUseCase(repository, prisma);
    await expect(useCase.execute(input)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});

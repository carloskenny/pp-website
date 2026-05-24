import { NotFoundException } from '@nestjs/common';
import { FindReservationByIdUseCase } from './find-reservation-by-id.use-case';
import { ReservationsRepository } from '../domain/reservations.repository';

describe('FindReservationByIdUseCase', () => {
  it('returns reservation when found', async () => {
    const repository: ReservationsRepository = {
      findAll: jest.fn(),
      findById: jest.fn().mockResolvedValue({ id: '1' } as never),
      create: jest.fn(),
      updateStatus: jest.fn(),
    };
    const useCase = new FindReservationByIdUseCase(repository);
    await expect(useCase.execute('1')).resolves.toMatchObject({ id: '1' });
  });

  it('throws when not found', async () => {
    const repository: ReservationsRepository = {
      findAll: jest.fn(),
      findById: jest.fn().mockResolvedValue(null),
      create: jest.fn(),
      updateStatus: jest.fn(),
    };
    const useCase = new FindReservationByIdUseCase(repository);
    await expect(useCase.execute('1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});

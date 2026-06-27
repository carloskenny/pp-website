import { NotFoundException } from '@nestjs/common';
import { ReservationsRepository } from '../domain/reservations.repository';
import { UpdateReservationStatusUseCase } from './update-reservation-status.use-case';

describe('UpdateReservationStatusUseCase', () => {
  it('updates status when reservation exists', async () => {
    const repository: ReservationsRepository = {
      findAll: jest.fn(),
      findByTripId: jest.fn(),
      findById: jest.fn().mockResolvedValue({ id: '1' } as never),
      create: jest.fn(),
      updateStatus: jest
        .fn()
        .mockResolvedValue({ id: '1', status: 'confirmed' } as never),
    };
    const useCase = new UpdateReservationStatusUseCase(repository);
    await expect(useCase.execute('1', { status: 'confirmed' })).resolves.toMatchObject({
      id: '1',
    });
  });

  it('throws when reservation does not exist', async () => {
    const repository: ReservationsRepository = {
      findAll: jest.fn(),
      findByTripId: jest.fn(),
      findById: jest.fn().mockResolvedValue(null),
      create: jest.fn(),
      updateStatus: jest.fn(),
    };
    const useCase = new UpdateReservationStatusUseCase(repository);
    await expect(useCase.execute('1', { status: 'confirmed' })).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});

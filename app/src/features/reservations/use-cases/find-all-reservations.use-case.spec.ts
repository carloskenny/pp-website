import { FindAllReservationsUseCase } from './find-all-reservations.use-case';
import { ReservationsRepository } from '../domain/reservations.repository';

describe('FindAllReservationsUseCase', () => {
  it('returns all reservations', async () => {
    const repository: ReservationsRepository = {
      findAll: jest.fn().mockResolvedValue([{ id: '1' } as never]),
      findById: jest.fn(),
      create: jest.fn(),
      updateStatus: jest.fn(),
    };
    const useCase = new FindAllReservationsUseCase(repository);
    await expect(useCase.execute()).resolves.toHaveLength(1);
  });
});

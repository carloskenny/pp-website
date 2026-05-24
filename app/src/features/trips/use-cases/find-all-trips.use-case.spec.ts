import { FindAllTripsUseCase } from './find-all-trips.use-case';
import { TripsRepository } from '../domain/trips.repository';

describe('FindAllTripsUseCase', () => {
  it('returns all trips', async () => {
    const repository: TripsRepository = {
      findAll: jest.fn().mockResolvedValue([{ id: '1' } as never]),
      findById: jest.fn(),
      findBySlug: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const useCase = new FindAllTripsUseCase(repository);
    await expect(useCase.execute()).resolves.toHaveLength(1);
  });
});

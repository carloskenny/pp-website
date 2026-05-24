import { NotFoundException } from '@nestjs/common';
import { FindTripByIdUseCase } from './find-trip-by-id.use-case';
import { TripsRepository } from '../domain/trips.repository';

describe('FindTripByIdUseCase', () => {
  it('returns trip when found', async () => {
    const repository: TripsRepository = {
      findAll: jest.fn(),
      findById: jest.fn().mockResolvedValue({ id: '1' } as never),
      findBySlug: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    const useCase = new FindTripByIdUseCase(repository);
    await expect(useCase.execute('1')).resolves.toMatchObject({ id: '1' });
  });

  it('throws when not found', async () => {
    const repository: TripsRepository = {
      findAll: jest.fn(),
      findById: jest.fn().mockResolvedValue(null),
      findBySlug: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    const useCase = new FindTripByIdUseCase(repository);
    await expect(useCase.execute('1')).rejects.toBeInstanceOf(NotFoundException);
  });
});

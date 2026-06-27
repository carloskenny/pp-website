import { NotFoundException } from '@nestjs/common';
import { DeleteTripUseCase } from './delete-trip.use-case';
import { TripsRepository } from '../domain/trips.repository';

describe('DeleteTripUseCase', () => {
  it('deletes when trip exists', async () => {
    const repository: TripsRepository = {
      findAll: jest.fn(),
      findPublished: jest.fn(),
      findById: jest.fn().mockResolvedValue({ id: '1' } as never),
      findBySlug: jest.fn(),
      findPublishedBySlug: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn().mockResolvedValue({ id: '1' } as never),
    };
    const useCase = new DeleteTripUseCase(repository);
    await expect(useCase.execute('1')).resolves.toMatchObject({ id: '1' });
  });

  it('throws when trip does not exist', async () => {
    const repository: TripsRepository = {
      findAll: jest.fn(),
      findPublished: jest.fn(),
      findById: jest.fn().mockResolvedValue(null),
      findBySlug: jest.fn(),
      findPublishedBySlug: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    const useCase = new DeleteTripUseCase(repository);
    await expect(useCase.execute('1')).rejects.toBeInstanceOf(NotFoundException);
  });
});

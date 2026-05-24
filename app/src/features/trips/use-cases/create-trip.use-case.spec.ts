import { ConflictException } from '@nestjs/common';
import { CreateTripUseCase } from './create-trip.use-case';
import { TripsRepository } from '../domain/trips.repository';

const input = {
  slug: 'trip-1',
  title: 'Trip',
  destination: 'PR',
  dateLabel: 'Hoje',
};

describe('CreateTripUseCase', () => {
  it('creates when slug is unique', async () => {
    const repository: TripsRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findBySlug: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({ id: '1', ...input } as never),
      update: jest.fn(),
      delete: jest.fn(),
    };
    const useCase = new CreateTripUseCase(repository);
    await expect(useCase.execute(input)).resolves.toMatchObject({ id: '1' });
  });

  it('throws when slug already exists', async () => {
    const repository: TripsRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findBySlug: jest.fn().mockResolvedValue({ id: '1' } as never),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    const useCase = new CreateTripUseCase(repository);
    await expect(useCase.execute(input)).rejects.toBeInstanceOf(ConflictException);
  });
});

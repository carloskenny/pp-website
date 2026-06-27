import { NotFoundException } from '@nestjs/common';
import { FindTripBySlugUseCase } from './find-trip-by-slug.use-case';
import { TripsRepository } from '../domain/trips.repository';

describe('FindTripBySlugUseCase', () => {
  it('returns trip when found', async () => {
    const repository: TripsRepository = {
      findAll: jest.fn(),
      findPublished: jest.fn(),
      findById: jest.fn(),
      findBySlug: jest.fn().mockResolvedValue({ slug: 'x' } as never),
      findPublishedBySlug: jest.fn().mockResolvedValue({ slug: 'x' } as never),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    const useCase = new FindTripBySlugUseCase(repository);
    await expect(useCase.execute('x')).resolves.toMatchObject({ slug: 'x' });
  });

  it('throws when not found', async () => {
    const repository: TripsRepository = {
      findAll: jest.fn(),
      findPublished: jest.fn(),
      findById: jest.fn(),
      findBySlug: jest.fn().mockResolvedValue(null),
      findPublishedBySlug: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    const useCase = new FindTripBySlugUseCase(repository);
    await expect(useCase.execute('x')).rejects.toBeInstanceOf(NotFoundException);
  });
});

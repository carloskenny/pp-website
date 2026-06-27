import { NotFoundException } from '@nestjs/common';
import { UpdateTripUseCase } from './update-trip.use-case';
import { TripsRepository } from '../domain/trips.repository';

describe('UpdateTripUseCase', () => {
  it('updates when trip exists', async () => {
    const repository: TripsRepository = {
      findAll: jest.fn(),
      findPublished: jest.fn(),
      findById: jest.fn().mockResolvedValue({ id: '1' } as never),
      findBySlug: jest.fn(),
      findPublishedBySlug: jest.fn(),
      create: jest.fn(),
      update: jest.fn().mockResolvedValue({ id: '1', title: 'Novo' } as never),
      delete: jest.fn(),
    };
    const useCase = new UpdateTripUseCase(repository);
    await expect(useCase.execute('1', { title: 'Novo' })).resolves.toMatchObject({
      id: '1',
    });
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
    const useCase = new UpdateTripUseCase(repository);
    await expect(useCase.execute('1', { title: 'Novo' })).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});

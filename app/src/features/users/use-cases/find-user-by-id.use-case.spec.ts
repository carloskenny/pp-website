import { NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../domain/users.repository';
import { FindUserByIdUseCase } from './find-user-by-id.use-case';

describe('FindUserByIdUseCase', () => {
  it('returns user when found', async () => {
    const repository: UsersRepository = {
      findAll: jest.fn(),
      findById: jest.fn().mockResolvedValue({ id: '1' } as never),
      findByEmail: jest.fn(),
      create: jest.fn(),
    };
    const useCase = new FindUserByIdUseCase(repository);
    await expect(useCase.execute('1')).resolves.toMatchObject({ id: '1' });
  });

  it('throws when user not found', async () => {
    const repository: UsersRepository = {
      findAll: jest.fn(),
      findById: jest.fn().mockResolvedValue(null),
      findByEmail: jest.fn(),
      create: jest.fn(),
    };
    const useCase = new FindUserByIdUseCase(repository);
    await expect(useCase.execute('1')).rejects.toBeInstanceOf(NotFoundException);
  });
});

import { FindAllUsersUseCase } from './find-all-users.use-case';
import { UsersRepository } from '../domain/users.repository';

describe('FindAllUsersUseCase', () => {
  it('returns all users', async () => {
    const repository: UsersRepository = {
      findAll: jest.fn().mockResolvedValue([{ id: '1' } as never]),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updatePassword: jest.fn(),
    };
    const useCase = new FindAllUsersUseCase(repository);
    await expect(useCase.execute()).resolves.toHaveLength(1);
  });
});

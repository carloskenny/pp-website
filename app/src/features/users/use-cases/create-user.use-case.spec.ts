import { ConflictException } from '@nestjs/common';
import { UsersRepository } from '../domain/users.repository';
import { CreateUserUseCase } from './create-user.use-case';

const payload = {
  name: 'Test User',
  email: 'test@pp.com',
  password: '12345678',
  role: 'admin_operacao' as const,
};

describe('CreateUserUseCase', () => {
  it('creates user when e-mail is unique', async () => {
    const repository: UsersRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockImplementation(async (input) => ({
        id: '1',
        ...input,
      })),
      update: jest.fn(),
      updatePassword: jest.fn(),
    };
    const useCase = new CreateUserUseCase(repository);
    await expect(useCase.execute(payload)).resolves.toMatchObject({ id: '1' });
  });

  it('throws when e-mail already exists', async () => {
    const repository: UsersRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn().mockResolvedValue({ id: '1' } as never),
      create: jest.fn(),
      update: jest.fn(),
      updatePassword: jest.fn(),
    };
    const useCase = new CreateUserUseCase(repository);
    await expect(useCase.execute(payload)).rejects.toBeInstanceOf(
      ConflictException,
    );
  });
});

import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../../users/domain/users.repository';
import { LoginUseCase } from './login.use-case';

describe('LoginUseCase', () => {
  const passwordHash = bcrypt.hashSync('12345678', 10);

  it('returns access token with valid credentials', async () => {
    const usersRepository: UsersRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn().mockResolvedValue({
        id: '1',
        name: 'User',
        email: 'user@pp.com',
        role: 'admin_operacao',
        status: 'ACTIVE',
        passwordHash,
      } as never),
      create: jest.fn(),
      update: jest.fn(),
      updatePassword: jest.fn(),
    };
    const jwtService = {
      signAsync: jest.fn().mockResolvedValue('token'),
    } as unknown as JwtService;
    const configService = {
      getOrThrow: jest.fn((key: string) => {
        if (key === 'JWT_SECRET') return 'secret';
        if (key === 'JWT_EXPIRES_IN') return '15m';
        if (key === 'JWT_REFRESH_EXPIRES_IN') return '7d';
        throw new Error(key);
      }),
      get: jest.fn(),
    } as unknown as ConfigService;

    const useCase = new LoginUseCase(usersRepository, jwtService, configService);
    await expect(
      useCase.execute({ email: 'user@pp.com', password: '12345678' }),
    ).resolves.toMatchObject({ accessToken: 'token' });
  });

  it('throws with invalid credentials', async () => {
    const usersRepository: UsersRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn().mockResolvedValue(null),
      create: jest.fn(),
      update: jest.fn(),
      updatePassword: jest.fn(),
    };
    const jwtService = {
      signAsync: jest.fn(),
    } as unknown as JwtService;
    const configService = {
      getOrThrow: jest.fn(),
      get: jest.fn(),
    } as unknown as ConfigService;

    const useCase = new LoginUseCase(usersRepository, jwtService, configService);
    await expect(
      useCase.execute({ email: 'user@pp.com', password: '12345678' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});

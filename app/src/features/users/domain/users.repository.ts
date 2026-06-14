import { User, UserStatus } from '@prisma/client';
import { PublicUser } from './user.presenter';

export const USERS_REPOSITORY = Symbol('USERS_REPOSITORY');

export type CreateUserInput = {
  name: string;
  email: string;
  passwordHash: string;
  role?: 'super_admin' | 'admin_operacao' | 'partner' | 'guia' | 'atendimento';
  status?: UserStatus;
  avatarUrl?: string | null;
  phone?: string | null;
  preferences?: unknown;
};

export type UpdateUserInput = Partial<{
  name: string;
  email: string;
  role: 'super_admin' | 'admin_operacao' | 'partner' | 'guia' | 'atendimento';
  status: UserStatus;
  avatarUrl: string | null;
  phone: string | null;
  preferences: unknown;
  lastLoginAt: Date | null;
  refreshTokenHash: string | null;
}>;

export type UpdateUserPasswordInput = {
  passwordHash: string;
};

export type UsersRepository = {
  findAll(): Promise<PublicUser[]>;
  findById(id: string): Promise<PublicUser | null>;
  findByEmail(email: string): Promise<User | null>;
  create(input: CreateUserInput): Promise<User>;
  update(id: string, input: UpdateUserInput): Promise<User>;
  updatePassword(id: string, input: UpdateUserPasswordInput): Promise<User>;
};

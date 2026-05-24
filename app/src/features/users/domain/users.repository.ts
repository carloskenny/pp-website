import { User } from '@prisma/client';

export const USERS_REPOSITORY = Symbol('USERS_REPOSITORY');

export type CreateUserInput = {
  name: string;
  email: string;
  passwordHash: string;
  role?: 'super_admin' | 'admin_operacao' | 'guia' | 'atendimento';
};

export type UsersRepository = {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(input: CreateUserInput): Promise<User>;
};

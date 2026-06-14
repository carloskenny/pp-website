import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import {
  CreateUserInput,
  UpdateUserInput,
  UpdateUserPasswordInput,
  UsersRepository,
} from '../domain/users.repository';
import { toPublicUser } from '../domain/user.presenter';

function normalizeJsonValue(value: unknown) {
  if (value === null || value === undefined) return undefined;
  return value as Prisma.InputJsonValue;
}

@Injectable()
export class UsersPrismaRepository implements UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    }).then((users) => users.map(toPublicUser));
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    }).then((user) => (user ? toPublicUser(user) : null));
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  create(input: CreateUserInput) {
    const { preferences, ...data } = input;
    return this.prisma.user.create({
      data: {
        ...data,
        preferences: normalizeJsonValue(preferences),
      },
    });
  }

  update(id: string, input: UpdateUserInput) {
    const { preferences, ...data } = input;
    return this.prisma.user.update({
      where: { id },
      data: {
        ...data,
        ...(preferences !== undefined ? { preferences: normalizeJsonValue(preferences) } : {}),
      },
    });
  }

  updatePassword(id: string, input: UpdateUserPasswordInput) {
    return this.prisma.user.update({
      where: { id },
      data: input,
    });
  }
}

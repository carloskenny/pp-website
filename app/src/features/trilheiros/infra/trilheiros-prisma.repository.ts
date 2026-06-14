import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import {
  TrilheirosRepository,
  UpsertTrilheiroInput,
} from '../domain/trilheiros.repository';

function normalizeJsonValue(value: unknown) {
  if (value === null || value === undefined) return undefined;
  return value as Prisma.InputJsonValue;
}

@Injectable()
export class TrilheirosPrismaRepository implements TrilheirosRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.trilheiro.findUnique({ where: { email } });
  }

  findById(id: string) {
    return this.prisma.trilheiro.findUnique({
      where: { id },
      include: {
        reservations: {
          select: {
            id: true,
            status: true,
            tripId: true,
          },
        },
      },
    });
  }

  upsertByEmail(input: UpsertTrilheiroInput) {
    const { preferences, ...data } = input;

    return this.prisma.trilheiro.upsert({
      where: { email: input.email },
      create: {
        ...data,
        preferences: normalizeJsonValue(preferences),
      },
      update: {
        ...data,
        ...(preferences !== undefined
          ? { preferences: normalizeJsonValue(preferences) }
          : {}),
      },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import {
  CreateUserInput,
  UsersRepository,
} from '../domain/users.repository';

@Injectable()
export class UsersPrismaRepository implements UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  create(input: CreateUserInput) {
    return this.prisma.user.create({ data: input });
  }
}

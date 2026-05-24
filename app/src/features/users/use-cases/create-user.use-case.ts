import { ConflictException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import {
  CreateUserInput,
  USERS_REPOSITORY,
  UsersRepository,
} from '../domain/users.repository';
import { CreateUserPayload } from '../schemas/users.schema';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly usersRepository: UsersRepository,
  ) {}

  async execute(payload: CreateUserPayload) {
    const existing = await this.usersRepository.findByEmail(payload.email);
    if (existing) throw new ConflictException('E-mail already registered');

    const passwordHash = await bcrypt.hash(payload.password, 10);
    const data: CreateUserInput = {
      name: payload.name,
      email: payload.email,
      role: payload.role,
      passwordHash,
    };

    return this.usersRepository.create(data);
  }
}

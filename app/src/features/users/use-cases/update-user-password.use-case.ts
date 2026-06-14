import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import {
  USERS_REPOSITORY,
  UsersRepository,
} from '../domain/users.repository';
import { updateUserPasswordSchema } from '../schemas/users.schema';
import { toPublicUser } from '../domain/user.presenter';

@Injectable()
export class UpdateUserPasswordUseCase {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly usersRepository: UsersRepository,
  ) {}

  async execute(id: string, input: unknown) {
    const current = await this.usersRepository.findById(id);
    if (!current) throw new NotFoundException('User not found');

    const parsed = updateUserPasswordSchema.parse(input);
    const passwordHash = await bcrypt.hash(parsed.password, 10);
    const user = await this.usersRepository.updatePassword(id, { passwordHash });
    return toPublicUser(user);
  }
}

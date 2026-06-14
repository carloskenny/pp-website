import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  USERS_REPOSITORY,
  UsersRepository,
  UpdateUserInput,
} from '../domain/users.repository';
import { updateUserSchema } from '../schemas/users.schema';
import { toPublicUser } from '../domain/user.presenter';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly usersRepository: UsersRepository,
  ) {}

  async execute(id: string, input: UpdateUserInput) {
    const current = await this.usersRepository.findById(id);
    if (!current) throw new NotFoundException('User not found');

    if (input.email && input.email !== current.email) {
      const existing = await this.usersRepository.findByEmail(input.email);
      if (existing) throw new ConflictException('E-mail already registered');
    }

    const user = await this.usersRepository.update(id, updateUserSchema.parse(input));
    return toPublicUser(user);
  }
}

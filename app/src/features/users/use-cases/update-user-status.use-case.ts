import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  USERS_REPOSITORY,
  UsersRepository,
} from '../domain/users.repository';
import { updateUserStatusSchema } from '../schemas/users.schema';
import { toPublicUser } from '../domain/user.presenter';

@Injectable()
export class UpdateUserStatusUseCase {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly usersRepository: UsersRepository,
  ) {}

  async execute(id: string, input: unknown) {
    const current = await this.usersRepository.findById(id);
    if (!current) throw new NotFoundException('User not found');

    const user = await this.usersRepository.update(id, updateUserStatusSchema.parse(input));
    return toPublicUser(user);
  }
}

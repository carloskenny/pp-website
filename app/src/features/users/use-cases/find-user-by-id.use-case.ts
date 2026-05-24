import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USERS_REPOSITORY, UsersRepository } from '../domain/users.repository';

@Injectable()
export class FindUserByIdUseCase {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly usersRepository: UsersRepository,
  ) {}

  async execute(id: string) {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}

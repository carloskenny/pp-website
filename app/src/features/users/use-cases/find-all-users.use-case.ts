import { Inject, Injectable } from '@nestjs/common';
import { USERS_REPOSITORY, UsersRepository } from '../domain/users.repository';

@Injectable()
export class FindAllUsersUseCase {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly usersRepository: UsersRepository,
  ) {}

  execute() {
    return this.usersRepository.findAll();
  }
}

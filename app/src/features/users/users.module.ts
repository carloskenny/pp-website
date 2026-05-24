import { Module } from '@nestjs/common';
import { USERS_REPOSITORY } from './domain/users.repository';
import { UsersController } from './http/users.controller';
import { UsersPrismaRepository } from './infra/users-prisma.repository';
import { CreateUserUseCase } from './use-cases/create-user.use-case';
import { FindAllUsersUseCase } from './use-cases/find-all-users.use-case';
import { FindUserByIdUseCase } from './use-cases/find-user-by-id.use-case';

@Module({
  controllers: [UsersController],
  providers: [
    { provide: USERS_REPOSITORY, useClass: UsersPrismaRepository },
    FindAllUsersUseCase,
    FindUserByIdUseCase,
    CreateUserUseCase,
  ],
  exports: [USERS_REPOSITORY],
})
export class UsersModule {}

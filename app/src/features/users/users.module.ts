import { Module } from '@nestjs/common';
import { USERS_REPOSITORY } from './domain/users.repository';
import { UsersController } from './http/users.controller';
import { UsersPrismaRepository } from './infra/users-prisma.repository';
import { CreateUserUseCase } from './use-cases/create-user.use-case';
import { FindAllUsersUseCase } from './use-cases/find-all-users.use-case';
import { FindUserByIdUseCase } from './use-cases/find-user-by-id.use-case';
import { UpdateUserUseCase } from './use-cases/update-user.use-case';
import { UpdateUserStatusUseCase } from './use-cases/update-user-status.use-case';
import { UpdateUserPasswordUseCase } from './use-cases/update-user-password.use-case';
import { UpdateCurrentUserUseCase } from './use-cases/update-current-user.use-case';
import { SecurityModule } from '../../shared/security/security.module';

@Module({
  imports: [SecurityModule],
  controllers: [UsersController],
  providers: [
    { provide: USERS_REPOSITORY, useClass: UsersPrismaRepository },
    FindAllUsersUseCase,
    FindUserByIdUseCase,
    CreateUserUseCase,
    UpdateUserUseCase,
    UpdateUserStatusUseCase,
    UpdateUserPasswordUseCase,
    UpdateCurrentUserUseCase,
  ],
  exports: [
    USERS_REPOSITORY,
    UpdateCurrentUserUseCase,
    UpdateUserPasswordUseCase,
    UpdateUserUseCase,
    UpdateUserStatusUseCase,
    CreateUserUseCase,
    FindAllUsersUseCase,
    FindUserByIdUseCase,
  ],
})
export class UsersModule {}

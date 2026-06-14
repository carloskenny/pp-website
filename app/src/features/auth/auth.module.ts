import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthController } from './http/auth.controller';
import { LoginUseCase } from './use-cases/login.use-case';
import { GetCurrentUserUseCase } from './use-cases/get-current-user.use-case';
import { RefreshSessionUseCase } from './use-cases/refresh-session.use-case';
import { LogoutSessionUseCase } from './use-cases/logout-session.use-case';
import { SecurityModule } from '../../shared/security/security.module';

@Module({
  imports: [SecurityModule, UsersModule],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    GetCurrentUserUseCase,
    RefreshSessionUseCase,
    LogoutSessionUseCase,
  ],
})
export class AuthModule {}

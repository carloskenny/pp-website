import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { AuthController } from './http/auth.controller';
import { LoginUseCase } from './use-cases/login.use-case';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.getOrThrow<string>('JWT_EXPIRES_IN') as never,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [LoginUseCase],
})
export class AuthModule {}

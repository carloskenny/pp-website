import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { USERS_REPOSITORY, UsersRepository } from '../../users/domain/users.repository';
import { LoginPayload } from '../schemas/auth.schema';
import { toPublicUser } from '../../users/domain/user.presenter';
import { AuthUserSession } from '../auth-session';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(payload: LoginPayload) {
    const user = await this.usersRepository.findByEmail(payload.email);
    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(
      payload.password,
      user.passwordHash,
    );
    if (!isValidPassword) throw new UnauthorizedException('Invalid credentials');

    const accessPayload: AuthUserSession = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') ??
      this.configService.getOrThrow<string>('JWT_SECRET');
    const accessToken = await this.jwtService.signAsync(accessPayload, {
      secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      expiresIn: this.configService.getOrThrow<string>('JWT_EXPIRES_IN') as never,
    });
    const refreshToken = await this.jwtService.signAsync(accessPayload, {
      secret: refreshSecret,
      expiresIn: this.configService.getOrThrow<string>('JWT_REFRESH_EXPIRES_IN') as never,
    });

    const passwordHash = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(user.id, {
      lastLoginAt: new Date(),
      refreshTokenHash: passwordHash,
    });

    return {
      accessToken,
      refreshToken,
      user: toPublicUser({
        ...user,
        lastLoginAt: new Date(),
        refreshTokenHash: passwordHash,
        status: user.status,
      }),
    };
  }
}

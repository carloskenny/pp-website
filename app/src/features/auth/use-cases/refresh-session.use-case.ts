import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import {
  AuthUserSession,
  parseCookie,
  REFRESH_COOKIE_NAME,
} from '../auth-session';
import { toPublicUser } from '../../users/domain/user.presenter';

@Injectable()
export class RefreshSessionUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(cookieHeader: string | undefined) {
    const refreshToken = parseCookie(cookieHeader, REFRESH_COOKIE_NAME);
    if (!refreshToken) throw new UnauthorizedException('Missing refresh token');

    const refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') ??
      this.configService.getOrThrow<string>('JWT_SECRET');

    let payload: AuthUserSession;
    try {
      payload = await this.jwtService.verifyAsync<AuthUserSession>(refreshToken, {
        secret: refreshSecret,
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || user.status !== 'ACTIVE' || !user.refreshTokenHash) {
      throw new ForbiddenException('Session revoked');
    }

    const isValid = await bcrypt.compare(refreshToken, user.refreshTokenHash);

    if (!isValid) {
      throw new ForbiddenException('Session revoked');
    }

    const accessToken = await this.jwtService.signAsync(
      { sub: user.id, email: user.email, role: user.role },
      {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
        expiresIn: this.configService.getOrThrow<string>('JWT_EXPIRES_IN') as never,
      },
    );

    return {
      accessToken,
      refreshToken,
      user: toPublicUser(user),
    };
  }
}

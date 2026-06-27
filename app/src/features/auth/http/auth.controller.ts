import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { Request, Response } from 'express';
import { ZodError } from 'zod';
import { fromZodError } from '../../../shared/http/zod-validation.exception';
import { UnauthorizedException } from '@nestjs/common';
import {
  ACCESS_COOKIE_NAME,
  buildAccessCookieOptions,
  buildRefreshCookieOptions,
  buildSessionClearCookieOptions,
  REFRESH_COOKIE_NAME,
  parseCookie,
  parseDurationToMs,
} from '../auth-session';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { loginSchema } from '../schemas/auth.schema';
import {
  updateCurrentUserSchema,
  updateUserPasswordSchema,
} from '../../users/schemas/users.schema';
import { LoginUseCase } from '../use-cases/login.use-case';
import { GetCurrentUserUseCase } from '../use-cases/get-current-user.use-case';
import { RefreshSessionUseCase } from '../use-cases/refresh-session.use-case';
import { LogoutSessionUseCase } from '../use-cases/logout-session.use-case';
import { UpdateCurrentUserUseCase } from '../../users/use-cases/update-current-user.use-case';
import { UpdateUserPasswordUseCase } from '../../users/use-cases/update-user-password.use-case';

type AuthenticatedRequest = Request & {
  user?: {
    sub?: string;
    role?: string;
  };
};

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
    private readonly refreshSessionUseCase: RefreshSessionUseCase,
    private readonly logoutSessionUseCase: LogoutSessionUseCase,
    private readonly updateCurrentUserUseCase: UpdateCurrentUserUseCase,
    private readonly updateUserPasswordUseCase: UpdateUserPasswordUseCase,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  async login(@Body() body: unknown, @Res({ passthrough: true }) response: Response) {
    try {
      const session = await this.loginUseCase.execute(loginSchema.parse(body));
      const accessCookieMaxAge = parseDurationToMs(
        this.configService.getOrThrow<string>('JWT_EXPIRES_IN'),
      );
      const refreshCookieMaxAge = parseDurationToMs(
        this.configService.getOrThrow<string>('JWT_REFRESH_EXPIRES_IN'),
      );
      response.cookie(
        ACCESS_COOKIE_NAME,
        session.accessToken,
        buildAccessCookieOptions(accessCookieMaxAge),
      );
      response.cookie(
        REFRESH_COOKIE_NAME,
        session.refreshToken,
        buildRefreshCookieOptions(refreshCookieMaxAge),
      );
      return {
        accessToken: session.accessToken,
        user: session.user,
      };
    } catch (error) {
      if (error instanceof ZodError) throw fromZodError(error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() request: AuthenticatedRequest) {
    const user = request.user as { sub?: string } | undefined;
    if (!user?.sub) throw new UnauthorizedException();
    return this.getCurrentUserUseCase.execute(user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me')
  async updateMe(@Req() request: AuthenticatedRequest, @Body() body: unknown) {
    const user = request.user as { sub?: string } | undefined;
    if (!user?.sub) throw new UnauthorizedException();
    try {
      return this.updateCurrentUserUseCase.execute(
        user.sub,
        updateCurrentUserSchema.parse(body),
      );
    } catch (error) {
      if (error instanceof ZodError) throw fromZodError(error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/password')
  async updateMyPassword(@Req() request: AuthenticatedRequest, @Body() body: unknown) {
    const user = request.user as { sub?: string } | undefined;
    if (!user?.sub) throw new UnauthorizedException();
    try {
      return this.updateUserPasswordUseCase.execute(
        user.sub,
        updateUserPasswordSchema.parse(body),
      );
    } catch (error) {
      if (error instanceof ZodError) throw fromZodError(error);
      throw error;
    }
  }

  @Post('refresh')
  async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const session = await this.refreshSessionUseCase.execute(request.headers.cookie);
    const accessCookieMaxAge = parseDurationToMs(
      this.configService.getOrThrow<string>('JWT_EXPIRES_IN'),
    );
    const refreshCookieMaxAge = parseDurationToMs(
      this.configService.getOrThrow<string>('JWT_REFRESH_EXPIRES_IN'),
    );
    response.cookie(
      ACCESS_COOKIE_NAME,
      session.accessToken,
      buildAccessCookieOptions(accessCookieMaxAge),
    );
    response.cookie(
      REFRESH_COOKIE_NAME,
      session.refreshToken,
      buildRefreshCookieOptions(refreshCookieMaxAge),
    );
    return {
      accessToken: session.accessToken,
      user: session.user,
    };
  }

  @Post('logout')
  async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const authHeader = request.headers.authorization as string | undefined;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
    if (token) {
      try {
        const payload = await this.jwtService.verifyAsync<{ sub: string }>(token, {
          secret: this.configService.getOrThrow<string>('JWT_SECRET'),
        });
        await this.logoutSessionUseCase.execute(payload.sub);
      } catch {
        try {
          const refreshToken = parseCookie(request.headers.cookie, REFRESH_COOKIE_NAME);
          if (!refreshToken) throw new Error('Missing refresh token');
          const refreshSecret =
            this.configService.get<string>('JWT_REFRESH_SECRET') ??
            this.configService.getOrThrow<string>('JWT_SECRET');
          const payload = await this.jwtService.verifyAsync<{ sub: string }>(
            refreshToken,
            {
              secret: refreshSecret,
            },
          );
          await this.logoutSessionUseCase.execute(payload.sub);
        } catch {
          // ignore invalid token on logout
        }
      }
    } else {
      try {
        const refreshToken = parseCookie(request.headers.cookie, REFRESH_COOKIE_NAME);
        if (!refreshToken) throw new Error('Missing refresh token');
        const refreshSecret =
          this.configService.get<string>('JWT_REFRESH_SECRET') ??
          this.configService.getOrThrow<string>('JWT_SECRET');
        const payload = await this.jwtService.verifyAsync<{ sub: string }>(refreshToken, {
          secret: refreshSecret,
        });
        await this.logoutSessionUseCase.execute(payload.sub);
      } catch {
        // ignore invalid token on logout
      }
    }

    response.clearCookie(ACCESS_COOKIE_NAME, buildSessionClearCookieOptions());
    response.clearCookie(REFRESH_COOKIE_NAME, buildSessionClearCookieOptions());
    return { success: true };
  }
}

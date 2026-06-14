import type { CookieOptions } from 'express';
import type { User } from '@prisma/client';

export const REFRESH_COOKIE_NAME = 'pp_refresh_token';

export type AuthUserSession = {
  sub: string;
  email: string;
  role: User['role'];
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export function parseCookie(header: string | undefined, name: string): string | null {
  if (!header) return null;

  const cookies = header.split(';').map((part) => part.trim());
  const pair = cookies.find((item) => item.startsWith(`${name}=`));
  if (!pair) return null;

  return decodeURIComponent(pair.slice(name.length + 1));
}

export function buildRefreshCookieOptions(maxAgeMs: number): CookieOptions {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: maxAgeMs,
  };
}

export function createFallbackRefreshSecret(baseSecret: string) {
  return baseSecret;
}

export function parseDurationToMs(value: string): number {
  const match = value.match(/^(\d+)([smhd])$/);
  if (!match) return 7 * 24 * 60 * 60 * 1000;

  const amount = Number(match[1]);
  const unit = match[2];

  switch (unit) {
    case 's':
      return amount * 1000;
    case 'm':
      return amount * 60 * 1000;
    case 'h':
      return amount * 60 * 60 * 1000;
    case 'd':
      return amount * 24 * 60 * 60 * 1000;
    default:
      return 7 * 24 * 60 * 60 * 1000;
  }
}

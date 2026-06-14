import { User, UserStatus } from '@prisma/client';

export type UserPreferences = {
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
  defaultDashboardView: 'events' | 'reservations' | 'users';
};

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  role: User['role'];
  status: UserStatus;
  avatarUrl: string | null;
  phone: string | null;
  preferences: UserPreferences;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  theme: 'system',
  sidebarCollapsed: false,
  defaultDashboardView: 'events',
};

export function normalizeUserPreferences(value: unknown): UserPreferences {
  if (!value || typeof value !== 'object') {
    return DEFAULT_USER_PREFERENCES;
  }

  const candidate = value as Partial<UserPreferences>;
  return {
    theme:
      candidate.theme === 'light' || candidate.theme === 'dark' || candidate.theme === 'system'
        ? candidate.theme
        : DEFAULT_USER_PREFERENCES.theme,
    sidebarCollapsed:
      typeof candidate.sidebarCollapsed === 'boolean'
        ? candidate.sidebarCollapsed
        : DEFAULT_USER_PREFERENCES.sidebarCollapsed,
    defaultDashboardView:
      candidate.defaultDashboardView === 'events' ||
      candidate.defaultDashboardView === 'reservations' ||
      candidate.defaultDashboardView === 'users'
        ? candidate.defaultDashboardView
        : DEFAULT_USER_PREFERENCES.defaultDashboardView,
  };
}

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    avatarUrl: user.avatarUrl,
    phone: user.phone,
    preferences: normalizeUserPreferences(user.preferences),
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

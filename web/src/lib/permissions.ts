import type { AppUser } from './api';

export type Permission =
  | 'admin:access'
  | 'users:manage'
  | 'events:manage'
  | 'reservations:manage'
  | 'profile:manage'
  | 'settings:manage';

export function hasRole(user: AppUser | null, roles: AppUser['role'][]) {
  return Boolean(user && roles.includes(user.role));
}

export function canAccess(user: AppUser | null, permission: Permission) {
  if (!user) return false;

  switch (permission) {
    case 'admin:access':
    case 'events:manage':
    case 'reservations:manage':
      return user.role === 'super_admin' || user.role === 'admin_operacao';
    case 'users:manage':
      return user.role === 'super_admin';
    case 'profile:manage':
      return true;
    case 'settings:manage':
      return user.role === 'super_admin' || user.role === 'admin_operacao';
    default:
      return false;
  }
}

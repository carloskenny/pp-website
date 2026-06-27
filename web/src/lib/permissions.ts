import type { AppUser } from './api';

export type Permission =
  | 'admin:access'
  | 'users:manage'
  | 'events:manage'
  | 'reservations:manage'
  | 'profile:manage'
  | 'settings:manage';

const ADMIN_PANEL_ROLES: AppUser['role'][] = [
  'super_admin',
  'admin_operacao',
  'guia',
  'atendimento',
];

export function hasRole(user: AppUser | null, roles: AppUser['role'][]) {
  return Boolean(user && roles.includes(user.role));
}

export function canAccess(user: AppUser | null, permission: Permission) {
  if (!user) return false;

  switch (permission) {
    case 'admin:access':
      return ADMIN_PANEL_ROLES.includes(user.role);
    case 'events:manage':
      return user.role === 'super_admin' || user.role === 'admin_operacao';
    case 'reservations:manage':
      return (
        user.role === 'super_admin' ||
        user.role === 'admin_operacao' ||
        user.role === 'guia' ||
        user.role === 'atendimento'
      );
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

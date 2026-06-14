import type { ReservationPayload } from '@/types/reservation';
import type { Trip } from '@/types/trip';

function getApiBaseUrl() {
  const isServer = typeof window === 'undefined';
  const raw = isServer
    ? process.env.API_URL || process.env.NEXT_PUBLIC_API_URL
    : process.env.NEXT_PUBLIC_API_URL;

  return (raw || 'http://localhost:3001').replace(/\/$/, '');
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
export type UserRole =
  | 'super_admin'
  | 'admin_operacao'
  | 'partner'
  | 'guia'
  | 'atendimento';
export type UserPreferences = {
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
  defaultDashboardView: 'events' | 'reservations' | 'users';
};

export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl: string | null;
  phone: string | null;
  preferences: UserPreferences;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AuthSession = {
  accessToken: string;
  user: AppUser;
};

function getAuthHeaders() {
  if (typeof window === 'undefined') return {};

  const token = localStorage.getItem('pp_access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parseError(response: Response, fallbackMessage: string) {
  const body = await response.json().catch(() => ({}));
  const message = body?.message ?? fallbackMessage;
  throw new ApiError(message, response.status);
}

function authRequestInit(options: RequestInit = {}): RequestInit {
  return {
    credentials: 'include',
    ...options,
    headers: {
      ...(options.headers ?? {}),
      ...getAuthHeaders(),
    },
  };
}

type ApiTrip = Omit<Trip, 'price'> & { price?: string | number | null };

function toTrip(value: ApiTrip): Trip {
  const price =
    typeof value.price === 'string' ? Number(value.price) : (value.price ?? undefined);

  return {
    ...value,
    price,
  };
}

export async function getTripBySlug(slug: string): Promise<Trip | null> {
  const response = await fetch(`${getApiBaseUrl()}/api/trips/slug/${slug}`, {
    next: { revalidate: 0 },
  });

  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Failed to load trip');

  const data = (await response.json()) as ApiTrip;
  return toTrip(data);
}

export async function createReservation(payload: ReservationPayload) {
  const response = await fetch(`${getApiBaseUrl()}/api/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.message ?? 'Failed to create reservation');
  }

  return response.json();
}

export async function getTrips(): Promise<Trip[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/api/trips`,
    authRequestInit({ cache: 'no-store' }),
  );
  if (!response.ok) await parseError(response, 'Failed to load trips');
  const data = (await response.json()) as ApiTrip[];
  return data.map(toTrip);
}

export async function createTrip(payload: Partial<Trip>) {
  const response = await fetch(`${getApiBaseUrl()}/api/trips`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  if (!response.ok) await parseError(response, 'Failed to create trip');
  return response.json();
}

export async function updateTrip(id: string, payload: Partial<Trip>) {
  const response = await fetch(`${getApiBaseUrl()}/api/trips/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  if (!response.ok) await parseError(response, 'Failed to update trip');
  return response.json();
}

export async function deleteTrip(id: string) {
  const response = await fetch(`${getApiBaseUrl()}/api/trips/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: getAuthHeaders(),
  });
  if (!response.ok) await parseError(response, 'Failed to delete trip');
}

export type ReservationItem = {
  id: string;
  tripId: string;
  fullName: string;
  email: string;
  whatsapp: string;
  status: 'pending' | 'payment_pending' | 'confirmed' | 'canceled';
  createdAt: string;
  trip?: {
    id: string;
    slug: string;
    title: string;
    destination: string;
    dateLabel: string;
  };
  boardingPoint?: {
    id: string;
    label: string;
  } | null;
};

export async function getReservations(): Promise<ReservationItem[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/api/reservations`,
    authRequestInit({ cache: 'no-store' }),
  );
  if (!response.ok) await parseError(response, 'Failed to load reservations');
  return response.json();
}

export async function updateReservationStatus(
  id: string,
  status: ReservationItem['status'],
) {
  const response = await fetch(
    `${getApiBaseUrl()}/api/reservations/${id}/status`,
    authRequestInit({
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }),
  );
  if (!response.ok) {
    await parseError(response, 'Failed to update reservation status');
  }
  return response.json();
}

export type LoginPayload = {
  email: string;
  password: string;
};

export type CreateUserPayload = {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  status?: UserStatus;
  avatarUrl?: string | null;
  phone?: string | null;
  preferences?: Partial<UserPreferences>;
};

export async function login(payload: LoginPayload) {
  const response = await fetch(`${getApiBaseUrl()}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Credenciais inválidas');
  return response.json();
}

export async function me() {
  const response = await fetch(`${getApiBaseUrl()}/api/auth/me`, authRequestInit());
  if (!response.ok) await parseError(response, 'Falha ao carregar sessão');
  return response.json() as Promise<AppUser>;
}

export async function refreshSession() {
  const response = await fetch(`${getApiBaseUrl()}/api/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!response.ok) await parseError(response, 'Falha ao renovar sessão');
  return response.json() as Promise<AuthSession>;
}

export async function logoutSession() {
  const response = await fetch(
    `${getApiBaseUrl()}/api/auth/logout`,
    authRequestInit({ method: 'POST' }),
  );
  if (!response.ok) await parseError(response, 'Falha ao sair');
  return response.json();
}

export async function updateCurrentUser(payload: {
  name?: string;
  phone?: string | null;
  avatarUrl?: string | null;
  preferences?: Partial<UserPreferences>;
}) {
  const response = await fetch(
    `${getApiBaseUrl()}/api/auth/me`,
    authRequestInit({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  );
  if (!response.ok) await parseError(response, 'Falha ao atualizar perfil');
  return response.json() as Promise<AppUser>;
}

export async function updateMyPassword(payload: { password: string }) {
  const response = await fetch(
    `${getApiBaseUrl()}/api/auth/me/password`,
    authRequestInit({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  );
  if (!response.ok) await parseError(response, 'Falha ao atualizar senha');
  return response.json();
}

export async function createAdminUser(payload: CreateUserPayload) {
  const response = await fetch(`${getApiBaseUrl()}/api/admin/users`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    if (response.status === 409) {
      throw new Error('Este e-mail já está cadastrado. Faça login.');
    }
    throw new Error(body?.message ?? 'Falha ao criar usuário');
  }

  return response.json();
}

export async function getAdminUsers(): Promise<AppUser[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/api/admin/users`,
    authRequestInit({ cache: 'no-store' }),
  );
  if (!response.ok) await parseError(response, 'Falha ao carregar usuários');
  return response.json();
}

export async function updateAdminUser(id: string, payload: Partial<CreateUserPayload>) {
  const response = await fetch(
    `${getApiBaseUrl()}/api/admin/users/${id}`,
    authRequestInit({
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  );
  if (!response.ok) await parseError(response, 'Falha ao atualizar usuário');
  return response.json();
}

export async function updateAdminUserStatus(id: string, status: UserStatus) {
  const response = await fetch(
    `${getApiBaseUrl()}/api/admin/users/${id}/status`,
    authRequestInit({
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }),
  );
  if (!response.ok) await parseError(response, 'Falha ao atualizar status');
  return response.json();
}

export async function updateAdminUserPassword(id: string, password: string) {
  const response = await fetch(
    `${getApiBaseUrl()}/api/admin/users/${id}/password`,
    authRequestInit({
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    }),
  );
  if (!response.ok) await parseError(response, 'Falha ao atualizar senha');
  return response.json();
}

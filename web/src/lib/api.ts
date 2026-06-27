import type { ReservationPayload } from '@/types/reservation';
import type { Trip } from '@/types/trip';

function getApiBaseUrl() {
  const isServer = typeof window === 'undefined';
  const raw = isServer
    ? process.env.API_URL || process.env.NEXT_PUBLIC_API_URL
    : process.env.NEXT_PUBLIC_API_URL;

  return (raw || 'http://localhost:3333').replace(/\/$/, '');
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

async function parseError(response: Response, fallbackMessage: string) {
  const body = await response.json().catch(() => ({}));
  const message = body?.message ?? fallbackMessage;
  throw new ApiError(message, response.status);
}

function authRequestInit(options: RequestInit = {}): RequestInit {
  return {
    credentials: 'include',
    ...options,
    headers: options.headers ?? {},
  };
}

async function refreshAccessToken() {
  const response = await fetch(`${getApiBaseUrl()}/api/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new ApiError('Falha ao renovar sessão', response.status);
  }

  return response.json() as Promise<AuthSession>;
}

async function authFetch(input: string, options: RequestInit = {}) {
  const execute = () => fetch(input, authRequestInit(options));

  let response = await execute();

  if (response.status !== 401) {
    return response;
  }

  try {
    await refreshAccessToken();
  } catch {
    return response;
  }

  response = await execute();
  return response;
}

type ApiTrip = Omit<Trip, 'price'> & { price?: string | number | null };
export type TripMutationPayload = Omit<Partial<Trip>, 'boardingPoints'> & {
  boardingPoints?: Array<{ id?: string; label: string; order?: number }>;
};

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
  const response = await fetch(`${getApiBaseUrl()}/api/trips`, {
    cache: 'no-store',
  });
  if (!response.ok) await parseError(response, 'Failed to load trips');
  const data = (await response.json()) as ApiTrip[];
  return data.map(toTrip);
}

export async function getAdminTrips(): Promise<Trip[]> {
  const response = await authFetch(`${getApiBaseUrl()}/api/trips/admin`, {
    cache: 'no-store',
  });
  if (!response.ok) await parseError(response, 'Failed to load trips');
  const data = (await response.json()) as ApiTrip[];
  return data.map(toTrip);
}

export async function getAdminTrip(id: string): Promise<Trip> {
  const response = await authFetch(`${getApiBaseUrl()}/api/trips/${id}`, {
    cache: 'no-store',
  });
  if (!response.ok) await parseError(response, 'Failed to load trip');
  const data = (await response.json()) as ApiTrip;
  return toTrip(data);
}

export async function createTrip(payload: TripMutationPayload) {
  const response = await authFetch(`${getApiBaseUrl()}/api/trips`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) await parseError(response, 'Failed to create trip');
  return response.json();
}

export async function updateTrip(id: string, payload: TripMutationPayload) {
  const response = await authFetch(`${getApiBaseUrl()}/api/trips/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) await parseError(response, 'Failed to update trip');
  return response.json();
}

export async function deleteTrip(id: string) {
  const response = await authFetch(`${getApiBaseUrl()}/api/trips/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) await parseError(response, 'Failed to delete trip');
}

type UploadUrlResponse = {
  key: string;
  uploadUrl: string;
  publicUrl: string;
};

type MediaAssetResponse = {
  id: string;
  key: string;
  url: string;
};

export async function uploadTripImage(file: File): Promise<MediaAssetResponse> {
  const uploadUrlResponse = await authFetch(`${getApiBaseUrl()}/api/media/upload-url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileName: file.name,
      mimeType: file.type,
      folder: 'trips',
    }),
  });

  if (!uploadUrlResponse.ok) {
    await parseError(uploadUrlResponse, 'Falha ao preparar upload');
  }

  const uploadData = (await uploadUrlResponse.json()) as UploadUrlResponse;
  const storageResponse = await fetch(uploadData.uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });

  if (!storageResponse.ok) {
    throw new ApiError('Falha ao enviar imagem', storageResponse.status);
  }

  const completeResponse = await authFetch(`${getApiBaseUrl()}/api/media/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      key: uploadData.key,
      url: uploadData.publicUrl,
      mimeType: file.type,
      size: file.size,
      alt: file.name,
    }),
  });

  if (!completeResponse.ok) {
    await parseError(completeResponse, 'Falha ao registrar imagem');
  }

  return completeResponse.json() as Promise<MediaAssetResponse>;
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

export async function getReservations(tripId?: string): Promise<ReservationItem[]> {
  const searchParams = tripId ? `?tripId=${encodeURIComponent(tripId)}` : '';
  const response = await authFetch(`${getApiBaseUrl()}/api/reservations${searchParams}`, {
    cache: 'no-store',
  });
  if (!response.ok) await parseError(response, 'Failed to load reservations');
  return response.json();
}

export async function updateReservationStatus(
  id: string,
  status: ReservationItem['status'],
) {
  const response = await authFetch(`${getApiBaseUrl()}/api/reservations/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
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
  const response = await authFetch(`${getApiBaseUrl()}/api/auth/me`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) await parseError(response, 'Falha ao atualizar perfil');
  return response.json() as Promise<AppUser>;
}

export async function updateMyPassword(payload: { password: string }) {
  const response = await authFetch(`${getApiBaseUrl()}/api/auth/me/password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) await parseError(response, 'Falha ao atualizar senha');
  return response.json();
}

export async function createAdminUser(payload: CreateUserPayload) {
  const response = await authFetch(`${getApiBaseUrl()}/api/admin/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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
  const response = await authFetch(`${getApiBaseUrl()}/api/admin/users`, {
    cache: 'no-store',
  });
  if (!response.ok) await parseError(response, 'Falha ao carregar usuários');
  return response.json();
}

export async function updateAdminUser(id: string, payload: Partial<CreateUserPayload>) {
  const response = await authFetch(`${getApiBaseUrl()}/api/admin/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) await parseError(response, 'Falha ao atualizar usuário');
  return response.json();
}

export async function updateAdminUserStatus(id: string, status: UserStatus) {
  const response = await authFetch(`${getApiBaseUrl()}/api/admin/users/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) await parseError(response, 'Falha ao atualizar status');
  return response.json();
}

export async function updateAdminUserPassword(id: string, password: string) {
  const response = await authFetch(`${getApiBaseUrl()}/api/admin/users/${id}/password`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  if (!response.ok) await parseError(response, 'Falha ao atualizar senha');
  return response.json();
}

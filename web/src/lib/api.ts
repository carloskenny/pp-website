import type { ReservationPayload } from '@/types/reservation';
import type { Trip } from '@/types/trip';

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:3001';

type ApiTrip = Omit<Trip, 'price'> & { price?: string | number | null };

function toTrip(value: ApiTrip): Trip {
  return {
    ...value,
    price:
      typeof value.price === 'string'
        ? Number(value.price)
        : (value.price ?? undefined),
  };
}

export async function getTripBySlug(slug: string): Promise<Trip | null> {
  const response = await fetch(`${apiBaseUrl}/api/trips/slug/${slug}`, {
    next: { revalidate: 0 },
  });

  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Failed to load trip');

  const data = (await response.json()) as ApiTrip;
  return toTrip(data);
}

export async function createReservation(payload: ReservationPayload) {
  const response = await fetch(`${apiBaseUrl}/api/reservations`, {
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
  const response = await fetch(`${apiBaseUrl}/api/trips`, {
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('Failed to load trips');
  const data = (await response.json()) as ApiTrip[];
  return data.map(toTrip);
}

export async function createTrip(payload: Partial<Trip>) {
  const response = await fetch(`${apiBaseUrl}/api/trips`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Failed to create trip');
  return response.json();
}

export async function updateTrip(id: string, payload: Partial<Trip>) {
  const response = await fetch(`${apiBaseUrl}/api/trips/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Failed to update trip');
  return response.json();
}

export async function deleteTrip(id: string) {
  const response = await fetch(`${apiBaseUrl}/api/trips/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete trip');
}

export type ReservationItem = {
  id: string;
  tripId: string;
  fullName: string;
  email: string;
  whatsapp: string;
  status: 'pending' | 'payment_pending' | 'confirmed' | 'canceled';
  createdAt: string;
};

export async function getReservations(): Promise<ReservationItem[]> {
  const response = await fetch(`${apiBaseUrl}/api/reservations`, {
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('Failed to load reservations');
  return response.json();
}

export async function updateReservationStatus(
  id: string,
  status: ReservationItem['status'],
) {
  const response = await fetch(`${apiBaseUrl}/api/reservations/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error('Failed to update reservation status');
  return response.json();
}

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role?: 'super_admin' | 'admin_operacao' | 'guia' | 'atendimento';
};

export async function login(payload: LoginPayload) {
  const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Credenciais inválidas');
  return response.json();
}

export async function register(payload: RegisterPayload) {
  const response = await fetch(`${apiBaseUrl}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Falha ao criar conta');
  return response.json();
}

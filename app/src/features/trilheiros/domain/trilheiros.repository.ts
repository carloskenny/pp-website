import {
  Prisma,
  Trilheiro,
  TrilheiroRegistrationStep,
  TrilheiroStatus,
} from '@prisma/client';

export const TRILHEIROS_REPOSITORY = Symbol('TRILHEIROS_REPOSITORY');

export type TrilheiroWithRelations = Prisma.TrilheiroGetPayload<{
  include: {
    reservations: {
      select: {
        id: true;
        status: true;
        tripId: true;
      };
    };
  };
}>;

export type UpsertTrilheiroInput = {
  fullName: string;
  email: string;
  phone?: string | null;
  documentNumber?: string | null;
  birthDate?: Date | null;
  avatarUrl?: string | null;
  status?: TrilheiroStatus;
  registrationStep?: TrilheiroRegistrationStep;
  preferences?: unknown;
  lastAccessAt?: Date | null;
};

export type TrilheirosRepository = {
  findByEmail(email: string): Promise<Trilheiro | null>;
  findById(id: string): Promise<TrilheiroWithRelations | null>;
  upsertByEmail(input: UpsertTrilheiroInput): Promise<Trilheiro>;
};

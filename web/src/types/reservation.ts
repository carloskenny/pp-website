export type ReservationPayload = {
  tripId: string;
  fullName: string;
  email: string;
  whatsapp: string;
  cpf?: string;
  birthDate?: string;
  boardingPointId?: string;
  notes?: string;
};

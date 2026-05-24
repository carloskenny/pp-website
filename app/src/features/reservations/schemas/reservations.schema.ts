import { z } from 'zod';

export const createReservationSchema = z.object({
  tripId: z.string().min(1),
  fullName: z.string().min(3),
  email: z.string().email(),
  whatsapp: z.string().min(8),
  cpf: z.string().min(11).optional(),
  birthDate: z.coerce.date().optional(),
  boardingPointId: z.string().optional(),
  notes: z.string().optional(),
});

export const updateReservationStatusSchema = z.object({
  status: z.enum(['pending', 'payment_pending', 'confirmed', 'canceled']),
});

export type CreateReservationInput = z.infer<typeof createReservationSchema>;
export type UpdateReservationStatusInput = z.infer<
  typeof updateReservationStatusSchema
>;

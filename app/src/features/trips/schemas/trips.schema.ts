import { z } from 'zod';

export const createTripSchema = z.object({
  slug: z.string().min(3),
  title: z.string().min(3),
  destination: z.string().min(2),
  dateLabel: z.string().min(2),
  eventDate: z.coerce.date().optional(),
  departureTime: z.string().min(2).optional(),
  type: z.string().min(2).optional(),
  difficulty: z.string().min(2).optional(),
  duration: z.string().min(1).optional(),
  price: z.number().nonnegative().optional(),
  capacity: z.number().int().positive().optional(),
  summary: z.string().optional(),
  description: z.string().optional(),
  itinerary: z.array(z.string().min(1)).optional(),
  includedItems: z.array(z.string().min(1)).optional(),
  mainImageUrl: z.string().url().optional(),
  paymentLink: z.string().url().optional(),
  whatsappLink: z.string().url().optional(),
  status: z
    .enum(['draft', 'active', 'sold_out', 'finished', 'inactive', 'canceled'])
    .optional(),
  boardingPoints: z
    .array(
      z.object({
        id: z.string().optional(),
        label: z.string().min(2),
        order: z.number().int().nonnegative().optional(),
      }),
    )
    .optional(),
});

export const updateTripSchema = createTripSchema.partial();

export type CreateTripInput = z.infer<typeof createTripSchema>;
export type UpdateTripInput = z.infer<typeof updateTripSchema>;

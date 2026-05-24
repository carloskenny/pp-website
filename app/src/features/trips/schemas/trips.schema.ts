import { z } from 'zod';

export const createTripSchema = z.object({
  slug: z.string().min(3),
  title: z.string().min(3),
  destination: z.string().min(2),
  dateLabel: z.string().min(2),
  type: z.string().min(2).optional(),
  difficulty: z.string().min(2).optional(),
  duration: z.string().min(1).optional(),
  price: z.number().nonnegative().optional(),
  capacity: z.number().int().positive().optional(),
  summary: z.string().optional(),
  paymentLink: z.string().url().optional(),
  whatsappLink: z.string().url().optional(),
  status: z
    .enum(['draft', 'active', 'sold_out', 'finished', 'inactive'])
    .optional(),
});

export const updateTripSchema = createTripSchema.partial();

export type CreateTripInput = z.infer<typeof createTripSchema>;
export type UpdateTripInput = z.infer<typeof updateTripSchema>;

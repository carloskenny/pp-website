import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  role: z
    .enum(['super_admin', 'admin_operacao', 'guia', 'atendimento'])
    .optional(),
});

export type CreateUserPayload = z.infer<typeof createUserSchema>;

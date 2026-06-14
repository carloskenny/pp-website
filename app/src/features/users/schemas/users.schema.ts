import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  role: z
    .enum(['super_admin', 'admin_operacao', 'partner', 'guia', 'atendimento'])
    .optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'BLOCKED']).optional(),
  avatarUrl: z.string().url().nullable().optional(),
  phone: z.string().min(8).nullable().optional(),
  preferences: z
    .object({
      theme: z.enum(['light', 'dark', 'system']).optional(),
      sidebarCollapsed: z.boolean().optional(),
      defaultDashboardView: z.enum(['events', 'reservations', 'users']).optional(),
    })
    .partial()
    .optional(),
});

export type CreateUserPayload = z.infer<typeof createUserSchema>;

export const updateUserSchema = createUserSchema
  .omit({ password: true })
  .partial();

export const updateUserPasswordSchema = z.object({
  password: z.string().min(8),
});

export const updateUserStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE', 'BLOCKED']),
});

export const updateCurrentUserSchema = z.object({
  name: z.string().min(3).optional(),
  phone: z.string().min(8).nullable().optional(),
  avatarUrl: z.string().url().nullable().optional(),
  preferences: z
    .object({
      theme: z.enum(['light', 'dark', 'system']).optional(),
      sidebarCollapsed: z.boolean().optional(),
      defaultDashboardView: z.enum(['events', 'reservations', 'users']).optional(),
    })
    .partial()
    .optional(),
});

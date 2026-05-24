import { z } from 'zod';

export const createUploadUrlSchema = z.object({
  fileName: z.string().min(1),
  mimeType: z.string().min(3),
  folder: z.string().default('trips'),
});

export const completeUploadSchema = z.object({
  key: z.string().min(1),
  url: z.string().url(),
  mimeType: z.string().min(3),
  size: z.number().int().positive(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  alt: z.string().optional(),
  tripId: z.string().optional(),
  uploadedBy: z.string().optional(),
});

export type CreateUploadUrlPayload = z.infer<typeof createUploadUrlSchema>;
export type CompleteUploadPayload = z.infer<typeof completeUploadSchema>;

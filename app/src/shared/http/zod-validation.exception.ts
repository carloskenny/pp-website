import { BadRequestException } from '@nestjs/common';
import { ZodError } from 'zod';

export function fromZodError(error: ZodError): BadRequestException {
  return new BadRequestException({
    message: 'Validation failed',
    errors: error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    })),
  });
}

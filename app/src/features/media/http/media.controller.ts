import { Body, Controller, Post } from '@nestjs/common';
import { ZodError } from 'zod';
import { fromZodError } from '../../../shared/http/zod-validation.exception';
import {
  completeUploadSchema,
  createUploadUrlSchema,
} from '../schemas/media.schema';
import { CompleteUploadUseCase } from '../use-cases/complete-upload.use-case';
import { CreateUploadUrlUseCase } from '../use-cases/create-upload-url.use-case';

@Controller('media')
export class MediaController {
  constructor(
    private readonly createUploadUrlUseCase: CreateUploadUrlUseCase,
    private readonly completeUploadUseCase: CompleteUploadUseCase,
  ) {}

  @Post('upload-url')
  createUploadUrl(@Body() body: unknown) {
    try {
      return this.createUploadUrlUseCase.execute(createUploadUrlSchema.parse(body));
    } catch (error) {
      if (error instanceof ZodError) throw fromZodError(error);
      throw error;
    }
  }

  @Post('complete')
  completeUpload(@Body() body: unknown) {
    try {
      return this.completeUploadUseCase.execute(completeUploadSchema.parse(body));
    } catch (error) {
      if (error instanceof ZodError) throw fromZodError(error);
      throw error;
    }
  }
}

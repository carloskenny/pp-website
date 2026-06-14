import { Module } from '@nestjs/common';
import { MEDIA_REPOSITORY } from './domain/media.repository';
import { MediaController } from './http/media.controller';
import { MediaPrismaRepository } from './infra/media-prisma.repository';
import { CompleteUploadUseCase } from './use-cases/complete-upload.use-case';
import { CreateUploadUrlUseCase } from './use-cases/create-upload-url.use-case';
import { SecurityModule } from '../../shared/security/security.module';

@Module({
  imports: [SecurityModule],
  controllers: [MediaController],
  providers: [
    { provide: MEDIA_REPOSITORY, useClass: MediaPrismaRepository },
    CreateUploadUrlUseCase,
    CompleteUploadUseCase,
  ],
})
export class MediaModule {}

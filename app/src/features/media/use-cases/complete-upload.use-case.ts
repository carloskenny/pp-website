import { Inject, Injectable } from '@nestjs/common';
import { MEDIA_REPOSITORY, MediaRepository } from '../domain/media.repository';
import { CompleteUploadPayload } from '../schemas/media.schema';

@Injectable()
export class CompleteUploadUseCase {
  constructor(
    @Inject(MEDIA_REPOSITORY)
    private readonly mediaRepository: MediaRepository,
  ) {}

  execute(payload: CompleteUploadPayload) {
    return this.mediaRepository.create(payload);
  }
}

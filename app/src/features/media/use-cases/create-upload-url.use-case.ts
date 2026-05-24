import { Injectable } from '@nestjs/common';
import { StorageService } from '../../../shared/storage/storage.service';
import { CreateUploadUrlPayload } from '../schemas/media.schema';

@Injectable()
export class CreateUploadUrlUseCase {
  constructor(private readonly storageService: StorageService) {}

  execute(payload: CreateUploadUrlPayload) {
    return this.storageService.generateSignedUploadUrl({
      folder: payload.folder,
      fileName: payload.fileName,
      mimeType: payload.mimeType,
    });
  }
}

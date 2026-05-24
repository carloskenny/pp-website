import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { CreateMediaAssetInput, MediaRepository } from '../domain/media.repository';

@Injectable()
export class MediaPrismaRepository implements MediaRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(input: CreateMediaAssetInput) {
    return this.prisma.mediaAsset.create({ data: input });
  }
}

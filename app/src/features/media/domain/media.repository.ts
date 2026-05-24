import { MediaAsset } from '@prisma/client';

export const MEDIA_REPOSITORY = Symbol('MEDIA_REPOSITORY');

export type CreateMediaAssetInput = {
  key: string;
  url: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  alt?: string;
  tripId?: string;
  uploadedBy?: string;
};

export type MediaRepository = {
  create(input: CreateMediaAssetInput): Promise<MediaAsset>;
};

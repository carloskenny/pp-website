import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import crypto from 'node:crypto';

@Injectable()
export class StorageService {
  private readonly bucket: string;
  private readonly client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.bucket = this.configService.getOrThrow<string>('STORAGE_BUCKET');
    this.client = new S3Client({
      region: this.configService.getOrThrow<string>('STORAGE_REGION'),
      endpoint: this.configService.get<string>('STORAGE_ENDPOINT'),
      forcePathStyle: this.configService.get<boolean>('STORAGE_FORCE_PATH_STYLE'),
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('STORAGE_ACCESS_KEY'),
        secretAccessKey: this.configService.getOrThrow<string>(
          'STORAGE_SECRET_KEY',
        ),
      },
    });
  }

  async generateSignedUploadUrl(params: {
    folder: string;
    fileName: string;
    mimeType: string;
    expiresInSeconds?: number;
  }) {
    const extension = params.fileName.split('.').pop() || 'bin';
    const key = `${params.folder}/${crypto.randomUUID()}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: params.mimeType,
    });

    const uploadUrl = await getSignedUrl(this.client, command, {
      expiresIn: params.expiresInSeconds ?? 300,
    });

    const publicBase =
      this.configService.get<string>('STORAGE_ENDPOINT') || '';
    const publicUrl = publicBase
      ? `${publicBase.replace(/\/$/, '')}/${this.bucket}/${key}`
      : key;

    return { key, uploadUrl, publicUrl };
  }
}

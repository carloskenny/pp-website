import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import { StorageService } from './storage.service';

jest.mock('node:crypto', () => ({
  randomUUID: jest.fn(),
}));

jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn().mockResolvedValue('https://signed-upload-url.example'),
}));

describe('StorageService', () => {
  it('generates signed upload urls with a stable key format', async () => {
    const configService = {
      getOrThrow: jest.fn((key: string) => {
        const values: Record<string, string> = {
          STORAGE_BUCKET: 'pp-media',
          STORAGE_REGION: 'us-east-1',
          STORAGE_ACCESS_KEY: 'test-access',
          STORAGE_SECRET_KEY: 'test-secret',
        };

        return values[key];
      }),
      get: jest.fn((key: string) => {
        const values: Record<string, string | boolean> = {
          STORAGE_ENDPOINT: 'http://localhost:9000',
          STORAGE_FORCE_PATH_STYLE: true,
        };

        return values[key];
      }),
    } as unknown as ConfigService;

    (randomUUID as jest.Mock).mockReturnValue('uuid-test');

    const service = new StorageService(configService);
    const result = await service.generateSignedUploadUrl({
      folder: 'trips',
      fileName: 'photo.jpg',
      mimeType: 'image/jpeg',
      expiresInSeconds: 120,
    });

    expect(result.key).toBe('trips/uuid-test.jpg');
    expect(result.publicUrl).toBe('http://localhost:9000/pp-media/trips/uuid-test.jpg');
    expect(result.uploadUrl).toBe('https://signed-upload-url.example');
  });
});

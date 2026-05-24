import { StorageService } from '../../../shared/storage/storage.service';
import { CreateUploadUrlUseCase } from './create-upload-url.use-case';

describe('CreateUploadUrlUseCase', () => {
  it('returns signed url payload', async () => {
    const storageService = {
      generateSignedUploadUrl: jest.fn().mockResolvedValue({
        key: 'trips/1.jpg',
        uploadUrl: 'https://signed-url',
        publicUrl: 'https://cdn/trips/1.jpg',
      }),
    } as unknown as StorageService;

    const useCase = new CreateUploadUrlUseCase(storageService);
    await expect(
      useCase.execute({
        folder: 'trips',
        fileName: 'cover.jpg',
        mimeType: 'image/jpeg',
      }),
    ).resolves.toMatchObject({ key: 'trips/1.jpg' });
  });
});

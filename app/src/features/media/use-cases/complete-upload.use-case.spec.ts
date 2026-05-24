import { MediaRepository } from '../domain/media.repository';
import { CompleteUploadUseCase } from './complete-upload.use-case';

describe('CompleteUploadUseCase', () => {
  it('persists media asset metadata', async () => {
    const mediaRepository: MediaRepository = {
      create: jest.fn().mockResolvedValue({ id: '1' } as never),
    };

    const useCase = new CompleteUploadUseCase(mediaRepository);
    await expect(
      useCase.execute({
        key: 'trips/1.jpg',
        url: 'https://cdn/trips/1.jpg',
        mimeType: 'image/jpeg',
        size: 1234,
      }),
    ).resolves.toMatchObject({ id: '1' });
  });
});

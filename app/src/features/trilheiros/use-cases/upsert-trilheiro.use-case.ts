import { Inject, Injectable } from '@nestjs/common';
import {
  TRILHEIROS_REPOSITORY,
  TrilheirosRepository,
  UpsertTrilheiroInput,
} from '../domain/trilheiros.repository';

@Injectable()
export class UpsertTrilheiroUseCase {
  constructor(
    @Inject(TRILHEIROS_REPOSITORY)
    private readonly trilheirosRepository: TrilheirosRepository,
  ) {}

  async execute(input: UpsertTrilheiroInput) {
    return this.trilheirosRepository.upsertByEmail({
      ...input,
      status: input.status ?? 'INCOMPLETE',
      registrationStep: input.registrationStep ?? 'minimal',
    });
  }
}

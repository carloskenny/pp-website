import { Module } from '@nestjs/common';
import { TRILHEIROS_REPOSITORY } from './domain/trilheiros.repository';
import { TrilheirosPrismaRepository } from './infra/trilheiros-prisma.repository';
import { UpsertTrilheiroUseCase } from './use-cases/upsert-trilheiro.use-case';

@Module({
  providers: [
    { provide: TRILHEIROS_REPOSITORY, useClass: TrilheirosPrismaRepository },
    UpsertTrilheiroUseCase,
  ],
  exports: [TRILHEIROS_REPOSITORY, UpsertTrilheiroUseCase],
})
export class TrilheirosModule {}

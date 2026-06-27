# Arquitetura — Backend

## Stack

- NestJS
- Prisma 7
- Zod
- dayjs

## Estrutura

- `features/*/{http,use-cases,domain,infra,schemas}`
- `shared/*` para prisma, storage e helpers HTTP

## Regras

- contratos de entrada validados com Zod;
- use cases concentram regras de negócio;
- controllers permanecem finos;
- status e enums devem permanecer estáveis.


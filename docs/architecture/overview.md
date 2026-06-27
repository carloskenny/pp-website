# Arquitetura — Visão geral

## Organização

- `app/`: backend NestJS.
- `web/`: frontend Next.js.
- `db`: PostgreSQL via Docker.

## Diretrizes

- manter o backend feature-first;
- manter o frontend em App Router;
- preferir evolução da estrutura existente;
- evitar lógica de negócio em componentes visuais.

## Fluxo técnico

1. Prisma/schema/migration
2. DTOs
3. Service
4. Controller
5. Frontend/API client
6. UI
7. Testes/validação
8. Documentação breve


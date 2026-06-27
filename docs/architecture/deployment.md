# Arquitetura — Deploy

## Portas oficiais

- Frontend: `3000`
- Backend: `3001`
- PostgreSQL: `5432`
- MinIO: `9000`

## Regras

- não alterar portas sem solicitação explícita;
- manter Docker, compose e `.env` estáveis;
- qualquer mudança de deploy deve ser documentada.


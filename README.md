# Pés do Paraná — Ambiente Docker

## Escopo do projeto

- Aplicação **100% web**.
- Site público e portal administrativo no `web` (Next.js), com abordagem **mobile-first**.
- **Sem** app mobile nativo ou PWA dedicado no escopo atual.

Este repositório usa `docker compose` para subir 3 serviços:

- `db`: PostgreSQL
- `app`: backend (NestJS) em `./app`
- `web`: frontend (Next.js) em `./web`

`app` e `web` usam `Dockerfile` próprio (build local via Compose).

## Estrutura esperada

```txt
.
├── app/   # projeto NestJS
├── web/   # projeto Next.js
├── db/    # scripts SQL opcionais
└── compose.yml
```

## Pré-requisitos

- Docker
- Docker Compose (plugin `docker compose`)
- Imagens Node LTS 24 (usadas no `compose.yml`)

## Subir ambiente

```bash
docker compose -f compose.yml up -d
```

Para rebuild completo (após alterar Dockerfile/deps):

```bash
docker compose -f compose.yml up -d --build
```

Logs:

```bash
docker compose -f compose.yml logs -f
```

Parar:

```bash
docker compose -f compose.yml down
```

Parar e remover volume do banco:

```bash
docker compose -f compose.yml down -v
```

## Portas e URLs

- Frontend (`web`): `http://localhost:3000`
- Backend (`app`): `http://localhost:3001`
- PostgreSQL (`db`): `localhost:5432`

## Credenciais do banco (desenvolvimento)

- Database: `pp_database`
- User: `pp_user`
- Password: `pp_password`

Connection string usada no `app`:

```txt
postgres://pp_user:pp_password@db:5432/pp_database
```

## Observações importantes

- Atualmente as pastas `app/` e `web/` precisam conter projetos Node válidos com `package.json`.
- O container `app` executa: `npm install && npm run start:dev`.
- O container `web` executa: `npm install && npm run dev -- -H 0.0.0.0 -p 3000`.
- O container `db` usa `postgres:18-alpine` com volume em `/var/lib/postgresql` (padrão recomendado para 18+).

Se você já tinha subido com mapeamento antigo de dados do Postgres, recrie o volume:

```bash
docker compose -f compose.yml down -v
docker compose -f compose.yml up -d
```

Se os scripts forem diferentes no seu projeto, ajuste no `compose.yml`.

## Próximo passo recomendado

1. Scaffold do backend em `app/` (NestJS).
2. Scaffold do frontend em `web/` (Next.js).
3. Subir novamente o compose e validar logs.

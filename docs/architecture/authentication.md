# Arquitetura — Autenticação

## Estado atual

- sessão via cookie `httpOnly`;
- suporte a Bearer token;
- login, refresh e logout já existentes.

## Regras

- não usar `localStorage` para sessão;
- manter `/admin/*` protegido;
- endpoints administrativos exigem RBAC.


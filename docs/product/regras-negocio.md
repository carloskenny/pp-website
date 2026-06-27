# Regras de negócio

## Entidades principais

- `Trip`: evento/trip divulgada no site.
- `Reservation`: reserva feita pelo participante.
- `User`: usuário interno/admin/equipe/parceiro.
- `Trilheiro`: participante final, separado de `User`.
- `Media`: arquivos e imagens.

## Status de Trip

- `draft`
- `active`
- `sold_out`
- `finished`
- `inactive`
- `canceled`

Mapeamento de produto:
- `draft` = rascunho
- `active` = publicado
- `sold_out` = esgotado
- `finished` = encerrado
- `inactive` = inativo interno
- `canceled` = cancelado

## Regras da agenda pública

- `GET /api/trips` deve ser público.
- O endpoint retorna apenas trips publicadas.
- Rascunhos, cancelados e encerrados não aparecem na agenda pública.
- A lista deve ser ordenada por data crescente.

## Regras administrativas

- Rotas `/admin/*` devem permanecer protegidas.
- Endpoints administrativos de Trip exigem autenticação e role permitida.
- Não usar `localStorage` para sessão.
- Usar cookies `httpOnly` e o fluxo de refresh já existente.


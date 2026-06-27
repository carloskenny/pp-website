# Regras de negócio

## Entidades principais

- `Trip`: evento/trip divulgada no site.
- `Reservation`: reserva feita pelo participante.
- `User`: usuário interno/admin/equipe/parceiro.
- `Trilheiro`: participante final, separado de `User`.
- `Media`: arquivos e imagens.

## Classificação de evento

- `experienceType`: tipo principal da experiência.
- `interests`: atrativos/interesses principais.
- `difficulty`: dificuldade principal.

Tipos de experiência:
- `trail` = Trilha
- `tour` = Passeio
- `camping` = Camping
- `expedition` = Expedição

Atrativos/interesses:
- `mountain` = Montanha
- `trail` = Trilha
- `viewpoint` = Mirante
- `waterfall` = Cachoeira
- `canyon` = Cânion
- `river_aquatrekking` = Rio / Aquatrekking
- `beach` = Praia
- `rappel` = Rapel
- `bungee_jump` = Bungee Jump
- `cave` = Caverna
- `sunrise` = Nascer do Sol
- `sunset` = Pôr do Sol

Dificuldades:
- `easy` = Leve
- `moderate` = Moderada
- `hard` = Difícil
- `very_hard` = Muito difícil

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

## Preferências futuras do trilheiro

- trilheiros poderão salvar preferências usando os mesmos tipos, atrativos e dificuldades;
- não implementar recomendação automática agora;
- a estrutura deve permanecer compatível com essa evolução.

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

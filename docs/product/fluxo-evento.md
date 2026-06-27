# Fluxo de evento

## Objetivo

Organizar a jornada do evento desde publicação até operação.

## Fluxo

1. Admin cadastra a trip.
2. Admin publica a trip.
3. A agenda pública exibe somente trips publicadas.
4. O visitante acessa `/trips/[slug]`.
5. O visitante acessa `/reserva/[slug]`.
6. A operação acompanha reservas e participantes.

## Regras

- `GET /api/trips` público não expõe rascunhos.
- O card público deve levar para a página da trip.
- O botão principal de conversão deve permanecer recorrente.


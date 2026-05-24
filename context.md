# Contexto de Implementação — Site Pés do Paraná

## Status consolidado da implementação (até 24/05/2026)

### Já implementado
- Backend `app` com NestJS + Prisma 7 + Zod + dayjs.
- Estrutura backend em arquitetura feature-first:
  - `features/*/{http,use-cases,domain,infra,schemas}`
  - `shared/*` para prisma/storage/http helpers.
- Módulos backend ativos:
  - `trips`, `reservations`, `users`, `auth`, `media`.
- Testes unitários cobrindo use cases principais.
- Frontend `web` com Next.js + Tailwind + Ant Design.
- Páginas implementadas:
  - `/` (landing)
  - `/trips/[slug]`
  - `/reserva/[slug]`
  - `/admin/eventos`
  - `/admin/reservas`
  - `/login`
  - `/cadastro`
- Docker com `Dockerfile` em `app` e `web`, Compose para `db`, `app`, `web`.

### Padrões estabelecidos
- Projeto 100% web (sem app mobile/PWA no escopo).
- Mobile-first com breakpoint desktop em `1033px`.
- Tablet segue comportamento mobile.
- Prisma 7 com `prisma.config.ts`.
- ESLint + Prettier configurados em `app` e `web`.

### Onde paramos
- Ajustes finos de layout/hero na Home em andamento.
- Próximo bloco funcional recomendado:
  1. proteção de rotas `/admin/*` via auth no front;
  2. melhoria do payload de reservas para exibir dados da trip no admin;
  3. depois iniciar builder de landing por trip (feature já registrada, fora do escopo imediato).

Projeto: Pés do Paraná — site mobile-first para venda/reserva de trips, trilhas e experiências de aventura.

Referência Figma:
https://www.figma.com/design/AV1vtPLbcnpMSSe0jZbCE7/P%C3%A9s-do-Paran%C3%A1---Projeto?node-id=0-1&m=dev&t=3KLcOqpCJpxzEhbp-1

Importante:
- Usar Figma MCP Plugin para inspecionar frames, tokens, estilos, imagens, espaçamentos e componentes.
- O node inicial informado é `0:1`.
- Caso o MCP não consiga ler o node raiz, navegar pela árvore do arquivo e identificar os frames principais da landing.
- Implementar com fidelidade visual ao Figma, mas priorizando código limpo, responsivo e escalável.

## Objetivo do site

Criar uma landing page moderna, mobile-first e com foco em conversão para o Pés do Paraná.

O site deve:
- Centralizar informações das trips.
- Reduzir dúvidas repetitivas.
- Exibir agenda de eventos.
- Ter páginas individuais por evento.
- Permitir reserva online estruturada.
- Integrar chamada para WhatsApp.
- Preparar base para painel administrativo simples.
- Trabalhar como centro da operação, não apenas vitrine.

Base do projeto: o cliente hoje depende muito de Instagram/WhatsApp, processo manual, controle manual de pagamentos, grupos e confirmações. O objetivo é reduzir esforço operacional e melhorar conversão. :contentReference[oaicite:0]{index=0}

## Escopo inicial — Modelo 2

Implementar a base do Modelo 2 — Automação Essencial:

- Landing page mobile.
- Agenda dinâmica.
- Página individual por evento.
- Reserva online estruturada.
- Formulários automáticos.
- Lista organizada de participantes.
- Painel administrativo simples.
- Confirmação manual + e-mail automático.
- Campo de link de pagamento por evento.
- Campo de link do grupo WhatsApp por evento.

## Stack sugerida

Usar Next.js com App Router, TypeScript e Tailwind CSS.

Estrutura sugerida:

src/
  app/
    page.tsx
    trips/[slug]/page.tsx
    reserva/[slug]/page.tsx
    admin/
      eventos/page.tsx
      reservas/page.tsx
  components/
    layout/
    sections/
    trips/
    forms/
    ui/
  lib/
    data/
    utils/
  types/
  constants/

## Direção visual

Visual aventureiro, moderno, energético e confiável.

Usar:
- Imagens grandes de trilha, montanha, cachoeira e nascer do sol.
- Backgrounds com textura natural.
- Divisões de seção com silhuetas de montanha, trekking, escalada ou curvas orgânicas.
- Cores conectadas à identidade visual do Pés do Paraná.
- CTA forte e recorrente.
- Layout mobile-first.
- Cards com alto contraste e boa leitura.

Evitar:
- Visual genérico de agência de turismo.
- Layout muito corporativo.
- Excesso de texto em blocos grandes.
- Componentes sem hierarquia visual.

## Conteúdo base de eventos

Usar estes eventos como mock inicial:

### Pico Agudo — Sapopema/PR
- Tipo: Nascer do sol
- Data: 03 de Maio
- Experiência: subida noturna, frio da montanha, nascer do sol no cume, café coletivo no topo.
- Incluso: transporte, guias experientes, organização completa e seguro viagem. :contentReference[oaicite:1]{index=1}

### Lagoa Azul + Aquatrekking
- Data: 26 de Abril
- Experiência: Lagoa Azul, Cachoeira das Andorinhas, aquatrekking dentro do rio, pedras e trechos na água.
- Incluso: transporte, guias experientes, organização completa e seguro viagem. :contentReference[oaicite:2]{index=2}

### Mirante das Pirâmides — Grão-Pará/SC
- Data: 30 e 31 de Maio
- Experiência: trilha, mirante, lanche no topo, pôr do sol no lago, churrasco, cachoeira e descanso.
- Incluso: transporte, guias experientes, organização completa e seguro viagem. :contentReference[oaicite:3]{index=3}

## Páginas necessárias

### Home
Seções:
1. Hero com CTA principal.
2. Próximas aventuras.
3. Como funciona.
4. Por que ir com o Pés do Paraná.
5. Galeria/experiências.
6. FAQ.
7. CTA final para WhatsApp/Reserva.

### Página do evento
Rota: `/trips/[slug]`

Conteúdo:
- Hero do evento.
- Data, destino, dificuldade, duração, vagas e valor.
- Descrição emocional da experiência.
- Roteiro.
- Incluso no pacote.
- O que levar.
- Pontos de embarque.
- FAQ específico.
- CTA fixo no mobile: “Reservar minha vaga”.

### Página de reserva
Rota: `/reserva/[slug]`

Formulário:
- Nome completo.
- WhatsApp.
- E-mail.
- CPF opcional inicialmente.
- Data de nascimento opcional.
- Ponto de embarque.
- Observações.
- Aceite dos termos.
- Botão enviar reserva.

Após envio:
- Exibir mensagem de pré-reserva recebida.
- Informar que a confirmação será manual após pagamento.
- Preparar estrutura para e-mail automático.

### Admin simples
Rota: `/admin/eventos`

Campos do evento:
- Nome.
- Slug.
- Data.
- Destino.
- Valor.
- Capacidade.
- Descrição.
- Roteiro.
- Incluso.
- O que levar.
- Link de pagamento.
- Link grupo WhatsApp.
- Status ativo/inativo.
- Imagem principal.
- Galeria.

## Modelagem TypeScript inicial

Criar tipos:

- Trip
- TripStatus
- TripDifficulty
- Reservation
- ReservationStatus
- BoardingPoint

Status de reserva:
- pending
- payment_pending
- confirmed
- canceled

Status de evento:
- draft
- active
- sold_out
- finished
- inactive

## Regras de implementação

- Mobile-first obrigatório.
- Usar componentes reutilizáveis.
- Não hardcodar conteúdo dentro dos componentes principais; separar dados mockados em `lib/data/trips.ts`.
- Preparar estrutura para futura API/admin.
- Componentes devem ser semanticamente corretos.
- Usar acessibilidade básica: alt em imagens, labels em inputs, aria quando necessário.
- CTA de WhatsApp deve ser configurável.
- Criar layout visual fiel ao Figma usando MCP como fonte de verdade.

## Primeira tarefa

1. Inspecionar o arquivo Figma via MCP.
2. Identificar frames principais da landing.
3. Criar estrutura inicial do projeto.
4. Implementar a Home mobile-first.
5. Criar dados mockados dos 3 eventos.
6. Criar cards de eventos e página dinâmica `/trips/[slug]`.
7. Criar formulário inicial de reserva.
8. Garantir responsividade e fidelidade visual ao Figma.

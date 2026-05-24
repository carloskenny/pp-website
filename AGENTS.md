# AGENTS.md — Diretrizes para o Codex no projeto Pés do Paraná

Este arquivo define como o agente deve atuar neste repositório.  
Escopo: toda a árvore a partir da raiz do projeto.

---

## 0) Estado atual do repositório (checkpoint)

- Backend implementado em `app/` com:
  - NestJS + Prisma 7 + Zod + dayjs
  - estrutura feature-first (`features/*/{http,use-cases,domain,infra,schemas}`)
  - módulos: `trips`, `reservations`, `users`, `auth`, `media`
  - testes unitários de use cases
- Frontend implementado em `web/` com:
  - Next.js + Tailwind + Ant Design
  - páginas: `/`, `/trips/[slug]`, `/reserva/[slug]`, `/admin/eventos`, `/admin/reservas`, `/login`, `/cadastro`
- Infra:
  - Dockerfile em `app` e `web`
  - Compose com `db`, `app`, `web`
  - ESLint + Prettier em ambos os projetos

Regra de continuidade:
- antes de criar estrutura nova, preferir evoluir a estrutura existente.
- manter o padrão feature-first no backend e rotas App Router no frontend.

---

## 1) Objetivo do produto

Implementar o site **Pés do Paraná** (mobile-first) como centro operacional para:

- exibir eventos/trips;
- captar reservas estruturadas;
- reduzir operação manual em WhatsApp/Instagram;
- preparar base para administração simples de eventos e reservas.
- manter toda a operação em **aplicação web responsiva** (sem app mobile nativo/PWA no escopo atual).

Referência de produto e conteúdo: `context.md`.  
Referência visual: Figma do projeto (node inicial `0:1`).

---

## 2) Stack e arquitetura alvo

### Front-end
- **Next.js (App Router)** + **TypeScript** + **Tailwind CSS** + **Ant Design (antd)**.
- Renderização híbrida (SSR/ISR/CSR conforme necessidade).
- Mobile-first obrigatório.
- Breakpoint desktop oficial: `1033px` (tablet comporta como mobile).

### Back-end
- **NestJS** (API REST modular) + **Prisma**.
- DTOs com validação e tipagem forte.
- Validação de domínio/contrato com **Zod**.
- Manipulação de datas com **dayjs**.
- Autenticação preparada para JWT + refresh (quando entrar fase de auth real).
- Prisma 7 com `prisma.config.ts`.

### Banco
- **PostgreSQL**.
- Migrações versionadas.
- Modelagem relacional com foco em trips, reservas, usuários admin e auditoria.

### Integrações previstas
- WhatsApp (link configurável por evento e global).
- E-mail transacional para confirmação/atualização de reserva.
- Link de pagamento por evento (manual nesta fase, automatizável depois).

---

## 3) Estratégia de execução por fases

### Fase atual (Modelo 2 — automação essencial)
Entregar:
- Home (landing) mobile-first;
- agenda dinâmica;
- página dinâmica de evento `/trips/[slug]`;
- página de reserva `/reserva/[slug]`;
- admin simples de eventos `/admin/eventos`;
- base para `/admin/reservas`.

### Diretriz de implementação
- Começar por dados mockados em `lib/data`.
- Não acoplar componente ao mock (manter interface preparada para API).
- Manter contrato de tipos estável para migração futura ao Nest + Postgres.

---

## 4) Estrutura de diretórios esperada

Usar como referência principal:

```txt
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
```

Regras:
- Componentes pequenos e reutilizáveis.
- Separar claramente `sections` (blocos de página) de `ui` (componentes base).
- Evitar lógica de negócio dentro de componentes visuais.

---

## 5) Modelos e tipos obrigatórios

Definir tipos iniciais em `src/types`:

- `Trip`
- `TripStatus`: `draft | active | sold_out | finished | inactive`
- `TripDifficulty`
- `BoardingPoint`
- `Reservation`
- `ReservationStatus`: `pending | payment_pending | confirmed | canceled`

Regras:
- Sempre usar tipos explícitos.
- Evitar `any`.
- Criar helpers de transformação/normalização em `lib/utils`.

---

## 6) Regras de UI/UX

### Obrigatório
- Mobile-first real (não apenas ajuste final).
- CTA forte e recorrente (“Reservar”, “Falar no WhatsApp”).
- Alto contraste e legibilidade.
- Componentes semânticos (`header`, `main`, `section`, `article`, `footer`).
- Acessibilidade mínima: `alt`, `label`, `aria-*` quando aplicável.

### Evitar
- Visual corporativo genérico.
- Blocos longos de texto sem hierarquia.
- Hardcode de conteúdo dentro dos componentes de seção.

---

## 7) Figma como fonte de verdade visual

Ao implementar telas:

1. Usar MCP do Figma para inspecionar frames/componentes/tokens.
2. Se `node 0:1` não abrir diretamente, navegar pela árvore para localizar os frames da landing.
3. Extrair:
   - espaçamentos;
   - tipografia;
   - cores;
   - raios/sombras;
   - comportamento responsivo.
4. Converter para Tailwind tokens/utilitários de forma consistente.

Critério: fidelidade visual alta **sem sacrificar** clareza e manutenção do código.

---

## 8) Conteúdo e dados

Fonte inicial de conteúdo: `context.md`.  
Criar mock em `src/lib/data/trips.ts` com os 3 eventos iniciais:

- Pico Agudo — Sapopema/PR
- Lagoa Azul + Aquatrekking
- Mirante das Pirâmides — Grão-Pará/SC

Regra:
- conteúdo centralizado em `lib/data`;
- componentes recebem dados por props;
- evitar duplicação de textos entre páginas.

---

## 9) Diretrizes para rotas

### `/`
- Hero + CTA
- Próximas aventuras
- Como funciona
- Por que ir com o Pés do Paraná
- Galeria/experiências
- FAQ
- CTA final

### `/trips/[slug]`
- Hero do evento
- metadados (data, dificuldade, duração, vagas, valor)
- descrição
- roteiro
- incluso
- o que levar
- embarque
- FAQ específico
- CTA fixo mobile

### `/reserva/[slug]`
Formulário:
- nome completo
- WhatsApp
- e-mail
- CPF (opcional)
- data de nascimento (opcional)
- ponto de embarque
- observações
- aceite dos termos

Após envio:
- mensagem de pré-reserva recebida;
- instrução de confirmação manual após pagamento.

### `/admin/eventos`
CRUD simplificado de eventos com campos definidos no `context.md`.

---

## 10) Back-end (Nest) e banco (Postgres) — preparação

Mesmo que a primeira entrega seja focada no front, manter compatibilidade com backend futuro:

- projetar contratos (DTO-like) desde já;
- preparar mapeamento claro entre `Trip`/`Reservation` e tabelas futuras;
- padronizar nomes de status e enums;
- manter validações isoladas para fácil migração para class-validator no Nest.

Modelos relacionais esperados (futuro próximo):
- `trips`
- `trip_boarding_points`
- `trip_gallery_items`
- `reservations`
- `admins/users`
- `audit_logs` (quando entrar gestão)

---

## 11) Qualidade de código

- TypeScript estrito.
- Funções com responsabilidade única.
- Sem comentários redundantes.
- Sem dependências desnecessárias.
- Nomeação clara e consistente.

Antes de finalizar qualquer tarefa:
- garantir build sem erros;
- verificar responsividade (larguras pequenas primeiro);
- validar navegação entre páginas principais;
- checar estados vazios e fallback simples.

---

## 12) Padrões de colaboração do agente

Ao executar tarefas neste repositório, o agente deve:

- explicar rapidamente o que vai fazer antes de alterações relevantes;
- fazer mudanças pequenas e focadas;
- não alterar escopo sem necessidade;
- registrar suposições quando algo do Figma/contexto não estiver acessível;
- priorizar soluções incrementais prontas para evoluir para API real.

---

## 13) Fora de escopo (nesta fase)

- automação completa de pagamento;
- integração profunda com provedores externos;
- autenticação complexa multi-perfil;
- observabilidade avançada;
- internacionalização.
- app mobile nativo ou PWA dedicado.

---

## 14) Ordem recomendada de implementação

1. Proteger rotas `/admin/*` no frontend.
2. Ajustar payload de reservas para incluir dados de trip no admin.
3. Implementar lista de passageiros por evento.
4. Evoluir notificações/e-mail.
5. Refinar fidelidade visual com Figma conforme ajustes de UX.

---

## 15) Definition of Done (DoD)

Uma entrega é considerada pronta quando:

- atende ao escopo da fase atual;
- está responsiva em mobile e desktop;
- mantém consistência visual com o Figma;
- usa componentes reutilizáveis e tipagem forte;
- não depende de conteúdo hardcoded em seções principais;
- está pronta para evolução para Nest + Postgres sem refatoração estrutural grande.

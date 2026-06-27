# IMPLEMENTATION PLAN — Pés do Paraná

Documento operacional para orientar a execução das próximas entregas do projeto.

Base de referência:
- `docs/roadmap/backlog.md`
- `PROJECT_MAP.md`
- `context.md`
- estado atual do código em `app/` e `web/`

---

## 1) Objetivo deste plano

Definir a ordem de implementação para evoluir o projeto de uma base funcional para uma operação web completa, com foco em:

- agenda pública dinâmica;
- portal administrativo protegido;
- gestão de trips, reservas e passageiros;
- contratos estáveis para migração/expansão futura.

---

## 2) Estado atual resumido

### Já pronto
- Backend NestJS + Prisma + Zod + dayjs.
- Módulos backend: `trips`, `reservations`, `users`, `auth`, `media`.
- Auth com sessão via cookie httpOnly e Bearer token.
- Rotas `/admin/*` protegidas no frontend.
- RBAC aplicado nos endpoints administrativos.
- CRUD administrativo de eventos.
- Publicação e despublicação de eventos.
- Agenda pública consumindo trips publicadas.
- Formulário público de reserva.
- Docker e banco Postgres já estruturados.

### Parcial
- Página pública individual do evento.
- Reserva com contexto operacional mais rico.
- Admin de reservas com payload mais completo da trip.
- Home ainda sem todas as seções finais.

### Em aberto
- Lista de passageiros por evento.
- Histórico de status.
- Notificações por e-mail.
- Auditoria.
- Ajustes de conteúdo e fidelidade visual.

---

## 3) Princípios de execução

1. Evoluir a estrutura existente antes de criar novas camadas.
2. Manter contrato de tipos estável entre frontend e backend.
3. Centralizar regras em `lib/data`, `schemas` e use cases.
4. Evitar lógica de negócio em componentes visuais.
5. Priorizar entregas que destravam operação real.
6. Manter mobile-first em todas as telas públicas e administrativas.
7. Não alterar portas, Docker, compose, `.env`, autenticação, RBAC ou estrutura do monorepo sem solicitação explícita.

---

## 4) Ordem de implementação

### Fase 2 — Agenda pública dinâmica

**Objetivo**
Exibir no site público apenas eventos publicados, ordenados por data crescente.

**Entregas**
- Garantir `GET /api/trips` público.
- Retornar apenas trips publicadas.
- Ordenar por data crescente.
- Exibir cards com imagem, data, preço, dificuldade e vagas.

**Critério de aceite**
- Evento publicado aparece na agenda pública.
- Rascunho, cancelado e encerrado não aparecem.
- A lista respeita a ordenação por data.

---

### Fase 3 — Página pública individual

**Objetivo**
Fechar a experiência de decisão do evento.

**Entregas**
- Página `/trips/[slug]` completa.
- Conteúdo do evento por slug.
- CTA de reserva e WhatsApp.

**Critério de aceite**
- O evento abre por slug e exibe dados suficientes para conversão.

---

### Fase 4 — Reserva operacional

**Objetivo**
Transformar a reserva em um fluxo útil para operação diária.

**Entregas**
- Enriquecer a listagem de reservas com dados da trip.
- Incluir ponto de embarque no fluxo e no admin.
- Normalizar exibição de status e metadados da reserva.
- Validar consumo de capacidade por trip.

**Critério de aceite**
- O admin consegue operar reservas sem depender de lookup manual.
- Cada reserva exibe contexto suficiente para atendimento.

---

### Fase 5 — Passageiros e comunicação

**Objetivo**
Criar a base operacional do evento e reduzir mensagens manuais.

**Entregas**
- Lista de passageiros por trip/evento.
- E-mails de pré-reserva e confirmação.
- Base para templates de comunicação.

**Critério de aceite**
- A operação abre uma trip e vê quem está vinculado a ela.
- Eventos relevantes geram comunicação consistente.

---

## 5) Backlog priorizado

### Alta prioridade
1. Agenda pública dinâmica.
2. Página pública individual do evento.
3. Enriquecer payload de reservas com dados da trip.

### Prioridade média
4. Implementar lista de passageiros por evento.
5. Histórico de status.
6. Notificações por e-mail.

### Prioridade de produto
7. Completar Home.
8. Completar formulário de reserva.
9. Refinar conteúdos e CTAs.

### Prioridade de base técnica
10. Auditoria.
11. RBAC mais completo.
12. Preparar fila/jobs se necessário.

---

## 6) Dependências técnicas sugeridas

### Frontend
- Reaproveitar `web/src/lib/data`.
- Criar componentes de seção antes de expandir páginas.
- Manter tipos em `web/src/types`.

### Backend
- Consolidar schemas Zod como contrato de entrada.
- Expandir use cases antes de mexer em controllers.
- Manter Prisma como fonte do modelo relacional.

### Banco
- Adicionar apenas o necessário para cada fase.
- Preferir migrações pequenas e incrementais.

---

## 7) Regras para novas entregas

- Não duplicar texto de conteúdo em páginas.
- Não acoplar componente visual ao mock diretamente.
- Não criar estrutura nova se a existente resolver.
- Não avançar para fase seguinte sem fechar o aceite da anterior.
- Não expandir escopo de auth sem necessidade imediata.
- Não alterar portas, Docker, compose, `.env`, autenticação, RBAC ou estrutura do monorepo sem solicitação explícita.

---

## 8) Definition of Done por entrega

Uma entrega só é considerada pronta quando:

- funciona em mobile e desktop;
- respeita o contrato de tipos;
- não quebra rotas existentes;
- tem fallback simples para estado vazio/erro;
- segue a estrutura do projeto;
- fica pronta para evolução sem refatoração estrutural grande.

---

## 9) Próxima ação recomendada

Executar na ordem:

1. proteção de `/admin/*`;
2. payload rico de reservas;
3. lista de passageiros por evento.

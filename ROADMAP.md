# ROADMAP — Pés do Paraná

Documento operacional para orientar as próximas entregas do projeto.

Base de referência:
- `docs/roadmap/backlog.md`
- `PROJECT_MAP.md`
- `IMPLEMENTATION_PLAN.md`
- `context.md`
- `README.md`

---

## 1) Objetivo deste roadmap

Consolidar as próximas entregas em ordem prática, com foco em:

- agenda pública dinâmica;
- página individual do evento;
- reserva operacional;
- lista de participantes;
- redução de esforço manual no dia a dia.

---

## 2) Estado atual resumido

### Já consolidado
- Autenticação e sessão.
- Proteção de rotas `/admin/*` no frontend.
- RBAC e guards no backend.
- CRUD administrativo de eventos.
- Publicação e despublicação de eventos.
- Agenda pública consumindo trips publicadas.
- Formulário público de reserva.
- Infra Docker, Prisma e seeds padronizados.

### Ainda em evolução
- Página pública individual do evento.
- Reserva com mais contexto operacional.
- Lista de passageiros por evento.
- Comunicação automática.
- Revisão fina de conteúdo e fidelidade visual.

---

## 3) Roadmap por prioridade

### Fase 2 — Agenda pública dinâmica

**Objetivo**
Exibir no site público apenas eventos publicados, ordenados por data crescente.

**Entregas**
- `GET /api/trips` público retornando somente trips publicadas.
- Agenda pública consumindo `getTrips()`.
- Cards com imagem, data, preço, dificuldade e vagas.
- Estado vazio e erro amigável.

**Critério de aceite**
- Evento publicado aparece na agenda pública.
- Rascunho, cancelado e encerrado não aparecem.
- A lista respeita ordenação por data.

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
- Enriquecer listagem de reservas com dados da trip.
- Incluir ponto de embarque no fluxo e no admin.
- Normalizar exibição de status e metadados da reserva.
- Validar consumo de capacidade por trip.

**Critério de aceite**
- O admin consegue operar reservas sem lookup manual.
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

## 4) Sequência recomendada

1. Agenda pública dinâmica.
2. Página pública individual.
3. Reserva operacional.
4. Lista de passageiros.
5. Comunicação.
6. Base técnica e reforço de qualidade.

---

## 5) Fora de escopo agora

- app mobile nativo.
- PWA dedicado.
- automação completa de pagamento.
- área do participante.
- clube PP.
- certificados.
- recuperação automática de reserva abandonada.
- avaliação pós-evento.
- histórico do trilheiro.
- automações avançadas de WhatsApp/e-mail.

---

## 6) Regra de execução

Antes de iniciar uma nova frente:

- fechar a anterior com critério de aceite claro;
- manter mudanças pequenas;
- preservar compatibilidade com o modelo atual;
- não misturar trilheiro e usuário interno;
- não expandir escopo sem necessidade operacional.

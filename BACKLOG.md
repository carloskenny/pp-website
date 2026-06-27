# BACKLOG — Pés do Paraná

Backlog operacional por épicos para orientar as próximas entregas do projeto.

Base de referência:
- `context.md`
- `PROJECT_MAP.md`
- `IMPLEMENTATION_PLAN.md`
- `ROADMAP.md`
- `AGENTS.md`

---

## 1) Objetivo

Organizar o trabalho em histórias curtas e executáveis, evitando misturar infraestrutura, operação e produto público na mesma entrega.

---

## 2) Épicos

### Épico 1 — Segurança e sessão

Status:
- concluído como base;
- ajustes futuros só quando houver solicitação explícita.

Histórias:
- login com sessão via cookie httpOnly;
- refresh e logout;
- proteção de `/admin/*` no frontend;
- proteção dos endpoints admin no backend;
- RBAC por perfil.

---

### Épico 2 — Eventos

Status:
- fase atual em andamento.

Histórias:
- CRUD administrativo de evento;
- publicação e despublicação;
- listagem administrativa;
- dados ampliados de `Trip`;
- agenda pública com trips publicadas;
- página pública individual por slug.

---

### Épico 3 — Reservas

Status:
- base existente;
- evolução priorizada depois da agenda pública.

Histórias:
- formulário público estruturado;
- criação de reserva com contexto da trip;
- lista administrativa de reservas;
- mudança de status;
- capacidade e vagas.

---

### Épico 4 — Passageiros

Status:
- backlog.

Histórias:
- lista de participantes por evento;
- filtro por status;
- visão mobile para operação em campo;
- base para check-in.

---

### Épico 5 — Comunicação

Status:
- backlog.

Histórias:
- e-mail de pré-reserva;
- e-mail de confirmação;
- templates transacionais;
- automações futuras.

---

### Épico 6 — Produto público

Status:
- fase atual.

Histórias:
- home pública com agenda;
- cards de eventos publicados;
- página de evento com conteúdo completo;
- CTA de reserva e WhatsApp;
- estados vazios e erros amigáveis.

---

### Épico 7 — Base técnica

Status:
- contínuo.

Histórias:
- contratos estáveis;
- testes unitários e validação de tipos;
- migrações Prisma incrementais;
- documentação curta por entrega.

---

## 3) Ordem recomendada

1. Agenda pública dinâmica.
2. Página pública individual do evento.
3. Reserva operacional enriquecida.
4. Lista de passageiros.
5. Comunicação.
6. Melhorias de base técnica.


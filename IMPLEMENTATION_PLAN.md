# IMPLEMENTATION PLAN — Pés do Paraná

Documento operacional para orientar as próximas entregas do projeto.

Base de referência:
- `PROJECT_MAP.md`
- `context.md`
- estado atual do código em `app/` e `web/`

---

## 1) Objetivo deste plano

Definir a ordem de implementação para evoluir o projeto de uma base funcional para uma operação web completa, com foco em:

- site público mobile-first;
- portal administrativo protegido;
- gestão de trips, reservas e passageiros;
- contratos estáveis para migração/expansão futura.

---

## 2) Estado atual resumido

### Já pronto
- Backend NestJS + Prisma + Zod + dayjs.
- Módulos backend: `trips`, `reservations`, `users`, `auth`, `media`.
- API REST básica para trips, reservas, usuários, auth e mídia.
- Frontend Next.js com rotas públicas e administrativas principais.
- Login/cadastro inicial.
- CRUD básico de eventos e lista básica de reservas.
- Mocks centralizados de trips no frontend.
- Docker e banco Postgres já estruturados.

### Parcial
- Guard de admin apenas no frontend.
- Página de evento ainda enxuta.
- Formulário de reserva ainda incompleto.
- Admin de reservas sem contexto rico da trip.
- Home ainda sem todas as seções previstas.

### Em aberto
- RBAC real.
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

---

## 4) Ordem de implementação

### Fase 1 — Segurança e contrato

**Objetivo**
Garantir acesso controlado ao portal e padronizar contratos de dados.

**Entregas**
- Proteger rotas `/admin/*` no frontend de forma consistente.
- Introduzir proteção também no backend para endpoints sensíveis.
- Definir fluxo de autenticação mais sólido para uso administrativo.
- Padronizar payloads de `trip` e `reservation` para consumo do portal.

**Dependências**
- `auth` existente.
- estrutura de login/cadastro já disponível.

**Critério de aceite**
- Usuário sem sessão não acessa área admin.
- Endpoints sensíveis exigem autenticação.
- Respostas da API têm formato estável e previsível.

---

### Fase 2 — Reserva operacional

**Objetivo**
Transformar a reserva em um fluxo útil para operação diária.

**Entregas**
- Enriquecer listagem de reservas com dados da trip.
- Incluir ponto de embarque no fluxo e no admin.
- Normalizar exibição de status e metadados da reserva.
- Validar consumo de capacidade por trip.

**Dependências**
- contratos de trip/reservation mais ricos.
- modelo de `TripBoardingPoint`.

**Critério de aceite**
- O admin consegue operar reservas sem depender de lookup manual.
- Cada reserva exibe contexto suficiente para atendimento.
- Capacidade fica coerente com confirmações/cancelamentos.

---

### Fase 3 — Lista de passageiros

**Objetivo**
Criar a base operacional do dia do evento.

**Entregas**
- Implementar lista de passageiros por trip/evento.
- Permitir leitura por status de reserva.
- Preparar suporte para check-in.
- Estruturar visão compatível com uso mobile no campo.

**Dependências**
- reservas enriquecidas.
- relacionamento estável entre trip e reserva.

**Critério de aceite**
- A operação consegue abrir uma trip e ver quem está vinculado a ela.
- A lista serve para conferência e uso em evento.

---

### Fase 4 — Histórico e auditoria

**Objetivo**
Registrar o ciclo de vida da reserva e das ações operacionais.

**Entregas**
- Histórico de status de reserva.
- Trilhas de alteração relevantes.
- Preparação para `audit_logs`.

**Dependências**
- fluxo de update de status consolidado.

**Critério de aceite**
- Alterações relevantes ficam rastreáveis.
- A operação consegue entender a evolução da reserva.

---

### Fase 5 — Notificações

**Objetivo**
Reduzir trabalho manual de comunicação.

**Entregas**
- E-mails para pré-reserva.
- E-mails para confirmação/pagamento.
- Base para templates de comunicação.

**Dependências**
- contratos de reserva estáveis.
- estrutura de envio/integração definida.

**Critério de aceite**
- Eventos principais geram comunicação automática ou semi-automática.

---

### Fase 6 — Produto público

**Objetivo**
Completar a face pública com melhor conversão.

**Entregas**
- Home com as seções previstas no escopo.
- Página `/trips/[slug]` com conteúdo completo.
- Página `/reserva/[slug]` com todos os campos obrigatórios.
- CTA recorrente e consistente.

**Dependências**
- mocks bem estruturados em `lib/data`.
- componentes reutilizáveis.

**Critério de aceite**
- O fluxo público cobre descoberta, decisão e pré-reserva sem lacunas.

---

## 5) Backlog priorizado

### Alta prioridade
1. Proteger `/admin/*`.
2. Enriquecer payload de reservas com dados da trip.
3. Implementar lista de passageiros por evento.

### Prioridade média
4. Histórico de status.
5. Notificações por e-mail.
6. Ajustar capacidade e sold out.

### Prioridade de produto
7. Completar Home.
8. Completar página de trip.
9. Completar formulário de reserva.

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


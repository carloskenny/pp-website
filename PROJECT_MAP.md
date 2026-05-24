# PROJECT MAP — Pés do Paraná

Documento de referência para desenho completo do projeto:

- site público mobile-first;
- portal de operação (web);
- gestão de eventos/trips, reservas, usuários e listas de passageiros.

---

## 1) Visão do produto

### Canais
- **Site público**: aquisição e conversão (landing, agenda, páginas de trip, reserva).
- **Portal operacional (web)**: gestão interna (eventos, reservas, passageiros, status e comunicação).

### Objetivos de negócio
- Reduzir operação manual em WhatsApp/Instagram.
- Padronizar fluxo de reserva e confirmação.
- Centralizar dados de passageiros por evento.
- Dar previsibilidade operacional (capacidade, pagamentos pendentes, no-shows).

---

## 2) Escopo funcional completo

## 2.1 Site público (mobile-first)
- Home com seções de conversão.
- Agenda de trips com filtros.
- Página de trip (`/trips/[slug]`).
- Fluxo de pré-reserva (`/reserva/[slug]`).
- CTA WhatsApp configurável (global e por evento).

## 2.2 Portal web (admin/operação)
- Login e controle de acesso por perfil.
- Gestão de eventos/trips (CRUD + status).
- Gestão de reservas.
- Gestão de usuários operacionais.
- Lista de passageiros por evento (exportação e check-in).
- Painel com indicadores operacionais.

## 2.3 Mobile operacional
Não faz parte do escopo. Toda operação será feita via portal web responsivo.

---

## 3) Domínios e módulos (DDD pragmático)

### Core domains
- **Trips**: evento, roteiro, capacidade, preço, pontos de embarque.
- **Reservations**: pré-reserva, confirmação, cancelamento, status de pagamento.
- **Passengers**: dados do participante, vínculo com reserva e evento.
- **Operations**: listas, check-in, comunicação, observações de campo.

### Supporting domains
- **Auth & Users**: login, perfis, permissões.
- **Notifications**: e-mail e templates de comunicação.
- **Media**: imagem principal/galeria das trips.
- **Audit**: trilha de alterações relevantes.

---

## 4) Arquitetura técnica alvo

## 4.1 Estrutura geral
- **Frontend público**: `Next.js` (App Router, SSR/ISR, mobile-first).
- **Backend**: `NestJS` modular (REST API).
- **Banco**: `PostgreSQL`.
- **Cache e fila (fase 2+)**: Redis/BullMQ para jobs e notificações.

## 4.2 Deploy lógico
- `web` (Next) expõe páginas públicas e portal (com áreas protegidas).
- `app` (Nest) centraliza regras de negócio e acesso ao banco.
- `db` (Postgres) persiste dados transacionais.

## 4.3 Estratégia de cliente
- Portal administrativo em Next responsivo, com foco em uso no celular (mobile-first).

---

## 5) Modelo de dados (visão inicial)

Entidades principais:
- `users`
- `roles`
- `user_roles`
- `trips`
- `trip_boarding_points`
- `trip_gallery_items`
- `reservations`
- `passengers` (ou participante acoplado à reserva na fase inicial)
- `reservation_status_history`
- `checkins`
- `audit_logs`

Enums sugeridos:
- `TripStatus`: `draft | active | sold_out | finished | inactive`
- `ReservationStatus`: `pending | payment_pending | confirmed | canceled`

---

## 6) Permissões e perfis

Perfis iniciais:
- `super_admin`: controle total.
- `admin_operacao`: gerencia eventos, reservas e passageiros.
- `guia`: acesso a listas e check-in no dia da trip.
- `atendimento` (opcional): foco em reservas e comunicação.

Modelo recomendado:
- RBAC no Nest (guards + decorators).
- Rotas do portal protegidas por sessão/JWT.

---

## 7) Fluxos críticos

## 7.1 Reserva
1. Usuário escolhe trip.
2. Preenche formulário.
3. Sistema cria reserva `pending`.
4. Operação avalia e envia link de pagamento.
5. Reserva muda para `payment_pending`/`confirmed`.
6. Passageiro entra na lista final do evento.

## 7.2 Operação do evento
1. Operação abre lista de passageiros por trip/data.
2. Guia faz check-in no mobile/web.
3. Status e observações ficam registrados.

## 7.3 Gestão de capacidade
1. Reserva confirmada consome vaga.
2. Ao atingir limite, trip vai para `sold_out`.
3. Cancelamentos liberam vaga.

---

## 8) Roadmap de implementação

## Fase 1 — Fundação (agora)
- Estrutura Next + Nest + Postgres.
- Home + páginas de trip + reserva.
- API básica de trips e reservas (mock -> DB).
- Admin simples de eventos e reservas.

## Fase 2 — Operação
- Lista de passageiros por evento.
- Histórico de status de reserva.
- Notificações por e-mail.
- Dashboard operacional básico.

## Fase 3 — Mobilidade e escala
- Melhorias de segurança/auditoria.
- Jobs assíncronos (fila), se necessário.

---

## 9) Backlog técnico inicial (prioridade)

1. Criar módulos Nest: `auth`, `trips`, `reservations`, `users`.
2. Definir schema/migrations no Postgres.
3. Implementar contratos DTO e validação.
4. Integrar Next com API (substituir mocks).
5. Criar área `/admin` com guardas de autenticação.
6. Implementar lista de passageiros por trip.
7. Adicionar histórico de mudanças de status.

---

## 10) Critérios de qualidade

- Mobile-first real no site e no portal.
- Tipagem forte ponta a ponta.
- Sem hardcode de negócio em componentes.
- Logs e erros padronizados no backend.
- Fluxos críticos cobertos por testes de serviço (Nest).

---

## 11) Decisões atuais

- Site + portal ficam no `web` (Next) na fase inicial.
- Backend centralizado no `app` (Nest).
- Banco único Postgres.
- Node LTS 24 para app/web.
- Postgres 18-alpine em configuração compatível 18+.
- Sem app mobile nativo/PWA no escopo atual.

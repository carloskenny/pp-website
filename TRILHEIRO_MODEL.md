# TRILHEIRO MODEL — Pés do Paraná

Documento de referência para separar o cadastro do cliente final do cadastro de usuários internos.

Base:
- `PROJECT_MAP.md`
- `IMPLEMENTATION_PLAN.md`
- estado atual de `app/` e `web/`

---

## 1) Decisão de domínio

O projeto deve tratar **trilheiro** como entidade própria, separada de `User`.

### Separação correta
- `User` = equipe interna, admin, parceiro, operação.
- `Trilheiro` = cliente final, participante, comprador.

### Motivo
- O trilheiro não precisa de permissão administrativa.
- O trilheiro pode começar sem senha.
- O trilheiro precisa existir mesmo sem login.
- O histórico comercial dele precisa ficar ligado às reservas, não ao painel admin.

---

## 2) Objetivo funcional

O trilheiro deve poder:
- fazer um cadastro mínimo para compra/pagamento;
- concluir ou complementar o cadastro depois;
- consultar reservas e trips confirmadas por e-mail;
- receber um acesso leve por e-mail, sem senha obrigatória no início;
- ser usado pela operação para lista de passageiros, conferência e comunicação.

---

## 3) Modelo de dados proposto

### 3.1 `Trilheiro`
Entidade principal do cliente final.

Campos sugeridos:
- `id`
- `fullName`
- `email`
- `phone`
- `documentNumber` ou `cpf`
- `birthDate`
- `avatarUrl`
- `status`
- `registrationStep`
- `preferences`
- `createdAt`
- `updatedAt`
- `lastAccessAt`

### 3.2 `TrilheiroStatus`
Enum sugerido:
- `INCOMPLETE`
- `ACTIVE`
- `BLOCKED`
- `ARCHIVED`

### 3.3 `RegistrationStep`
Enum sugerido:
- `minimal`
- `contact`
- `identity`
- `complete`

### 3.4 `Reservation`
Já existente no backend. Deve passar a apontar para `Trilheiro`.

Campos adicionais/revisados:
- `trilheiroId`
- `tripId`
- `boardingPointId`
- `status`
- `paymentStatus` se necessário na fase seguinte
- `createdAt`
- `updatedAt`

### 3.5 `TrilheiroAccessGrant`
Entidade opcional para login leve por e-mail.

Campos sugeridos:
- `id`
- `trilheiroId`
- `email`
- `tokenHash`
- `expiresAt`
- `consumedAt`
- `createdAt`

Uso:
- magic link;
- código de acesso;
- recuperação de acesso;
- consulta de reservas.

### 3.6 `TrilheiroProfileCompletion`
Opcional, se quiser rastrear o progresso do cadastro.

Campos sugeridos:
- `id`
- `trilheiroId`
- `step`
- `completedAt`
- `metadata`

---

## 4) Relacionamentos

### Relação principal
- `Trilheiro 1 -> N Reservation`
- uma pessoa pode ter várias reservas ao longo do tempo.

### Relação com trips
- `Reservation N -> 1 Trip`
- a listagem operacional vem de `Reservation`, não de `Trilheiro` diretamente.

### Acesso
- `Trilheiro` não substitui `User`.
- `Trilheiro` pode ter `AccessGrant`, mas não precisa ter senha.

---

## 5) Fluxo de negócio

### 5.1 Pré-reserva
1. Pessoa abre `/reserva/[slug]`.
2. Informa dados mínimos.
3. Sistema cria ou localiza `Trilheiro` pelo e-mail.
4. Sistema cria `Reservation` com status inicial.
5. Operação confirma manualmente ou envia link de pagamento.

### 5.2 Pagamento
1. Reserva avança para `payment_pending` ou `confirmed`.
2. Se confirmado, o trilheiro entra na lista operacional.
3. A reserva passa a ser exibida em consultas do cliente.

### 5.3 Complemento de cadastro
1. Após a primeira compra, o sistema pede completar dados faltantes.
2. O trilheiro preenche telefone, CPF, nascimento, avatar, etc.
3. O cadastro passa para `complete`.

### 5.4 Acesso por e-mail
1. Trilheiro solicita acesso.
2. Sistema envia magic link ou código.
3. O acesso abre área restrita do cliente.
4. Ele consulta trips confirmadas e reservas.

---

## 6) Estratégia de autenticação do trilheiro

Recomendação:
- evitar senha no primeiro momento;
- usar **magic link** por e-mail;
- opcionalmente, adicionar senha depois como recurso secundário.

### Vantagens
- menos fricção;
- mais alinhado ao comportamento do público;
- reduz suporte para recuperação de senha;
- simplifica o primeiro cadastro.

### Sessão
- o acesso do trilheiro pode usar token curto de uso único;
- a área do cliente pode usar cookie httpOnly ou token temporário;
- não deve compartilhar o mesmo fluxo de auth do admin.

---

## 7) Modelo de APIs sugerido

### Público
- `POST /reservations`
- `POST /trilheiros/access/request`
- `POST /trilheiros/access/confirm`
- `GET /me/reservations`
- `GET /me/trips`
- `PATCH /me/profile`

### Operação
- `GET /admin/trilheiros`
- `GET /admin/trilheiros/:id`
- `PATCH /admin/trilheiros/:id`
- `PATCH /admin/trilheiros/:id/status`
- `GET /admin/trilheiros/:id/reservations`

---

## 8) Fluxo de implementação recomendado

### Fase 1 — Persistência mínima
- criar `Trilheiro`;
- relacionar com `Reservation`;
- migrar reserva para aceitar trilheiro;
- manter cadastro mínimo no checkout.

### Fase 2 — Cadastro pós-compra
- criar endpoint de complemento de cadastro;
- permitir editar perfil do trilheiro;
- salvar progresso do cadastro.

### Fase 3 — Acesso por e-mail
- criar magic link;
- criar sessão do cliente;
- criar área “Minhas reservas”.

### Fase 4 — Operação
- listar trilheiros por trip;
- listar trilheiro por reserva;
- permitir busca e atualização operacional.

### Fase 5 — Evolução
- histórico de acesso;
- comunicação automatizada;
- check-in e presença;
- documentos adicionais.

---

## 9) Regras de produto

- trilheiro não é usuário admin;
- trilheiro pode existir sem senha;
- trilheiro deve ser encontrado por e-mail;
- reserva é a unidade operacional principal;
- acesso por e-mail deve ser simples;
- o fluxo inicial deve priorizar conversão e baixa fricção.

---

## 10) Critério de aceite

A modelagem está correta quando:
- um cliente pode reservar sem virar usuário do sistema;
- o mesmo e-mail reaproveita o cadastro do trilheiro;
- a operação vê reservas vinculadas ao trilheiro;
- o trilheiro pode completar cadastro depois;
- o trilheiro pode acessar suas reservas por e-mail;
- o admin continua separado do cliente final.


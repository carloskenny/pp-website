# ROADMAP — Pés do Paraná

Documento operacional para orientar o que ainda falta implementar no projeto.

Base de referência:
- `PROJECT_MAP.md`
- `IMPLEMENTATION_PLAN.md`
- `TRILHEIRO_MODEL.md`
- `README.md`
- estado atual de `app/` e `web/`

---

## 1) Objetivo deste roadmap

Consolidar as próximas entregas em ordem prática, com foco em:

- operação real do portal administrativo;
- jornada do trilheiro/cliente final;
- conversão e clareza do site público;
- redução de esforço manual no dia a dia.

---

## 2) Estado atual resumido

### Já consolidado
- Autenticação interna do admin.
- Proteção de rotas administrativas no frontend.
- Base de usuários internos separada de trilheiros.
- Persistência de trilheiro e vínculo com reservas.
- Infra Docker, Prisma e seeds padronizados.
- Frontend admin com shell, perfil e configurações.

### Ainda em evolução
- Área do trilheiro/cliente final.
- Fluxo completo de consulta por e-mail.
- Reserva com UX mais forte e mais campos úteis.
- Operação de passageiros por trip/evento.
- Notificações automáticas.
- Revisão final de conteúdo e fidelidade visual.

---

## 3) Roadmap por prioridade

### Fase 1 — Jornada do trilheiro

**Objetivo**
Fechar o fluxo do cliente final sem misturar com o admin.

**Entregas**
- Tela/fluxo de consulta por e-mail.
- Complemento de cadastro do trilheiro.
- Página “Minhas reservas”.
- Recuperação de acesso por magic link.
- Atualização de perfil do trilheiro.

**Critério de aceite**
- O mesmo e-mail reaproveita o cadastro do trilheiro.
- O cliente consegue consultar reservas e trips confirmadas.
- O fluxo inicial funciona sem senha obrigatória.

---

### Fase 2 — Reserva operacional

**Objetivo**
Tornar a reserva mais confiável para operação.

**Entregas**
- Revisar o formulário de `/reserva/[slug]`.
- Validar ponto de embarque com a trip.
- Melhorar feedback de envio e estados de pré-reserva.
- Exibir contexto completo da trip no admin de reservas.
- Garantir consistência de capacidade e status.

**Critério de aceite**
- O atendimento consegue operar sem lookup manual.
- A reserva já nasce com contexto suficiente.

---

### Fase 3 — Passageiros por evento

**Objetivo**
Criar a base operacional para o dia do rolê.

**Entregas**
- Lista de passageiros por trip.
- Filtros por status de reserva.
- Visão mobile-friendly para conferência em campo.
- Base para check-in futuro.

**Critério de aceite**
- A operação abre uma trip e vê quem está vinculado a ela.
- A lista serve para conferência prática.

---

### Fase 4 — Comunicação

**Objetivo**
Reduzir trabalho manual com mensagens repetidas.

**Entregas**
- E-mail de pré-reserva.
- E-mail de confirmação.
- E-mail de acesso do trilheiro.
- Base para templates e disparos futuros.

**Critério de aceite**
- Eventos relevantes passam a gerar comunicação consistente.

---

### Fase 5 — Produto público

**Objetivo**
Fechar a experiência de descoberta e conversão.

**Entregas**
- Home com seções completas.
- Página de trip com conteúdo mais robusto.
- FAQ e provas sociais mais claras.
- Melhorias visuais e de hierarquia.
- CTA consistente em mobile.

**Critério de aceite**
- O site público apresenta descoberta, decisão e reserva sem lacunas.

---

### Fase 6 — Base técnica

**Objetivo**
Preparar o projeto para crescer sem refatoração brusca.

**Entregas**
- Ajustar contratos e tipos compartilhados.
- Cobrir fluxos principais com testes.
- Melhorar validações de domínio.
- Preparar fila/jobs se a comunicação crescer.
- Revisar auditoria e histórico quando necessário.

**Critério de aceite**
- O projeto segue estável ao adicionar novas features.

---

## 4) Sequência recomendada

1. Jornada do trilheiro.
2. Reserva operacional.
3. Lista de passageiros.
4. Comunicação.
5. Produto público.
6. Base técnica e reforço de qualidade.

---

## 5) Fora de escopo agora

- app mobile nativo.
- PWA dedicado.
- automação completa de pagamento.
- integração profunda com múltiplos provedores.
- autenticação complexa multi-perfil para o cliente final.

---

## 6) Regra de execução

Antes de iniciar uma nova frente:

- fechar a anterior com critério de aceite claro;
- manter mudanças pequenas;
- preservar compatibilidade com o modelo atual;
- não misturar trilheiro e usuário interno;
- não expandir escopo sem necessidade operacional.


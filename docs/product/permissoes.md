# Permissões

## Perfis

- `super_admin`
- `admin_operacao`
- `guia`
- `atendimento`

## Regras

- `super_admin`: controle total.
- `admin_operacao`: gerencia eventos, reservas e participantes.
- `guia`: acesso a listas e check-in no dia do evento.
- `atendimento`: foco em reservas e comunicação.

## Implementação

- RBAC no Nest com guards e decorators.
- Rotas administrativas protegidas no frontend.


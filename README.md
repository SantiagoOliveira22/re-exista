# re-exista

Portal de indicação de profissionais voltado à comunidade **LGBTQIAPN+**. Permite buscar profissionais por categoria, localização e filtros, com painel administrativo para gestão de conteúdo.

## Stack

| Camada | Tecnologia |
|--------|------------|
| Frontend | Next.js 15 (App Router), React 19, TypeScript |
| Estilo | Tailwind CSS 4, shadcn/ui |
| Backend | Server Actions, API Routes |
| Banco | PostgreSQL + Drizzle ORM |
| Auth | Better Auth (e-mail/senha) |
| E-mail | Resend (recuperação de senha) |
| Validação | Zod + React Hook Form |

## Pré-requisitos

- Node.js 20+
- PostgreSQL 14+
- npm

## Instalação

```bash
git clone <url-do-repositorio>
cd re-exista
npm install
cp .env.example .env
```

Preencha o `.env` com suas credenciais (veja [Variáveis de ambiente](#variáveis-de-ambiente)).

### Banco de dados

```bash
npx drizzle-kit push   # cria/atualiza tabelas
npm run seed           # dados iniciais (opcional, modo seguro)
```

### Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

> Se a porta 3000 estiver ocupada, encerre o processo anterior ou use outra porta com `npm run dev -- -p 3001`.

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Servidor de produção (após build) |
| `npm run lint` | ESLint |
| `npm run seed` | Insere categorias/profissionais padrão **sem apagar** dados existentes |
| `npm run seed:reset` | Apaga tudo e recria dados padrão (pede confirmação) |

## Variáveis de ambiente

Copie `.env.example` para `.env`:

```env
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=http://localhost:3000
ADMIN_ACCESS_KEY=...
RESEND_API_KEY=...
RESEND_FROM_EMAIL=...
```

| Variável | Uso |
|----------|-----|
| `DATABASE_URL` | Conexão PostgreSQL |
| `BETTER_AUTH_SECRET` | Segredo de sessão |
| `BETTER_AUTH_URL` | URL base da aplicação |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | URL base usada pelo cliente Better Auth |
| `ADMIN_ACCESS_KEY` | Chave do link de acesso admin |
| `RESEND_API_KEY` | Envio de e-mails |
| `RESEND_FROM_EMAIL` | Remetente dos e-mails |

## Autenticação e admin

O acesso administrativo usa **dois níveis**:

1. **Cookie `admin_access`** — obtido via link secreto  
2. **Sessão Better Auth** — login com e-mail e senha

### Entrar como admin

```
/authentication?key=SUA_ADMIN_ACCESS_KEY
```

Após validar a chave, crie a conta e faça login. Funções admin (editar, excluir, criar) só aparecem com **cookie admin + sessão** ativos.

### Recuperar senha

1. Acesse `/authentication?key=SUA_ADMIN_ACCESS_KEY` e clique em **Esqueci a senha**
2. Informe o e-mail da conta admin cadastrada
3. Abra o link recebido por e-mail (válido por 1 hora)
4. Defina a nova senha na página de redefinição
5. Entre novamente pelo link de acesso admin com a nova senha

**Desenvolvimento / localhost:** se o e-mail não puder ser enviado (remetente inválido, sandbox do Resend etc.), o link de redefinição é impresso no terminal do servidor.

**Produção:** configure `RESEND_FROM_EMAIL` com um domínio verificado no [Resend](https://resend.com/domains). Não use Gmail/Hotmail como remetente.

### Rotas protegidas

| Rota | Proteção |
|------|----------|
| `/authentication` | Chave admin ou cookie `admin_access` |
| `/authentication/forgot-password` | Público (fluxo de recuperação) |
| `/authentication/reset-password` | Público (link do e-mail) |
| `/admin/*` | Sessão Better Auth |
| `/professional-form` | Sessão Better Auth |

## Funcionalidades

### Público

- Home com categorias principais
- Listagem de profissionais com filtros (categoria, estado, cidade, plano, online, busca)
- Página **Outras categorias** (`/outras-categorias`) para categorias adicionais
- FAQ, contato e páginas legais

### Admin

- CRUD de categorias e profissionais
- CRUD de perguntas frequentes
- Gestão de mensagens de contato
- Mover profissionais entre categorias

### Categorias

- **Principais** (home): Barbearia, Consultoria Financeira, Saúde, Tatuagem, Outros Serviços
- **Secundárias** (criadas pelo admin): exibidas em `/outras-categorias` e no footer
- **Outros Serviços** sempre aparece por último na ordenação

## Estrutura do projeto

```
src/
├── app/                    # Rotas (App Router)
│   ├── professionalList/   # Listagem pública + ações admin
│   ├── outras-categorias/  # Categorias adicionais
│   ├── admin/              # Painel admin
│   ├── authentication/     # Login e cadastro
│   └── api/                # API Routes
├── actions/                # Server Actions
├── components/             # Componentes compartilhados
├── db/                     # Schema Drizzle, seed, conexão
└── lib/                    # Auth, utilitários, helpers
drizzle/                    # Migrations
public/icons/               # Ícones de categorias (upload admin)
docs/                       # Documentação complementar
```

## Deploy

Consulte o guia completo em **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)**.

Resumo:

1. Configure variáveis de ambiente no provedor
2. `npx drizzle-kit push` no banco de produção
3. `npm run build` + deploy
4. Crie conta admin via link com `ADMIN_ACCESS_KEY`
5. **Não** rode `seed:reset` em produção com dados reais

## Boas práticas

- Faça backup do banco antes de migrations ou seeds destrutivos
- Mantenha `ADMIN_ACCESS_KEY` e `BETTER_AUTH_SECRET` em local seguro
- Em produção, configure Resend com domínio verificado
- Ícones uploadados em `public/icons/` podem ser perdidos em deploy serverless — considere storage externo no futuro

## Licença

Projeto privado — todos os direitos reservados.

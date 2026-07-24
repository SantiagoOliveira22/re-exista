# Deploy — re-exista

Guia objetivo para publicar e manter a aplicação em produção.

## Ambiente atual (produção)

| Item | Detalhe |
|------|---------|
| **Hospedagem** | [Vercel](https://vercel.com) |
| **Repositório** | [github.com/SantiagoOliveira22/re-exista](https://github.com/SantiagoOliveira22/re-exista) |
| **Domínio principal** | [https://www.re-exista.com](https://www.re-exista.com) |
| **Redirecionamento** | `https://re-exista.com` → `https://www.re-exista.com` |
| **Banco de dados** | PostgreSQL ([Neon](https://neon.tech)) |
| **DNS** | HostGator (registros apontando para a Vercel) |
| **Deploy** | Automático a cada push na branch `main` |

A aplicação está publicada na Vercel com domínio customizado do cliente. O DNS é gerenciado na **HostGator**, com registros **A** e **CNAME** conforme instruções exibidas no painel da Vercel (Settings → Domains).

## Checklist pré-deploy

- [ ] Testes locais concluídos (`npm run build` sem erros)
- [ ] Banco PostgreSQL provisionado (Neon)
- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] Schema aplicado no banco de produção (`npx drizzle-kit push`)
- [ ] Domínio customizado validado na Vercel
- [ ] DNS configurado na HostGator
- [ ] Conta admin criada
- [ ] Resend configurado com domínio verificado (e-mails de senha)

## Variáveis de ambiente (produção)

Configure no painel da Vercel: **Project → Settings → Environment Variables**.

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `DATABASE_URL` | Sim | Connection string PostgreSQL (Neon) |
| `BETTER_AUTH_SECRET` | Sim | Segredo para sessões (32+ bytes aleatórios) |
| `BETTER_AUTH_URL` | Sim | URL pública do site |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Sim | URL pública usada pelo cliente Better Auth |
| `ADMIN_ACCESS_KEY` | Sim | Chave do link de acesso admin |
| `RESEND_API_KEY` | Recomendada | API key do Resend |
| `RESEND_FROM_EMAIL` | Recomendada | Remetente verificado no Resend |

Exemplo para o ambiente atual:

```env
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=https://www.re-exista.com
NEXT_PUBLIC_BETTER_AUTH_URL=https://www.re-exista.com
ADMIN_ACCESS_KEY=...
RESEND_API_KEY=...
RESEND_FROM_EMAIL=re-exista <noreply@re-exista.com>
```

Gere um segredo seguro:

```bash
openssl rand -base64 32
```

> Após alterar variáveis de ambiente na Vercel, faça **Redeploy** (Deployments → ⋯ → Redeploy).

## Banco de dados

### 1. Aplicar schema (primeira vez ou após mudanças)

Com `DATABASE_URL` apontando para o banco de produção:

```bash
npx drizzle-kit push
```

Ou, se preferir migrations versionadas:

```bash
npx drizzle-kit migrate
```

### 2. Seed inicial (opcional)

Apenas na **primeira instalação** ou em ambiente de teste:

```bash
npm run seed
```

> **Atenção:** `npm run seed:reset` apaga todos os profissionais e categorias antes de recriar os dados padrão. **Não use em produção** com dados reais.

## Deploy na Vercel

### Configuração inicial

1. Conecte o repositório Git à Vercel
2. Framework preset: **Next.js**
3. Configure as variáveis de ambiente (veja tabela acima)
4. Use PostgreSQL externo via Neon (`DATABASE_URL`)
5. Faça o primeiro deploy

### Domínio customizado

1. Na Vercel: **Settings → Domains**
2. Adicione `re-exista.com` e `www.re-exista.com`
3. Configure o DNS na **HostGator** com os registros indicados pela Vercel:
   - **A** `@` → IP fornecido pela Vercel
   - **CNAME** `www` → host fornecido pela Vercel (ex.: `*.vercel-dns.com`)
4. Aguarde a propagação e confirme status **Valid** na Vercel
5. Defina `www.re-exista.com` como domínio principal (redirect de apex para `www`)

### Deploy contínuo

A cada push na branch `main`, a Vercel executa build e deploy automaticamente:

```bash
git push origin main
```

Para validar localmente antes do push:

```bash
npm ci
npm run build
```

## Primeiro acesso admin em produção

1. Acesse: `https://www.re-exista.com/authentication?key=SUA_ADMIN_ACCESS_KEY`
2. Crie a conta (sign-up só funciona com cookie `admin_access` válido)
3. Faça login
4. Gerencie profissionais, categorias e mensagens de contato

O cookie `admin_access` expira em **1 hora**. A sessão Better Auth persiste conforme configuração padrão da biblioteca.

## Upload de ícones de categorias

- **Desenvolvimento local:** ícones podem ser salvos em `public/icons/`
- **Produção (Vercel):** ícones enviados pelo admin são armazenados como **data URL** no banco de dados (filesystem serverless é efêmero)

Não é necessário storage externo (S3, Blob etc.) para o funcionamento atual.

## Monitoramento pós-deploy

| Página | URL |
|--------|-----|
| Home | `https://www.re-exista.com` |
| Listagem pública | `https://www.re-exista.com/professionalList` |
| Categorias extras | `https://www.re-exista.com/outras-categorias` |
| Mensagens admin | `https://www.re-exista.com/admin/mensagens` |
| Contato | `https://www.re-exista.com/contato` |
| Termos de uso | `https://www.re-exista.com/termos-de-uso` |
| Política de privacidade | `https://www.re-exista.com/politica-de-privacidade` |

## Rollback

- Mantenha backup do banco antes de migrations ou seeds destrutivos
- Na Vercel: **Deployments →** selecione um deploy anterior → **Promote to Production**
- Use tags/releases no Git para reverter código quando necessário

## Troubleshooting

| Problema | Verificação |
|----------|-------------|
| Login/cadastro falha no domínio customizado | `BETTER_AUTH_URL` e `NEXT_PUBLIC_BETTER_AUTH_URL` devem ser `https://www.re-exista.com` + redeploy |
| Rotas admin redirecionam para login | Cookie de sessão em HTTPS usa prefixo `__Secure-`; confirme middleware atualizado |
| Ícones de categoria não aparecem após upload | Em produção, ícones ficam no banco (data URL), não em `public/icons/` |
| Build falha na Vercel | Confirme `DATABASE_URL` e versão do Next.js compatível |

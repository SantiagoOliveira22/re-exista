# Deploy — re-exista

Guia objetivo para publicar a aplicação em produção.

## Checklist pré-deploy

- [ ] Testes locais concluídos (`npm run build` sem erros)
- [ ] Banco PostgreSQL provisionado (Neon, Supabase, Railway, etc.)
- [ ] Variáveis de ambiente configuradas no provedor
- [ ] Migrations aplicadas no banco de produção
- [ ] Conta admin criada
- [ ] Domínio e HTTPS configurados
- [ ] Resend configurado com domínio verificado (e-mails de senha)

## Variáveis de ambiente (produção)

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `DATABASE_URL` | Sim | Connection string PostgreSQL |
| `BETTER_AUTH_SECRET` | Sim | Segredo para sessões (32+ bytes aleatórios) |
| `BETTER_AUTH_URL` | Sim | URL pública do site (`https://seudominio.com`) |
| `ADMIN_ACCESS_KEY` | Sim | Chave do link de acesso admin |
| `RESEND_API_KEY` | Recomendada | API key do Resend |
| `RESEND_FROM_EMAIL` | Recomendada | Remetente verificado no Resend |

Gere um segredo seguro:

```bash
openssl rand -base64 32
```

## Banco de dados

### 1. Aplicar schema (primeira vez)

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

## Build e start

```bash
npm ci
npm run build
npm run start
```

## Deploy na Vercel (recomendado)

1. Conecte o repositório Git à Vercel
2. Configure as variáveis de ambiente no painel
3. Use PostgreSQL externo (`DATABASE_URL`)
4. Framework preset: **Next.js**
5. Após o deploy, acesse `/authentication?key=SUA_ADMIN_ACCESS_KEY` para criar a conta admin

## Primeiro acesso admin em produção

1. Acesse: `https://seudominio.com/authentication?key=SUA_ADMIN_ACCESS_KEY`
2. Crie a conta (sign-up só funciona com cookie `admin_access` válido)
3. Faça login
4. Gerencie profissionais, categorias e mensagens de contato

O cookie `admin_access` expira em **1 hora**. A sessão Better Auth persiste conforme configuração padrão da biblioteca.

## Upload de ícones de categorias

Ícones enviados pelo admin são salvos em `public/icons/`. Em ambientes serverless (Vercel), o filesystem é **efêmero** — uploads podem ser perdidos após redeploy.

**Soluções para produção:**
- Migrar uploads para S3, Cloudinary ou Vercel Blob
- Ou garantir que ícones padrão estejam versionados em `public/icons/`

## Monitoramento pós-deploy

- Listagem pública: `/professionalList`
- Categorias extras: `/outras-categorias`
- Mensagens admin: `/admin/mensagens`
- Contato: `/contato`

## Rollback

- Mantenha backup do banco antes de migrations ou seeds destrutivos
- Use tags/releases no Git para reverter deploy de código

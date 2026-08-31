# GuilhWines

Catálogo de vinhos em Next.js com Supabase e painel administrativo próprio.

## Stack
- Next.js App Router
- Supabase (Postgres + Auth + RLS)
- Vercel

## Supabase
Projeto: `GuilhWines` (`bfvkhxshqdonbgnnlxxy`), totalmente separado do Carine Turismo.

Para produção, configure no Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=https://bfvkhxshqdonbgnnlxxy.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_pUdgToHwbtvPV7wo_95Bpw_D2xs1cm2
```

## Liberar um administrador
1. Crie o usuário em Authentication > Users no Supabase GuilhWines.
2. Copie o UUID do usuário.
3. Insira esse UUID na tabela `public.admin_users`.
4. Acesse `/admin` e faça login.

## Desenvolvimento
```bash
npm install
npm run dev
```

# KNLTC Website (Next.js 15)

Production-ready Next.js 15 App Router project with TypeScript and Tailwind CSS.

## Added modules

- Public **Store** (`/store`, `/store/[slug]`)
- Public **Blog** (`/blog`, `/blog/[slug]`)
- Protected **Admin panel** (`/admin/*`) for products, posts, categories, and uploads

## Environment variables

Copy `.env.example` to `.env.local` and fill values:

```bash
cp .env.example .env.local
```

Required:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`

## Supabase setup

1. Create a Supabase project.
2. Run SQL from `supabase/migrations/001_knltc_cms.sql` in the SQL editor.
3. Create a public storage bucket (default name: `knltc-media`).
4. Configure storage policy to allow public reads.

## Run locally

- `npm install`
- `npm run dev`

## Scripts

- `npm run dev` - start development server
- `npm run build` - create production build
- `npm run start` - run production server
- `npm run lint` - lint source
- `npm run test` - run tests

## Deployment (Vercel)

- Add all env vars in the Vercel project settings.
- Redeploy after env updates.
- Ensure Supabase URL/keys are for production project.
- Admin login uses `ADMIN_EMAIL` + `ADMIN_PASSWORD` and signs the `knltc_admin_session` cookie with `ADMIN_SESSION_SECRET`.

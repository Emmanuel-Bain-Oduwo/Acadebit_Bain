# Acadebit — Kenya's Complete School Operating System

Kenya's first all-in-one school OS. CBC-aligned, M-Pesa integrated, offline-first. 8 portals, 17 modules, 155+ features.

## Project Structure

```
Acadebit_Bain/
├── frontend/          # Next.js 14 app — deploy to Vercel
└── backend/           # Express + TypeScript API — deploy to Railway
```

## Frontend — Vercel

1. Import the repo into [Vercel](https://vercel.com)
2. Set **Root Directory** to `frontend`
3. Add environment variable: `NEXT_PUBLIC_API_URL=https://your-backend.railway.app`
4. Deploy

## Backend — Railway

1. Create a new project on [Railway](https://railway.app)
2. Connect this repo, set **Root Directory** to `backend`
3. Add a **PostgreSQL** service and copy the `DATABASE_URL`
4. Add all variables from `backend/.env.example`
5. Run the schema: paste `backend/src/config/schema.sql` into the Railway DB query console
6. Deploy — Railway auto-detects `railway.toml`

## Tech Stack

| Layer | Stack |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Zustand, Recharts |
| Backend | Node.js, Express, TypeScript, PostgreSQL |
| Payments | M-Pesa Daraja API (STK Push) |
| Auth | JWT |
| Frontend deploy | Vercel |
| Backend deploy | Railway |

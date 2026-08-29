# Noirly Admin

Premium portfolio CMS for managing dynamic content on [noirly-portfolio](../portfolio). Content is stored in **MongoDB** and media uploads go to **Cloudflare R2**.

## Features

- Dashboard for profile, projects, experience, skills, and **theme**
- Image uploads to Cloudflare R2 when API keys are set; otherwise stored in MongoDB and served from `/api/media/...`
- Public read API for the portfolio site (`GET /api/public/content`)
- Password-protected admin session (JWT cookie)
- Dark gold Noirly design system

## Setup

1. Copy environment variables:

```bash
cp .env.example .env
```

2. Configure:

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `ADMIN_PASSWORD` | Admin login password |
| `ADMIN_SESSION_SECRET` | JWT signing secret (optional; falls back to password) |
| `R2_BUCKET_NAME` | R2 bucket name |
| `R2_PUBLIC_URL` | Public CDN URL for R2-hosted assets |
| `R2_ACCOUNT_ID` | Cloudflare account ID (optional — only for direct R2 uploads) |
| `R2_ACCESS_KEY_ID` | R2 API token access key (optional — only for direct R2 uploads) |
| `R2_SECRET_ACCESS_KEY` | R2 API token secret (optional — only for direct R2 uploads) |
| `PORTFOLIO_ORIGIN` | Allowed CORS origins (comma-separated) |

3. Seed the database with current portfolio content:

```bash
npm run seed
```

4. Start the dev server (default port 3000; use 3001 if portfolio uses 3000):

```bash
npm run dev -- -p 3001
```

## Portfolio integration

In the portfolio project, set:

```env
PORTFOLIO_CONTENT_API_URL=http://localhost:3001
```

The portfolio will fetch content from the admin API and fall back to static `data/` files if the API is unavailable.

## API

| Endpoint | Auth | Description |
|----------|------|-------------|
| `GET /api/public/content` | None | Full portfolio payload for the live site |
| `PUT /api/admin/profile` | Session | Update profile |
| `GET/POST /api/admin/projects` | Session | List/create projects |
| `PUT/DELETE /api/admin/projects/:id` | Session | Update/delete project |
| `GET/PUT /api/admin/theme` | Session | List themes / set portfolio palette |
| `POST /api/admin/upload` | Session | Upload image (multipart `file` + optional `folder`) |

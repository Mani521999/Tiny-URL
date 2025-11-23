# TinyLink Backend

Node.js + Express backend for the TinyLink URL shortener.

## Features

- Create short links with optional custom codes
- Global code uniqueness enforced at database level
- 302 redirects with click tracking and last-clicked timestamps
- CRUD-style JSON API
- Health check endpoint for uptime and readiness checks

## Getting Started

```bash
cd backend
cp .env.example .env
# Edit .env with your Neon DATABASE_URL, CORS_ORIGIN, etc.
npm install

# Run database migration (from your local machine or Neon SQL console)
psql "$DATABASE_URL" -f db/migrations/001_init.sql

# Start dev server
npm run dev
```

The server will listen on `PORT` (default `5000`).

## API Endpoints

- `GET /healthz` – health check (`{ "ok": true, "version": "1.0" }`)
- `POST /api/links` – create a short link
- `GET /api/links` – list all links
- `GET /api/links/:code` – get stats for one link
- `DELETE /api/links/:code` – delete a link
- `GET /:code` – redirect to original URL (302 or 404)

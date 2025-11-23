# TinyLink – Video Walkthrough Script

You can use this as a script or outline for a 5–10 minute video walkthrough.

---

## 1. Introduction (30–60s)

- Introduce the project: "TinyLink is a production-ready URL shortener built as a
  full-stack take-home assignment."
- Mention tech stack:
  - Backend: Node.js, Express, PostgreSQL (Neon)
  - Frontend: React, Tailwind CSS
  - Hosting targets: Vercel (frontend), Render/Railway (backend), Neon DB.

---

## 2. High-level Architecture (1–2 min)

- Show the repo structure:

  - `/backend` – REST API and redirect
  - `/frontend` – React SPA for dashboard and stats

- Explain separation of concerns:
  - Backend exposes a small, well-defined API.
  - Frontend consumes API and handles all UX.
- Explain how redirect works:
  - Browser hits `https://your-backend/:code`
  - Backend looks up the code, increments click count, and returns `302`.

---

## 3. Database & Schema (1–2 min)

- Explain using Neon PostgreSQL free tier.
- Open `backend/db/migrations/001_init.sql` and describe:

  - `links` table:
    - `id` (UUID)
    - `code` (6–8 chars, unique)
    - `url` (TEXT)
    - `click_count` (INTEGER, default 0)
    - `created_at` (TIMESTAMPTZ, default now)
    - `last_clicked_at` (TIMESTAMPTZ, nullable)

- Mention `pgcrypto` extension for UUID generation.
- Emphasize that code uniqueness is enforced at DB level (unique constraint).

---

## 4. Backend Implementation (2–3 min)

- Open `backend/src/app.js`:

  - Show Express app setup
  - CORS with `CORS_ORIGIN`
  - JSON body parsing
  - Route mounting:
    - `/healthz` → healthRouter
    - `/api/links` → linksRouter
    - `/` → redirectRouter for `/:code` redirects
  - Error handling middleware

- Open `backend/src/routes/links.js`:

  - Show request validation:
    - URL validation helper
    - Code format regex `[A-Za-z0-9]{6,8}`
  - `POST /api/links`:
    - Validates input
    - Generates random code if missing
    - Handles 409 conflicts when code already exists
  - `GET /api/links`:
    - Lists all links, ordered by `created_at`
  - `GET /api/links/:code`:
    - Returns stats for a single code, or `404` if missing
  - `DELETE /api/links/:code`:
    - Hard deletes records, returns `200` or `404`

- Open `backend/src/routes/redirect.js`:

  - Explain `GET /:code`:
    - Finds code
    - Updates `click_count` + `last_clicked_at`
    - Issues `302` redirect

- Show `backend/src/routes/health.js`:

  - `GET /healthz` returns `{ ok: true, version: "1.0" }`.

---

## 5. Frontend Implementation (2–3 min)

- Open `frontend/src/App.jsx`:

  - Show `react-router-dom` routes:
    - `/` → Dashboard
    - `/code/:code` → Stats page

- Open `frontend/src/pages/Dashboard.jsx`:

  - Explain:
    - Fetching list of links on mount
    - Handling loading, error, and empty states
    - Plugs into `LinkForm` and `LinksTable`

- Open `frontend/src/components/LinkForm.jsx`:

  - Show form state:
    - URL + optional code
    - Real-time validation
    - Disabled submit while loading
  - Show success confirmation after creating link.

- Open `frontend/src/components/LinksTable.jsx`:

  - Columns:
    - Short code
    - Target URL (truncated)
    - Total clicks
    - Last clicked time
  - Actions:
    - Copy short URL to clipboard
    - View stats
    - Delete link
  - Simple filter/search on code/URL.
  - Responsive behavior on narrow screens.

- Open `frontend/src/pages/LinkStats.jsx`:

  - Show loading, error, and success states.
  - Display stats cards for clicks, created at, last clicked.
  - Provide a link back to the dashboard.

---

## 6. Running Locally & Env Vars (1–2 min)

- Show `.env.example` in backend and frontend.
- Demonstrate copying them to `.env` and filling in values.
- Run:

  ```bash
  cd backend && npm run dev
  cd frontend && npm start
  ```

- Open `http://localhost:3000` and show the full flow:

  1. Create a new link.
  2. Copy the short URL.
  3. Open it in a new tab to trigger redirect.
  4. Refresh dashboard / stats page to see updated click count.

---

## 7. Deployment Overview (1–2 min)

- Briefly describe:

  - Backend to Render/Railway:
    - Point to `/backend`
    - Set env vars
  - Frontend to Vercel:
    - Point to `/frontend`
    - Set `REACT_APP_API_BASE_URL` to backend URL
    - Set `REACT_APP_APP_BASE_URL` to the backend redirect base URL

- Show how the same dashboard works with production URLs.

---

## 8. Closing (30s)

- Summarize:
  - Strict API conventions
  - Clear separation of backend/frontend
  - Production-ready features (redirect, click tracking, stats)
- Mention how the project can be extended:
  - Authentication, user accounts, custom domains, analytics, etc.

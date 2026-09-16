# Abdeldjalil Hani — Personal Portfolio & Admin Dashboard

A personal portfolio website for an AI/ML engineer, data scientist, and PhD researcher. Includes a public site and a full admin dashboard to manage content.

**Stack:** React · Vite · Express.js · Sequelize · MySQL

---

## Features

### Public site
- Single-page scrolling homepage: Hero, About, Research, Projects, Publications, Experience, Education, Teaching, Certifications, Events, Skills, Contact
- Detail pages for Projects, Publications, and Events
- Contact form storing messages in the database
- SEO-ready: semantic HTML, `robots.txt`, `sitemap.xml`, Open Graph metadata
- Fully responsive, no external CDNs or icon libraries

### Admin dashboard (`/admin`)
- JWT-based authentication
- Dashboard with stats and recent activity
- Full CRUD for: Projects, Publications, Experience, Education, Events, Teaching, Certifications, Skill categories/skills
- Contact message inbox (mark read/unread, delete)
- Site settings editor (profile, hero, about, social links)
- SEO/meta settings editor
- File uploads for images and PDFs

---

## Local Development

### 1. Prerequisites
- Node.js 18+
- MySQL running locally with a created database

### 2. Configure environment

```bash
cp .env.example .env
```

Set database credentials and a JWT secret in `.env`.

### 3. Server

```bash
cd server
npm install
node migrations/run.js   # creates tables
node seeds/seed.js       # admin user + default settings
npm run dev              # starts API on http://localhost:5000
```

### 4. Client

```bash
cd client
npm install
npm run dev              # Vite dev server on http://localhost:5173
```

Frontend requests to `/api/*` proxy to the backend in development.

### 5. Admin login

- URL: `http://localhost:5173/admin`
- Credentials printed by the seed script (default: `admin@example.com` / `ChangeMe123!`)

---

## Production Build

```bash
cd server && npm install --production
cd ../client && npm install && npm run build
node server/src/index.js   # NODE_ENV=production serves client/dist
```

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for detailed cPanel/Passenger instructions.

---

## Project Structure

```
portfolio/
├── client/              # React + Vite frontend
│   └── src/
│       ├── components/   # Shared + public + admin components
│       ├── pages/        # Public pages + admin pages + homepage sections
│       ├── styles/       # Global CSS (public + admin)
│       ├── api/          # API client (public/auth/admin)
│       ├── context/      # Auth context
│       └── utils/        # Helpers
└── server/              # Express + Sequelize backend
    ├── src/
    │   ├── controllers/
    │   ├── models/
    │   ├── routes/
    │   ├── middleware/
    │   ├── config/
    │   └── index.js
    ├── migrations/
    ├── seeds/
    └── src/uploads/      # User-uploaded files (auto-created)
```

---

## Environment Variables

See `.env.example` for the full list. Key ones:

| Variable | Purpose |
|----------|---------|
| `DB_*` | MySQL connection |
| `JWT_SECRET` | Token signing secret (keep random & long) |
| `SITE_URL` | Public base URL (sitemap/canonical) |
| `PUBLIC_URL` | Absolute URL prefix for uploaded files |
| `NODE_ENV` | `development` / `production` |
| `PORT` | API port |
| `COOKIE_SECURE` | `true` when serving over HTTPS |

---

## Scripts

| Location | Script | Purpose |
|----------|--------|---------|
| `server/` | `npm run dev` | Run API with auto-reload |
| `server/` | `npm start` | Run API |
| `server/` | `node migrations/run.js` | Create/update tables |
| `server/` | `node seeds/seed.js` | Seed admin + defaults (`--reset` to wipe) |
| `client/` | `npm run dev` | Vite dev server |
| `client/` | `npm run build` | Production bundle → `client/dist/` |
| `client/` | `npm run preview` | Preview production build |

---

## Notes

- All content is **editable placeholder** — add real content via the admin dashboard.
- Contact messages are stored in the database; no third-party email API required.
- Uploaded files live in `server/src/uploads/` and are served from `/uploads/*`.
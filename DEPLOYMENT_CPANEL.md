# Deployment Guide — cPanel Shared Hosting (Node.js)

**Stack:** React 18 + Vite 5 (frontend) · Node.js + Express 4 (backend) · MySQL + Sequelize 6

**Environment:** cPanel "Setup Node.js App" with **Node.js 24.20.0** (Passenger)

> Local development is unaffected by this guide. The scripts and defaults in
> `package.json` and `.env.example` are safe to keep — only production values
> are changed here.

---

## 1. Overview

The project is split into two folders:

| Folder    | Contents                                   |
|-----------|--------------------------------------------|
| `server/` | Express API, Sequelize models, migrations, uploads, and the **built** frontend (`server/../client/dist`) |
| `client/` | React + Vite frontend source               |

In production the Express server **also serves the built React app** (`client/dist`)
from the same origin, so there is exactly **one Passenger app and one URL**. The
server already includes an SPA fallback that sends every non-`/api`, non-`/uploads`
request to `index.html`, so React Router deep links (`/admin`, `/project/:slug`,
`/event/:id`) work with **no `.htaccess` required** for this setup.

---

## 2. Requirements

- Node.js 24.20.0 (available under **Setup Node.js App** — the version shown there)
- MySQL (create via **MySQL® Databases** in cPanel)
- A domain / subdomain pointing at your hosting
- SSH, Git, or File Manager upload access

---

## 3. MySQL setup

1. cPanel → **MySQL® Databases**
2. Create a database, e.g. `youruser_portfolio`
3. Create a user, e.g. `youruser_dbuser`, and add it to the database with **ALL PRIVILEGES**
4. Note these four values — they go into the environment:
   - Host (usually `localhost` or `127.0.0.1` on cPanel)
   - Database name
   - User
   - Password

> cPanel MySQL host is typically `localhost`/`127.0.0.1`. The app reads
> `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` from the environment.

---

## 4. Upload the code

Upload the whole project (with `client/`, `server/`, `.env.example`, etc.) to a
folder in your home directory, e.g. `~/portfolio/`.

Make sure `node_modules/`, `.env`, `.env.*` and `client/dist/` are **not** uploaded
(or simply omit them — they are regenerated/configured on the server).

---

## 5. Backend setup (server/)

### 5.1 Install dependencies

```bash
cd ~/portfolio/server
npm install --production
```

> No DB client binaries are needed — `mysql2` is a pure-JS driver.

### 5.2 Environment file

```bash
cp .env.example .env
```

Required variables (placeholders only in `.env.example` — put real values in `.env`):

| Variable        | Purpose                                                        |
|-----------------|----------------------------------------------------------------|
| `DB_HOST`       | MySQL host (`localhost` or `127.0.0.1`)                        |
| `DB_PORT`       | MySQL port (default `3306`)                                    |
| `DB_NAME`       | Database name, e.g. `youruser_portfolio`                       |
| `DB_USER`       | Database user, e.g. `youruser_dbuser`                          |
| `DB_PASSWORD`   | Database password                                              |
| `JWT_SECRET`    | Long random string (generate: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`) |
| `NODE_ENV`      | `production`                                                   |
| `PORT`          | Port for the Node app (Passenger normally provides this; a fallback exists) |
| `SITE_URL`      | https://yourdomain.com — used for sitemap/canonical URLs       |
| `PUBLIC_URL`    | https://yourdomain.com — absolute prefix for uploaded files    |
| `CLIENT_URL`    | https://yourdomain.com — allowed CORS origin (comma-separated list supported) |
| `COOKIE_SECURE` | `true` (page is served over HTTPS)                             |

Optional: `RATE_LIMIT_LOGIN`, `RATE_LIMIT_CONTACT`, `MAX_FILE_SIZE_MB`,
`JWT_EXPIRES_IN`, `COOKIE_NAME`, `DATABASE_URL`, `DB_SYNC`.

> `DB_SYNC` defaults to disabled in production. Use `node migrations/run.js`
> instead — it is non-destructive (never drops or forcibly alters data).

### 5.3 Run migrations

```bash
cd ~/portfolio/server
node migrations/run.js
```

This creates the tables from the Sequelize models if they do not exist yet. It is
safe to run repeatedly. Optionally seed the initial admin + defaults:

```bash
node seeds/seed.js    # ⚠ with --reset it wipes data — do NOT use --reset on the live DB
```

### 5.4 Uploads directory

Uploaded files live in `server/src/uploads/`. Subdirectories are created
automatically on first upload, but you can pre-create them:

```bash
mkdir -p ~/portfolio/server/src/uploads/misc
```

Ensure the folder (and the whole `server/` tree) is **writable by your cPanel
user** — it is by default for files/dirs you upload. The web server serves these
files at `/uploads/*`.

---

## 6. Frontend setup (client/)

### 6.1 Install dependencies

```bash
cd ~/portfolio/client
npm install
```

### 6.2 Build

```bash
npm run build
```

Output goes to `client/dist/`.

- Leave `VITE_API_URL` **empty** (recommended): the built app calls `/api` and
  `/uploads` at the same origin, which the Express server serves. No extra CORS
  or HTTPS link issues.
- If you deploy the frontend on a **different** origin than the API (Option B,
  section 8), set `VITE_API_URL` (see `client/.env.example`) **before** building:

```bash
VITE_API_URL=https://api.yourdomain.com npm run build
```

---

## 7. cPanel "Setup Node.js App" configuration

1. cPanel → **Setup Node.js App** → **Create Application**
2. Fill in:
   - **Node.js version:** 24.20.0 (the version offered by cPanel)
   - **Application mode:** `Production`
   - **Application root:** `portfolio/server` (as seen from your home dir)
   - **Application URL:** your domain / subdomain
   - **Application startup file:** `src/index.js`
3. Create the application, then **Restart** it.
4. Set the environment variables listed in section 5.2 either:
   - through the cPanel app's environment variable editor, **or**
   - in `~/portfolio/server/.env` (the app loads this automatically).

> The startup file `src/index.js` is exactly the `"start": "node src/index.js"`
> script. Passenger starts it directly and manages the process.

### Verify

Open `https://yourdomain.com` — the portfolio should load. Check `/admin` for the
admin login. `robots.txt` and `sitemap.xml` are generated automatically.

---

## 8. Alternative: frontend on static hosting + API on a subdomain

If you prefer serving `client/dist/` as a static site (e.g. in `public_html/`)
with the API on an API subdomain:

1. Build with `VITE_API_URL=https://api.yourdomain.com`.
2. Create the Node.js app (section 7) bound to the API subdomain with
   `CLIENT_URL=https://yourdomain.com`.
3. Upload `client/dist/` **contents** to `public_html/`.
4. Add an **SPA fallback** `.htaccess` in `public_html/` so React Router deep
   links (`/admin`, `/project/:slug`, `/event/:id`) work:

```apache
RewriteEngine On
RewriteBase /

# Do not rewrite existing files or directories (assets, uploads)
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# Send everything else to index.html (React Router handles routing)
RewriteRule ^ index.html [L]
```

5. Uploaded files are served from the API origin as `/uploads/*` (fully qualified
   URLs via `PUBLIC_URL`), so they keep working cross-origin.

---

## 9. Updating the application later

```bash
cd ~/portfolio

# 1. Pull new code (or re-upload via cPanel File Manager)
git pull            # if you deployed via git

# 2. Backend deps + env are already in place; re-run only if package.json changed
cd server && npm install --production

# 3. Run any new migrations (non-destructive)
node migrations/run.js

# 4. Rebuild the frontend
cd ../client && npm install && npm run build

# 5. Restart the Passenger app
# cPanel → Setup Node.js App → your app → Restart
```

The uploads directory and `.env` are never overwritten by a re-deploy as long as
you do not overwrite them when uploading/pulling.

---

## 10. Troubleshooting

| Symptom | Fix |
|---------|-----|
| `ER_ACCESS_DENIED` | Check `DB_HOST/DB_NAME/DB_USER/DB_PASSWORD` in the cPanel env var editor or `server/.env` |
| Blank page / 404 on refresh | `client/dist/` must exist and be built (section 6); then restart the app |
| `/admin` 404 | Confirm the SPA fallback is active (single-app mode needs nothing; static mode needs the `.htaccess`) |
| Uploads 404 | Files uploaded before via different host; check `PUBLIC_URL`. Ensure `server/src/uploads/` is writable |
| Auth/cookie not working cross-origin | `COOKIE_SECURE=true` over HTTPS, `CLIENT_URL` set to the exact frontend origin, `credentials: include` already configured |
| `JWT_SECRET` warning | Set a long random `JWT_SECRET` |
| Sitemap points to localhost | Set `SITE_URL=https://yourdomain.com` and restart |

---

## 11. Security checklist

- [ ] `JWT_SECRET` is a long random string
- [ ] `COOKIE_SECURE=true` in production
- [ ] `NODE_ENV=production`
- [ ] MySQL user has least privilege (no `DROP`/`GRANT` needed after setup)
- [ ] `.env` is **never** uploaded or committed (`.gitignore` covers it)
- [ ] Change the seeded admin password right after first login
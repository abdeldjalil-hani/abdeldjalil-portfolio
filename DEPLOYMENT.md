# Portfolio — Deployment Guide

**Stack:** React (Vite) frontend · Express.js + Sequelize backend · MySQL

---

## 1. Requirements

- Node.js 18+ (check with `node -v`)
- MySQL 5.7+ / 8.x
- cPanel with **Passenger** (Node.js app) or SSH access
- A domain/subdomain pointing to your hosting

---

## 2. Server Setup

### 2a. Create MySQL database

1. cPanel → **MySQL® Databases**
2. Create database: `youruser_portfolio`
3. Create database user, assign to database with **ALL PRIVILEGES**
4. Note: host, database name, user, password

### 2b. Upload files

Upload the entire `portfolio/` folder to your home directory (e.g. `~/portfolio/`).

### 2c. Install server dependencies

```bash
cd ~/portfolio/server
npm install --production
```

### 2d. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with real values:

```ini
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=youruser_portfolio
DB_USER=youruser_dbuser
DB_PASSWORD=your_actual_password

JWT_SECRET=generate_a_64_char_random_string_here
JWT_EXPIRES_IN=30d
COOKIE_SECURE=true

NODE_ENV=production
PORT=3000
SITE_URL=https://yourdomain.com
PUBLIC_URL=https://yourdomain.com

RATE_LIMIT_LOGIN=20
RATE_LIMIT_CONTACT=10
MAX_FILE_SIZE_MB=5
```

Generate a JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2e. Run migrations & seed

```bash
node migrations/run.js
node seeds/seed.js
```

### 2f. Ensure uploads directory

Upload directories are created automatically on first upload. To set them up in advance:

```bash
mkdir -p server/src/uploads/projects
mkdir -p server/src/uploads/profile
mkdir -p server/src/uploads/events
```

### 2g. Build client

```bash
cd ~/portfolio/client
npm install
npm run build
```

### 2h. Start server

Test locally first:
```bash
cd ~/portfolio/server
node src/index.js
```

Visit `http://localhost:3000` — you should see the portfolio.
Login at `/admin` with the seed credentials.

---

## 3. cPanel Passenger Setup

1. cPanel → **Setup Node.js App**
2. Create application:
   - Node.js version: 18+
   - Application mode: **Production**
   - Application root: `portfolio/server`
   - Application startup file: `src/index.js`
   - Click **Create**

3. Set environment variables in the Passenger config or `.env` file

---

## 4. First Login & Content Setup

1. Go to `https://yourdomain.com/admin`
2. Login with seed credentials (see `server/seeds/seed.js`)
3. **Change admin password** immediately via the API or seed script
4. Update Settings: name, bio, profile image, social links
5. Add Projects, Publications, Experience, Education, Events, Teaching, Certifications, Skills
6. Fill in Contact info

---

## 5. File Structure

```
portfolio/
├── client/               # React frontend
│   ├── src/              # Source code
│   ├── dist/             # Built output (served by server in production)
│   └── package.json
├── server/               # Express backend
│   ├── src/
│   │   ├── controllers/  # Route handlers
│   │   ├── models/       # Sequelize models
│   │   ├── routes/       # Express routes
│   │   ├── middleware/    # Auth, rate limit, upload, logger
│   │   ├── config/       # DB, env config
│   │   └── index.js      # Server entry point
│   ├── migrations/       # Table setup
│   ├── seeds/            # Default data
│   └── uploads/          # User-uploaded files (gitignored)
├── .env.example
├── .env                  # Your secrets (gitignored)
└── README.md
```

---

## 6. Troubleshooting

| Symptom | Fix |
|---------|-----|
| `ER_ACCESS_DENIED` | Check DB credentials in `.env` |
| `ENOENT: uploads` | Create `server/src/uploads/` (subdirs auto-create on first upload) |
| 404 on refresh | Ensure Passenger is running, `client/dist/` exists |
| Blank page | Run `cd client && npm run build`, restart server |
| `JWT_SECRET` warning | Add a strong random string to `.env` |

---

## 7. Security Checklist

- [ ] Change admin password from default
- [ ] Set `JWT_SECRET` to a strong random string (64+ chars)
- [ ] Set `COOKIE_SECURE=true` in production
- [ ] Ensure `.env` is not publicly accessible
- [ ] Set proper file permissions on `server/src/uploads/`
- [ ] Enable MySQL user least-privilege (only needed DB access)

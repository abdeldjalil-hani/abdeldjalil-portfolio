const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');

const config = require('./config/config');
const sequelize = require('./config/database');
const models = require('./models');
const requestLogger = require('./middleware/logger');
const { notFound, errorHandler } = require('./utils/apiError');

const app = express();

app.set('trust proxy', 1);

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'same-site' },
}));

const allowedOrigins = (process.env.CLIENT_URL || process.env.CORS_ORIGINS || process.env.SITE_URL || '').split(',').map((s) => s.trim()).filter(Boolean);
app.use(cors({
  origin(origin, cb) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(null, false);
  },
  credentials: true,
}));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(cookieParser());

if (config.env !== 'test') {
  app.use(requestLogger);
}

// ---- Static: uploaded files ----
app.use('/uploads', express.static(config.uploads.directory, {
  maxAge: process.env.NODE_ENV === 'production' ? '30d' : 0,
  index: false,
  fallthrough: true,
  setHeaders(res, filePath) {
    const ext = path.extname(filePath).toLowerCase();
    if (['.html', '.htm', '.svg', '.xml'].includes(ext)) {
      res.setHeader('X-Content-Type-Options', 'nosniff');
    }
    if (ext === '.svg') res.setHeader('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'");
  },
}));

// ---- API routes ----
const homeBundle = require('./controllers/dashboardController').homeBundle;
app.get('/api/bundle', homeBundle);

app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/publications', require('./routes/publications'));
app.use('/api/experiences', require('./routes/experiences'));
app.use('/api/education', require('./routes/education'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/events', require('./routes/events'));
app.use('/api/teaching', require('./routes/teaching'));
app.use('/api/certifications', require('./routes/certifications'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/social', require('./routes/social'));

// ---- SEO: robots.txt & sitemap.xml ----
app.get('/robots.txt', async (req, res) => {
  res.type('text/plain');
  let robots = '';
  try {
    const setting = await models.SiteSetting.findOne({ where: { name: 'robots_allow' } });
    const allow = setting?.value === 'true' || setting?.value === '1';
    robots = allow
      ? `User-agent: *
Allow: /
Disallow: /admin

Sitemap: ${config.siteUrl}/sitemap.xml
`
      : `User-agent: *
Disallow: /

Sitemap: ${config.siteUrl}/sitemap.xml
`;
  } catch {
    robots = `User-agent: *
Allow: /
Disallow: /admin

Sitemap: ${config.siteUrl}/sitemap.xml
`;
  }
  res.send(robots);
});

app.get('/sitemap.xml', async (req, res) => {
  try {
    const base = config.siteUrl.replace(/\/$/, '');
    const urls = [`${base}/`, `${base}/#about`, `${base}/#research`, `${base}/#projects`, `${base}/#publications`, `${base}/#experience`, `${base}/#education`, `${base}/#teaching`, `${base}/#events`, `${base}/#skills`, `${base}/#contact`];

    const [projects, publications, events] = await Promise.all([
      models.Project.findAll({ where: { isPublished: true }, attributes: ['slug', 'updatedAt'] }),
      models.Publication.findAll({ where: { isPublished: true }, attributes: ['id', 'updatedAt'] }),
      models.Event.findAll({ where: { isPublished: true }, attributes: ['id', 'updatedAt'] }),
    ]);

    for (const p of projects) urls.push(`${base}/project/${p.slug}`);
    for (const p of publications) urls.push(`${base}/publication/${p.id}`);
    for (const e of events) urls.push(`${base}/event/${e.id}`);

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${escapeXml(u)}</loc></url>`).join('\n')}
</urlset>`;

    res.type('application/xml');
    res.send(xml);
  } catch (err) {
    res.status(500).send('Unable to generate sitemap.');
  }
});

function escapeXml(str) {
  return str.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]));
}

// ---- Serve built React app (production) ----
const clientDist = path.resolve(__dirname, '..', '..', 'client', 'dist');
if (config.env === 'production' && fs.existsSync(clientDist)) {
  app.use(express.static(clientDist, { maxAge: '7d', index: 'index.html' }));
  app.get(/^(?!\/api|\/uploads).*/, (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.use('/api', notFound);
app.use('/uploads', (req, res) => res.status(404).json({ message: 'File not found.' }));
if (config.env !== 'production') {
  app.get('*', (req, res) => res.status(404).json({ message: 'API server is running. In production the React app is served from client/dist.' }));
}
app.use(errorHandler);

// ---- Boot ----
async function start() {
  try {
    await sequelize.authenticate();
    const sync = process.env.DB_SYNC === 'true' || config.env !== 'production';
    if (sync) {
      await sequelize.sync({ alter: false });
      console.log('[db] Tables ensured.');
    } else {
      console.log('[db] Connected (sync disabled).');
    }

    app.listen(config.port, () => {
      console.log(`[server] Listening on port ${config.port} (${config.env})`);
    });
  } catch (err) {
    console.error('[server] Failed to start:', err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  start();
}

module.exports = app;
const { SiteSetting } = require('../models');
const { apiError } = require('../utils/apiError');
const { publicFileUrl } = require('../utils/apiError');
const { cleanString, boolOr, validateUrl } = require('../utils/validation');

const KEY = 'name';
const VALUE = 'value';

const PUBLIC_SETTING_KEYS = [
  'name',
  'title_line_1',
  'title_line_2',
  'introduction',
  'about_text',
  'profile_image',
  'cv_url',
  'email',
  'hero_heading',
  'hero_subheading',
  'hero_introduction',
  'footer_about',
  'footer_text',
  'meta_title',
  'meta_description',
  'meta_keywords',
  'author_name',
  'og_image',
  'robots_allow',
  'resume_text',
  'reseach_summary',
  'research_summary',
];

const SOCIAL_SETTING_KEYS = [
  'email',
  'github',
  'linkedin',
  'instagram',
  'twitter',
  'website',
  'google_scholar',
  'orcid',
  'researchgate',
];

async function settingsMap(keys = null) {
  const where = keys ? { name: keys } : {};
  const rows = await SiteSetting.findAll({ where });
  const out = {};
  for (const row of rows) {
    out[row[KEY]] = row[VALUE];
  }
  return out;
}

async function getSettings(req, res, next) {
  try {
    const all = {}; // admin sees everything
    const rows = await SiteSetting.findAll();
    for (const row of rows) all[row[KEY]] = row[VALUE];
    res.json({ settings: all });
  } catch (err) {
    next(err);
  }
}

async function getPublicSettings(req, res, next) {
  try {
    const where = { name: [...PUBLIC_SETTING_KEYS, ...SOCIAL_SETTING_KEYS] };
    const rows = await SiteSetting.findAll({ where });
    const out = {};
    for (const row of rows) {
      let value = row[VALUE];
      if (row[KEY] === 'profile_image' && value && value.startsWith('/uploads/')) {
        value = publicFileUrl(value);
      }
      out[row[KEY]] = value;
    }
    res.json({ settings: out });
  } catch (err) {
    next(err);
  }
}

async function updateSettings(req, res, next) {
  try {
    const body = req.body || {};
    const keys = Object.keys(body);

    if (!keys.length) throw apiError(400, 'No settings provided.');

    const allowed = [...PUBLIC_SETTING_KEYS, ...SOCIAL_SETTING_KEYS];
    for (const key of keys) {
      if (!allowed.includes(key)) continue;

      let value = body[key];
      if (value === undefined || value === null) value = '';

      if (typeof value !== 'string') value = cleanString(String(value)) || '';

      if (key.includes('url') || key === 'website' || key === 'github' || key === 'linkedin') {
        if (value) value = validateUrl(value, key) || '';
      }

      const [row] = await SiteSetting.findOrCreate({ where: { name: key }, defaults: { name: key, value } });
      if (row[VALUE] !== value) {
        row[VALUE] = value;
        await row.save();
      }
    }

    res.json({ message: 'Settings updated.', settings: await settingsMap(allowed) });
  } catch (err) {
    next(err);
  }
}

module.exports = { getSettings, getPublicSettings, updateSettings, settingsMap };
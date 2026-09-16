const { SocialLink } = require('../models');
const { apiError } = require('../utils/apiError');
const { cleanString, validateUrl, boolOr, intOrNull } = require('../utils/validation');

function serialize(l) {
  return l.toJSON ? l.toJSON() : l;
}

async function listAll(req, res, next) {
  try {
    const rows = await SocialLink.findAll({
      where: { isPublished: true },
      order: [['sortOrder', 'ASC'], ['id', 'ASC']],
    });
    res.json({ socialLinks: rows.map(serialize) });
  } catch (err) {
    next(err);
  }
}

async function listAdmin(req, res, next) {
  try {
    const rows = await SocialLink.findAll({ order: [['sortOrder', 'ASC'], ['id', 'ASC']] });
    res.json({ socialLinks: rows.map(serialize) });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const body = req.body || {};
    const platform = cleanString(body.platform, 50);
    if (!platform) throw apiError(400, 'Platform is required.');
    const url = validateUrl(body.url, 'URL');
    if (!url) throw apiError(400, 'URL is required and must be a valid http(s) address.');

    const row = await SocialLink.create({
      platform,
      url,
      username: cleanString(body.username, 150) || null,
      icon: cleanString(body.icon, 80) || null,
      sortOrder: intOrNull(body.sortOrder) ?? 0,
      isPublished: boolOr(body.isPublished, true),
    });
    res.status(201).json({ socialLink: serialize(row) });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const row = await SocialLink.findByPk(req.params.id);
    if (!row) throw apiError(404, 'Social link not found.');
    const body = req.body || {};

    if (body.platform !== undefined) {
      const platform = cleanString(body.platform, 50);
      if (!platform) throw apiError(400, 'Platform is required.');
      row.platform = platform;
    }
    if (body.url !== undefined) {
      const url = validateUrl(body.url, 'URL');
      if (!url) throw apiError(400, 'URL is required and must be a valid http(s) address.');
      row.url = url;
    }
    if (body.username !== undefined) {
      row.username = cleanString(body.username, 150);
      if (!row.username) row.username = null;
    }
    if (body.icon !== undefined) {
      row.icon = cleanString(body.icon, 80);
      if (!row.icon) row.icon = null;
    }
    if (body.sortOrder !== undefined) row.sortOrder = intOrNull(body.sortOrder) ?? row.sortOrder;
    if (body.isPublished !== undefined) row.isPublished = boolOr(body.isPublished, row.isPublished);

    await row.save();
    res.json({ socialLink: serialize(row) });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const row = await SocialLink.findByPk(req.params.id);
    if (!row) throw apiError(404, 'Social link not found.');
    await row.destroy();
    res.json({ message: 'Social link deleted.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { listAll, listAdmin, create, update, remove };
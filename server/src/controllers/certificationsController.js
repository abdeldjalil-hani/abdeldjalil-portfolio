const { Certification } = require('../models');
const { apiError, publicFileUrl } = require('../utils/apiError');
const { cleanString, cleanOptionalString, cleanOptionalDate, boolOr, intOrNull } = require('../utils/validation');
const { pagination, paginatedResponse, buildSearch } = require('../utils/pagination');

const SEARCH_FIELDS = ['title', 'organization'];

function serialize(c) {
  const data = c.toJSON ? c.toJSON() : c;
  if (data.image) data.image = publicFileUrl(data.image);
  return data;
}

async function listAll(req, res, next) {
  try {
    const rows = await Certification.findAll({
      where: { isPublished: true },
      order: [['date', 'DESC'], ['sortOrder', 'ASC'], ['createdAt', 'DESC']],
      limit: 60,
    });
    res.json({ certifications: rows.map(serialize) });
  } catch (err) {
    next(err);
  }
}

async function listAdmin(req, res, next) {
  try {
    const { page, limit, offset } = pagination(req, 10, 100);
    const term = cleanOptionalString(req.query.q, 100);
    const where = {};
    if (term) Object.assign(where, buildSearch(term, SEARCH_FIELDS));

    const { rows, count } = await Certification.findAndCountAll({
      where,
      order: [['date', 'DESC'], ['sortOrder', 'ASC'], ['createdAt', 'DESC']],
      limit,
      offset,
    });
    res.json(paginatedResponse(rows.map(serialize), count, page, limit));
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const body = req.body || {};
    const title = cleanString(body.title, 300);
    const organization = cleanString(body.organization, 300);
    if (!title) throw apiError(400, 'Title is required.');
    if (!organization) throw apiError(400, 'Organization is required.');

    const row = await Certification.create({
      title,
      organization,
      date: cleanOptionalDate(body.date),
      credentialUrl: cleanOptionalString(body.credentialUrl, 500),
      description: cleanOptionalString(body.description, 60000),
      image: cleanOptionalString(body.image, 500),
      isPublished: boolOr(body.isPublished, true),
      sortOrder: intOrNull(body.sortOrder) ?? 0,
    });
    res.status(201).json({ certification: serialize(row) });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const row = await Certification.findByPk(req.params.id);
    if (!row) throw apiError(404, 'Certification not found.');
    const body = req.body || {};

    if (body.title !== undefined) {
      const t = cleanString(body.title, 300);
      if (!t) throw apiError(400, 'Title is required.');
      row.title = t;
    }
    if (body.organization !== undefined) {
      const o = cleanString(body.organization, 300);
      if (!o) throw apiError(400, 'Organization is required.');
      row.organization = o;
    }
    if (body.date !== undefined) row.date = cleanOptionalDate(body.date);
    if (body.credentialUrl !== undefined) row.credentialUrl = cleanOptionalString(body.credentialUrl, 500);
    if (body.description !== undefined) row.description = cleanOptionalString(body.description, 60000);
    if (body.image !== undefined) row.image = cleanOptionalString(body.image, 500);
    if (body.isPublished !== undefined) row.isPublished = boolOr(body.isPublished, row.isPublished);
    if (body.sortOrder !== undefined) row.sortOrder = intOrNull(body.sortOrder) ?? row.sortOrder;

    await row.save();
    res.json({ certification: serialize(row) });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const row = await Certification.findByPk(req.params.id);
    if (!row) throw apiError(404, 'Certification not found.');
    await row.destroy();
    res.json({ message: 'Certification deleted.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { listAll, listAdmin, create, update, remove };
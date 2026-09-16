const { Publication } = require('../models');
const { apiError } = require('../utils/apiError');
const { cleanString, cleanOptionalString, boolOr, intOrNull, parseTags, parseYear } = require('../utils/validation');
const { pagination, paginatedResponse, buildSearch } = require('../utils/pagination');

const SEARCH_FIELDS = ['title', 'authors', 'venue'];

const STATUSES = ['published', 'in_review', 'preprint', 'submitted'];

function serialize(p) {
  const data = p.toJSON ? p.toJSON() : p;
  if (data.tags && !Array.isArray(data.tags)) data.tags = parseTags(data.tags);
  return data;
}

async function listAll(req, res, next) {
  try {
    const where = { isPublished: true };
    if (req.query.year) where.year = parseInt(req.query.year, 10);
    const pubs = await Publication.findAll({
      where,
      order: [['year', 'DESC'], ['sortOrder', 'ASC'], ['createdAt', 'DESC']],
      limit: 100,
    });
    res.json({ publications: pubs.map(serialize) });
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const pub = await Publication.findOne({ where: { id: req.params.id, isPublished: true } });
    if (!pub) throw apiError(404, 'Publication not found.');
    res.json({ publication: serialize(pub) });
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
    if (req.query.year) where.year = parseInt(req.query.year, 10);
    if (req.query.status && STATUSES.includes(req.query.status)) where.status = req.query.status;
    if (req.query.featured === '1') where.isFeatured = true;

    const { rows, count } = await Publication.findAndCountAll({
      where,
      order: [['year', 'DESC'], ['sortOrder', 'ASC'], ['createdAt', 'DESC']],
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
    const title = cleanString(body.title, 500);
    const authors = cleanString(body.authors, 700);
    if (!title) throw apiError(400, 'Title is required.');
    if (!authors) throw apiError(400, 'Authors are required.');

    const pub = await Publication.create({
      title,
      authors,
      venue: cleanOptionalString(body.venue, 300),
      year: parseYear(body.year),
      abstract: cleanOptionalString(body.abstract, 60000),
      doi: cleanOptionalString(body.doi, 255),
      pdfUrl: cleanOptionalString(body.pdfUrl, 500),
      externalUrl: cleanOptionalString(body.externalUrl, 500),
      status: STATUSES.includes(body.status) ? body.status : 'published',
      tags: parseTags(body.tags),
      isFeatured: boolOr(body.isFeatured, false),
      isPublished: boolOr(body.isPublished, true),
      sortOrder: intOrNull(body.sortOrder) ?? 0,
    });
    res.status(201).json({ publication: serialize(pub) });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const pub = await Publication.findByPk(req.params.id);
    if (!pub) throw apiError(404, 'Publication not found.');
    const body = req.body || {};

    if (body.title !== undefined) {
      const t = cleanString(body.title, 500);
      if (!t) throw apiError(400, 'Title is required.');
      pub.title = t;
    }
    if (body.authors !== undefined) {
      const a = cleanString(body.authors, 700);
      if (!a) throw apiError(400, 'Authors are required.');
      pub.authors = a;
    }
    if (body.venue !== undefined) pub.venue = cleanOptionalString(body.venue, 300);
    if (body.year !== undefined) pub.year = parseYear(body.year);
    if (body.abstract !== undefined) pub.abstract = cleanOptionalString(body.abstract, 60000);
    if (body.doi !== undefined) pub.doi = cleanOptionalString(body.doi, 255);
    if (body.pdfUrl !== undefined) pub.pdfUrl = cleanOptionalString(body.pdfUrl, 500);
    if (body.externalUrl !== undefined) pub.externalUrl = cleanOptionalString(body.externalUrl, 500);
    if (body.status !== undefined) pub.status = STATUSES.includes(body.status) ? body.status : pub.status;
    if (body.tags !== undefined) pub.tags = parseTags(body.tags);
    if (body.isFeatured !== undefined) pub.isFeatured = boolOr(body.isFeatured, pub.isFeatured);
    if (body.isPublished !== undefined) pub.isPublished = boolOr(body.isPublished, pub.isPublished);
    if (body.sortOrder !== undefined) pub.sortOrder = intOrNull(body.sortOrder) ?? pub.sortOrder;

    await pub.save();
    res.json({ publication: serialize(pub) });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const pub = await Publication.findByPk(req.params.id);
    if (!pub) throw apiError(404, 'Publication not found.');
    await pub.destroy();
    res.json({ message: 'Publication deleted.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { listAll, getOne, listAdmin, create, update, remove };
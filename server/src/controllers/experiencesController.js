const { Experience } = require('../models');
const { apiError } = require('../utils/apiError');
const { cleanString, cleanOptionalString, cleanOptionalDate, boolOr, intOrNull, parseTags } = require('../utils/validation');
const { pagination, paginatedResponse, buildSearch } = require('../utils/pagination');

const SEARCH_FIELDS = ['position', 'organization', 'location'];
const TYPES = ['research', 'teaching', 'internship', 'professional', 'volunteer', 'other'];

function serialize(ex) {
  const data = ex.toJSON ? ex.toJSON() : ex;
  if (data.technologies && !Array.isArray(data.technologies)) data.technologies = parseTags(data.technologies);
  return data;
}

async function listAll(req, res, next) {
  try {
    const rows = await Experience.findAll({
      where: { isPublished: true },
      order: [['startDate', 'DESC'], ['sortOrder', 'ASC']],
      limit: 60,
    });
    res.json({ experiences: rows.map(serialize) });
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
    if (req.query.type && TYPES.includes(req.query.type)) where.type = req.query.type;

    const { rows, count } = await Experience.findAndCountAll({
      where,
      order: [['startDate', 'DESC'], ['sortOrder', 'ASC']],
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
    const position = cleanString(body.position, 255);
    const organization = cleanString(body.organization, 300);
    if (!position) throw apiError(400, 'Position is required.');
    if (!organization) throw apiError(400, 'Organization is required.');

    const exp = await Experience.create({
      position,
      organization,
      location: cleanOptionalString(body.location, 255),
      startDate: cleanOptionalDate(body.startDate),
      endDate: cleanOptionalDate(body.endDate),
      isCurrent: boolOr(body.isCurrent, false),
      description: cleanOptionalString(body.description, 60000),
      technologies: parseTags(body.technologies),
      type: TYPES.includes(body.type) ? body.type : 'professional',
      sortOrder: intOrNull(body.sortOrder) ?? 0,
      isPublished: boolOr(body.isPublished, true),
    });
    res.status(201).json({ experience: serialize(exp) });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const exp = await Experience.findByPk(req.params.id);
    if (!exp) throw apiError(404, 'Experience not found.');
    const body = req.body || {};

    if (body.position !== undefined) {
      const p = cleanString(body.position, 255);
      if (!p) throw apiError(400, 'Position is required.');
      exp.position = p;
    }
    if (body.organization !== undefined) {
      const o = cleanString(body.organization, 300);
      if (!o) throw apiError(400, 'Organization is required.');
      exp.organization = o;
    }
    if (body.location !== undefined) exp.location = cleanOptionalString(body.location, 255);
    if (body.startDate !== undefined) exp.startDate = cleanOptionalDate(body.startDate);
    if (body.endDate !== undefined) exp.endDate = cleanOptionalDate(body.endDate);
    if (body.isCurrent !== undefined) exp.isCurrent = boolOr(body.isCurrent, exp.isCurrent);
    if (body.description !== undefined) exp.description = cleanOptionalString(body.description, 60000);
    if (body.technologies !== undefined) exp.technologies = parseTags(body.technologies);
    if (body.type !== undefined) exp.type = TYPES.includes(body.type) ? body.type : exp.type;
    if (body.sortOrder !== undefined) exp.sortOrder = intOrNull(body.sortOrder) ?? exp.sortOrder;
    if (body.isPublished !== undefined) exp.isPublished = boolOr(body.isPublished, exp.isPublished);

    await exp.save();
    res.json({ experience: serialize(exp) });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const exp = await Experience.findByPk(req.params.id);
    if (!exp) throw apiError(404, 'Experience not found.');
    await exp.destroy();
    res.json({ message: 'Experience deleted.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { listAll, listAdmin, create, update, remove };
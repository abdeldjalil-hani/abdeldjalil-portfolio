const { Education } = require('../models');
const { apiError } = require('../utils/apiError');
const { cleanString, cleanOptionalString, cleanOptionalDate, boolOr, intOrNull } = require('../utils/validation');
const { pagination, paginatedResponse, buildSearch } = require('../utils/pagination');

const SEARCH_FIELDS = ['degree', 'institution', 'field'];

function serialize(ed) {
  return ed.toJSON ? ed.toJSON() : ed;
}

async function listAll(req, res, next) {
  try {
    const rows = await Education.findAll({
      where: { isPublished: true },
      order: [['startDate', 'DESC'], ['sortOrder', 'ASC']],
      limit: 30,
    });
    res.json({ education: rows.map(serialize) });
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

    const { rows, count } = await Education.findAndCountAll({
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
    const degree = cleanString(body.degree, 300);
    const institution = cleanString(body.institution, 300);
    if (!degree) throw apiError(400, 'Degree is required.');
    if (!institution) throw apiError(400, 'Institution is required.');

    const row = await Education.create({
      degree,
      institution,
      field: cleanOptionalString(body.field, 300),
      startDate: cleanOptionalDate(body.startDate),
      endDate: cleanOptionalDate(body.endDate),
      isCurrent: boolOr(body.isCurrent, false),
      description: cleanOptionalString(body.description, 60000),
      sortOrder: intOrNull(body.sortOrder) ?? 0,
      isPublished: boolOr(body.isPublished, true),
    });
    res.status(201).json({ education: serialize(row) });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const row = await Education.findByPk(req.params.id);
    if (!row) throw apiError(404, 'Education entry not found.');
    const body = req.body || {};

    if (body.degree !== undefined) {
      const d = cleanString(body.degree, 300);
      if (!d) throw apiError(400, 'Degree is required.');
      row.degree = d;
    }
    if (body.institution !== undefined) {
      const i = cleanString(body.institution, 300);
      if (!i) throw apiError(400, 'Institution is required.');
      row.institution = i;
    }
    if (body.field !== undefined) row.field = cleanOptionalString(body.field, 300);
    if (body.startDate !== undefined) row.startDate = cleanOptionalDate(body.startDate);
    if (body.endDate !== undefined) row.endDate = cleanOptionalDate(body.endDate);
    if (body.isCurrent !== undefined) row.isCurrent = boolOr(body.isCurrent, row.isCurrent);
    if (body.description !== undefined) row.description = cleanOptionalString(body.description, 60000);
    if (body.sortOrder !== undefined) row.sortOrder = intOrNull(body.sortOrder) ?? row.sortOrder;
    if (body.isPublished !== undefined) row.isPublished = boolOr(body.isPublished, row.isPublished);

    await row.save();
    res.json({ education: serialize(row) });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const row = await Education.findByPk(req.params.id);
    if (!row) throw apiError(404, 'Education entry not found.');
    await row.destroy();
    res.json({ message: 'Education entry deleted.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { listAll, listAdmin, create, update, remove };
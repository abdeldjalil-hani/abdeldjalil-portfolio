const { Event } = require('../models');
const { apiError, publicFileUrl } = require('../utils/apiError');
const { cleanString, cleanOptionalString, cleanOptionalDate, boolOr, intOrNull } = require('../utils/validation');
const { pagination, paginatedResponse, buildSearch } = require('../utils/pagination');

const SEARCH_FIELDS = ['title', 'location', 'eventType'];

function serialize(ev) {
  const data = ev.toJSON ? ev.toJSON() : ev;
  if (data.image) data.image = publicFileUrl(data.image);
  return data;
}

async function listAll(req, res, next) {
  try {
    const where = { isPublished: true };
    if (req.query.upcoming === '1') where.eventDate = { [require('sequelize').Op.gte]: new Date() };
    const rows = await Event.findAll({
      where,
      order: [['eventDate', 'DESC'], ['sortOrder', 'ASC'], ['createdAt', 'DESC']],
      limit: 60,
    });
    res.json({ events: rows.map(serialize) });
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const ev = await Event.findOne({ where: { id: req.params.id, isPublished: true } });
    if (!ev) throw apiError(404, 'Event not found.');
    res.json({ event: serialize(ev) });
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
    if (req.query.featured === '1') where.isFeatured = true;

    const { rows, count } = await Event.findAndCountAll({
      where,
      order: [['eventDate', 'DESC'], ['sortOrder', 'ASC'], ['createdAt', 'DESC']],
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
    if (!title) throw apiError(400, 'Title is required.');

    const ev = await Event.create({
      title,
      eventDate: cleanOptionalDate(body.eventDate),
      endDate: cleanOptionalDate(body.endDate),
      location: cleanOptionalString(body.location, 300),
      description: cleanOptionalString(body.description, 500),
      fullDescription: cleanOptionalString(body.fullDescription, 60000),
      image: cleanOptionalString(body.image, 500),
      externalUrl: cleanOptionalString(body.externalUrl, 500),
      eventType: cleanOptionalString(body.eventType, 100),
      isFeatured: boolOr(body.isFeatured, false),
      isPublished: boolOr(body.isPublished, true),
      sortOrder: intOrNull(body.sortOrder) ?? 0,
    });
    res.status(201).json({ event: serialize(ev) });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const ev = await Event.findByPk(req.params.id);
    if (!ev) throw apiError(404, 'Event not found.');
    const body = req.body || {};

    if (body.title !== undefined) {
      const t = cleanString(body.title, 300);
      if (!t) throw apiError(400, 'Title is required.');
      ev.title = t;
    }
    if (body.eventDate !== undefined) ev.eventDate = cleanOptionalDate(body.eventDate);
    if (body.endDate !== undefined) ev.endDate = cleanOptionalDate(body.endDate);
    if (body.location !== undefined) ev.location = cleanOptionalString(body.location, 300);
    if (body.description !== undefined) ev.description = cleanOptionalString(body.description, 500);
    if (body.fullDescription !== undefined) ev.fullDescription = cleanOptionalString(body.fullDescription, 60000);
    if (body.image !== undefined) ev.image = cleanOptionalString(body.image, 500);
    if (body.externalUrl !== undefined) ev.externalUrl = cleanOptionalString(body.externalUrl, 500);
    if (body.eventType !== undefined) ev.eventType = cleanOptionalString(body.eventType, 100);
    if (body.isFeatured !== undefined) ev.isFeatured = boolOr(body.isFeatured, ev.isFeatured);
    if (body.isPublished !== undefined) ev.isPublished = boolOr(body.isPublished, ev.isPublished);
    if (body.sortOrder !== undefined) ev.sortOrder = intOrNull(body.sortOrder) ?? ev.sortOrder;

    await ev.save();
    res.json({ event: serialize(ev) });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const ev = await Event.findByPk(req.params.id);
    if (!ev) throw apiError(404, 'Event not found.');
    await ev.destroy();
    res.json({ message: 'Event deleted.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { listAll, getOne, listAdmin, create, update, remove };
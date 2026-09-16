const { ContactMessage } = require('../models');
const { sanitizePlainText } = require('../utils/sanitize');
const { apiError } = require('../utils/apiError');
const { cleanString, validateEmail } = require('../utils/validation');
const { pagination, paginatedResponse, buildSearch } = require('../utils/pagination');

const SEARCH_FIELDS = ['name', 'email', 'subject', 'message'];

function serialize(m) {
  return m.toJSON ? m.toJSON() : m;
}

async function create(req, res, next) {
  try {
    const body = req.body || {};

    const name = sanitizePlainText(cleanString(body.name, 150));
    const subject = sanitizePlainText(cleanString(body.subject, 255));
    const message = sanitizePlainText(cleanString(body.message, 20000));
    const email = validateEmail(body.email);

    if (!name || name.length < 2) throw apiError(400, 'Please provide a name.');
    if (!subject || subject.length < 3) throw apiError(400, 'Please provide a subject.');
    if (!message || message.length < 10) throw apiError(400, 'Message must be at least 10 characters long.');

    const row = await ContactMessage.create({
      name,
      email,
      subject,
      message,
      ipAddress: req.ip ? String(req.ip).slice(0, 60) : null,
    });

    res.status(201).json({
      message: 'Your message has been sent successfully.',
      id: row.id,
    });
  } catch (err) {
    next(err);
  }
}

async function listAdmin(req, res, next) {
  try {
    const { page, limit, offset } = pagination(req, 10, 100);
    const term = cleanString(req.query.q, 100);
    const where = {};
    if (term) Object.assign(where, buildSearch(term, SEARCH_FIELDS));
    if (req.query.read === '0') where.isRead = false;
    if (req.query.read === '1') where.isRead = true;

    const { rows, count } = await ContactMessage.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });
    res.json(paginatedResponse(rows.map(serialize), count, page, limit));
  } catch (err) {
    next(err);
  }
}

async function markRead(req, res, next) {
  try {
    const row = await ContactMessage.findByPk(req.params.id);
    if (!row) throw apiError(404, 'Message not found.');
    row.isRead = true;
    await row.save();
    res.json({ message: 'Message marked as read.' });
  } catch (err) {
    next(err);
  }
}

async function markUnread(req, res, next) {
  try {
    const row = await ContactMessage.findByPk(req.params.id);
    if (!row) throw apiError(404, 'Message not found.');
    row.isRead = false;
    await row.save();
    res.json({ message: 'Message marked as unread.' });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const row = await ContactMessage.findByPk(req.params.id);
    if (!row) throw apiError(404, 'Message not found.');
    await row.destroy();
    res.json({ message: 'Message deleted.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { create, listAdmin, markRead, markUnread, remove };
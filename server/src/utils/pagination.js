const { Op } = require('sequelize');

/**
 * Parse pagination query params with sane defaults for shared hosting:
 * small page sizes, capped.
 */
function pagination(req, defaultLimit = 10, maxLimit = 100) {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(
    Math.max(1, parseInt(req.query.limit, 10) || defaultLimit),
    maxLimit
  );
  return { page, limit, offset: (page - 1) * limit };
}

function paginatedResponse(rows, count, page, limit) {
  return {
    data: rows,
    meta: {
      total: count,
      page,
      limit,
      pages: Math.max(1, Math.ceil(count / limit)),
    },
  };
}

function buildSearch(term, fields) {
  if (!term) return {};
  return {
    [Op.or]: fields.map((f) => ({ [f]: { [Op.like]: `%${term}%` } })),
  };
}

module.exports = { pagination, paginatedResponse, buildSearch };
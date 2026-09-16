const { Project } = require('../models');
const { apiError, publicFileUrl } = require('../utils/apiError');
const { cleanString, cleanOptionalString, boolOr, intOrNull, parseTags } = require('../utils/validation');
const { pagination, paginatedResponse, buildSearch } = require('../utils/pagination');
const slugify = require('slugify');

const SEARCH_FIELDS = ['title', 'shortDescription', 'category', 'categories'];

function serialize(p) {
  const data = p.toJSON ? p.toJSON() : p;
  if (data.image) data.image = publicFileUrl(data.image);
  if (Array.isArray(data.images)) {
    data.images = data.images.map((u) => publicFileUrl(u));
  } else {
    data.images = [];
  }
  if (data.technologies && !Array.isArray(data.technologies)) {
    data.technologies = parseTags(data.technologies);
  }
  if (!Array.isArray(data.categories)) {
    data.categories = [];
  }
  return data;
}

async function listAll(req, res, next) {
  try {
    const { slug } = req.query;
    if (slug) {
      const project = await Project.findOne({ where: { slug, isPublished: true } });
      if (!project) throw apiError(404, 'Project not found.');
      return res.json({ project: serialize(project) });
    }
    const projects = await Project.findAll({
      where: { isPublished: true },
      order: [['sortOrder', 'ASC'], ['createdAt', 'DESC']],
      limit: 60,
    });
    res.json({ projects: projects.map(serialize) });
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const project = await Project.findOne({
      where: { id: req.params.id, isPublished: true },
    });
    if (!project) throw apiError(404, 'Project not found.');
    res.json({ project: serialize(project) });
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
    if (req.query.published === '0') where.isPublished = false;

    const { rows, count } = await Project.findAndCountAll({
      where,
      order: [['sortOrder', 'ASC'], ['createdAt', 'DESC']],
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
    const title = cleanString(body.title, 255) || '';
    if (!title) throw apiError(400, 'Title is required.');

    const slug = body.slug
      ? cleanString(body.slug, 210) || slugify(title, { lower: true, strict: true, trim: true })
      : slugify(title, { lower: true, strict: true, trim: true });

    const existing = await Project.findOne({ where: { slug } });
    if (existing) throw apiError(400, 'A project with this slug already exists.');

    const project = await Project.create({
      title,
      slug,
      shortDescription: cleanOptionalString(body.shortDescription, 500),
      description: cleanOptionalString(body.description, 60000),
      image: cleanOptionalString(body.image, 500),
      images: Array.isArray(body.images) ? body.images.map((u) => cleanOptionalString(u, 500)).filter(Boolean) : [],
      technologies: parseTags(body.technologies),
      githubUrl: cleanOptionalString(body.githubUrl, 500),
      demoUrl: cleanOptionalString(body.demoUrl, 500),
      publicationUrl: cleanOptionalString(body.publicationUrl, 500),
      category: cleanOptionalString(body.category, 80),
      categories: Array.isArray(body.categories) ? body.categories.map((c) => cleanOptionalString(c, 80)).filter(Boolean) : [],
      isPublished: boolOr(body.isPublished, true),
      isFeatured: boolOr(body.isFeatured, false),
      sortOrder: intOrNull(body.sortOrder) ?? 0,
    });

    res.status(201).json({ project: serialize(project) });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) throw apiError(404, 'Project not found.');

    const body = req.body || {};
    let { slug } = project;
    if (body.slug !== undefined) {
      slug = cleanString(body.slug, 210) || slug;
      const conflict = await Project.findOne({ where: { slug, id: { [require('sequelize').Op.ne]: project.id } } });
      if (conflict) throw apiError(400, 'A project with this slug already exists.');
    }
    if (body.title !== undefined && cleanString(body.title, 255)) {
      project.title = cleanString(body.title, 255);
    }
    if (body.title === undefined && body.slug === undefined && !body.shortDescription && !body.description) {
      // cosmetic only
    }

    project.slug = slug;
    if (body.shortDescription !== undefined) project.shortDescription = cleanOptionalString(body.shortDescription, 500);
    if (body.description !== undefined) project.description = cleanOptionalString(body.description, 60000);
    if (body.image !== undefined) project.image = cleanOptionalString(body.image, 500);
    if (body.images !== undefined) project.images = Array.isArray(body.images) ? body.images.map((u) => cleanOptionalString(u, 500)).filter(Boolean) : [];
    if (body.technologies !== undefined) project.technologies = parseTags(body.technologies);
    if (body.githubUrl !== undefined) project.githubUrl = cleanOptionalString(body.githubUrl, 500);
    if (body.demoUrl !== undefined) project.demoUrl = cleanOptionalString(body.demoUrl, 500);
    if (body.publicationUrl !== undefined) project.publicationUrl = cleanOptionalString(body.publicationUrl, 500);
    if (body.category !== undefined) project.category = cleanOptionalString(body.category, 80);
    if (body.categories !== undefined) project.categories = Array.isArray(body.categories) ? body.categories.map((c) => cleanOptionalString(c, 80)).filter(Boolean) : [];
    if (body.isPublished !== undefined) project.isPublished = boolOr(body.isPublished, project.isPublished);
    if (body.isFeatured !== undefined) project.isFeatured = boolOr(body.isFeatured, project.isFeatured);
    if (body.sortOrder !== undefined) project.sortOrder = intOrNull(body.sortOrder) ?? project.sortOrder;

    await project.save();
    res.json({ project: serialize(project) });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) throw apiError(404, 'Project not found.');
    await project.destroy();
    res.json({ message: 'Project deleted.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { listAll, getOne, listAdmin, create, update, remove };
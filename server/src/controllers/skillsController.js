const { Skill, SkillCategory } = require('../models');
const { apiError } = require('../utils/apiError');
const { cleanString, cleanOptionalString, boolOr, intOrNull } = require('../utils/validation');

function serializeCategory(cat) {
  const data = cat.toJSON ? cat.toJSON() : cat;
  if (data.skills) {
    data.skills = data.skills
      .filter((s) => s.isPublished)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0) || b.level - a.level);
  }
  return data;
}

async function listAll(req, res, next) {
  try {
    const cats = await SkillCategory.findAll({
      order: [['sortOrder', 'ASC'], ['id', 'ASC']],
      include: [{ model: Skill, as: 'skills', where: { isPublished: true }, required: false }],
    });
    res.json({ skillCategories: cats.map(serializeCategory) });
  } catch (err) {
    next(err);
  }
}

async function listAdmin(req, res, next) {
  try {
    const cats = await SkillCategory.findAll({
      order: [['sortOrder', 'ASC'], ['id', 'ASC']],
      include: [{ model: Skill, as: 'skills', required: false }],
    });
    res.json({ skillCategories: cats.map(serializeCategory) });
  } catch (err) {
    next(err);
  }
}

async function createCategory(req, res, next) {
  try {
    const body = req.body || {};
    const name = cleanString(body.name, 100);
    if (!name) throw apiError(400, 'Category name is required.');

    const cat = await SkillCategory.create({
      name,
      icon: cleanOptionalString(body.icon, 80),
      sortOrder: intOrNull(body.sortOrder) ?? 0,
    });
    res.status(201).json({ skillCategory: cat });
  } catch (err) {
    next(err);
  }
}

async function updateCategory(req, res, next) {
  try {
    const cat = await SkillCategory.findByPk(req.params.id);
    if (!cat) throw apiError(404, 'Category not found.');
    const body = req.body || {};

    if (body.name !== undefined) {
      const name = cleanString(body.name, 100);
      if (!name) throw apiError(400, 'Category name is required.');
      const conflict = await SkillCategory.findOne({
        where: { name, id: { [require('sequelize').Op.ne]: cat.id } },
      });
      if (conflict) throw apiError(400, 'Category name already exists.');
      cat.name = name;
    }
    if (body.icon !== undefined) cat.icon = cleanOptionalString(body.icon, 80);
    if (body.sortOrder !== undefined) cat.sortOrder = intOrNull(body.sortOrder) ?? cat.sortOrder;

    await cat.save();
    res.json({ skillCategory: cat });
  } catch (err) {
    next(err);
  }
}

async function removeCategory(req, res, next) {
  try {
    const cat = await SkillCategory.findByPk(req.params.id);
    if (!cat) throw apiError(404, 'Category not found.');
    const skillCount = await Skill.count({ where: { categoryId: cat.id } });
    if (skillCount) throw apiError(400, 'Cannot delete a category that still contains skills.');
    await cat.destroy();
    res.json({ message: 'Category deleted.' });
  } catch (err) {
    next(err);
  }
}

async function createSkill(req, res, next) {
  try {
    const body = req.body || {};
    const name = cleanString(body.name, 120);
    const catId = intOrNull(body.categoryId);
    if (!name) throw apiError(400, 'Skill name is required.');
    if (!catId) throw apiError(400, 'categoryId is required.');

    const cat = await SkillCategory.findByPk(catId);
    if (!cat) throw apiError(400, 'Category does not exist.');

    const lvl = intOrNull(body.level);
    if (lvl !== null && (lvl < 1 || lvl > 5)) throw apiError(400, 'Level must be between 1 and 5.');

    const skill = await Skill.create({
      categoryId: catId,
      name,
      level: lvl,
      isPublished: boolOr(body.isPublished, true),
      sortOrder: intOrNull(body.sortOrder) ?? 0,
    });
    res.status(201).json({ skill });
  } catch (err) {
    next(err);
  }
}

async function updateSkill(req, res, next) {
  try {
    const skill = await Skill.findByPk(req.params.id);
    if (!skill) throw apiError(404, 'Skill not found.');
    const body = req.body || {};

    if (body.name !== undefined) {
      const name = cleanString(body.name, 120);
      if (!name) throw apiError(400, 'Skill name is required.');
      skill.name = name;
    }
    if (body.categoryId !== undefined) {
      const catId = intOrNull(body.categoryId);
      if (!catId) throw apiError(400, 'categoryId is required.');
      const cat = await SkillCategory.findByPk(catId);
      if (!cat) throw apiError(400, 'Category does not exist.');
      skill.categoryId = catId;
    }
    if (body.level !== undefined) {
      const lvl = intOrNull(body.level);
      if (lvl !== null && (lvl < 1 || lvl > 5)) throw apiError(400, 'Level must be between 1 and 5.');
      skill.level = lvl;
    }
    if (body.isPublished !== undefined) skill.isPublished = boolOr(body.isPublished, skill.isPublished);
    if (body.sortOrder !== undefined) skill.sortOrder = intOrNull(body.sortOrder) ?? skill.sortOrder;

    await skill.save();
    res.json({ skill });
  } catch (err) {
    next(err);
  }
}

async function removeSkill(req, res, next) {
  try {
    const skill = await Skill.findByPk(req.params.id);
    if (!skill) throw apiError(404, 'Skill not found.');
    await skill.destroy();
    res.json({ message: 'Skill deleted.' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listAll,
  listAdmin,
  createCategory,
  updateCategory,
  removeCategory,
  createSkill,
  updateSkill,
  removeSkill,
};
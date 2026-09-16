const {
  Project,
  Publication,
  Experience,
  Education,
  Skill,
  SkillCategory,
  Event,
  Teaching,
  Certification,
  ContactMessage,
  SocialLink,
  User,
} = require('../models');
const { SiteSetting } = require('../models');
const { publicFileUrl } = require('../utils/apiError');

async function dashboard(req, res, next) {
  try {
    const base = { count: 'id' };

    const [
      projects,
      publications,
      experiences,
      education,
      skills,
      events,
      teaching,
      certifications,
      messages,
      unreadMessages,
      socialLinks,
      skillCategories,
      categories,
    ] = await Promise.all([
      Project.count(base),
      Publication.count(base),
      Experience.count(base),
      Education.count(base),
      Skill.count(base),
      Event.count(base),
      Teaching.count(base),
      Certification.count(base),
      ContactMessage.count(base),
      ContactMessage.count({ where: { isRead: false } }),
      SocialLink.count(base),
      SkillCategory.count(base),
      SkillCategory.findAll({ attributes: ['id', 'name'] }),
    ]);

    const recentMessages = await ContactMessage.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5,
    });

    const recentProjects = await Project.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5,
      attributes: ['id', 'title', 'isPublished', 'isFeatured', 'createdAt'],
    });

    res.json({
      stats: {
        projects,
        publications,
        experiences,
        education,
        skills,
        skillCategories,
        events,
        teaching,
        certifications,
        messages,
        unreadMessages,
        socialLinks,
        users: await User.count(base),
      },
      recentMessages,
      recentProjects,
    });
  } catch (err) {
    next(err);
  }
}

/** Public site "everything" endpoint to bootstrap the homepage in one request. */
async function homeBundle(req, res, next) {
  try {
    const settings = {};
    const settingRows = await SiteSetting.findAll();
    for (const row of settingRows) settings[row.name] = row.value;
    if (settings.profile_image) settings.profile_image = publicFileUrl(settings.profile_image);

    const [projects, publications, experiences, education, events, teaching, certifications, socialLinks, skills] =
      await Promise.all([
        Project.findAll({ where: { isPublished: true }, order: [['sortOrder', 'ASC']], limit: 60 }),
        Publication.findAll({ where: { isPublished: true }, order: [['year', 'DESC']], limit: 60 }),
        Experience.findAll({ where: { isPublished: true }, order: [['startDate', 'DESC']], limit: 30 }),
        Education.findAll({ where: { isPublished: true }, order: [['startDate', 'DESC']], limit: 10 }),
        Event.findAll({ where: { isPublished: true }, order: [['eventDate', 'DESC']], limit: 30 }),
        Teaching.findAll({ where: { isPublished: true }, order: [['date', 'DESC']], limit: 30 }),
        Certification.findAll({ where: { isPublished: true }, order: [['date', 'DESC']], limit: 30 }),
        SocialLink.findAll({ where: { isPublished: true }, order: [['sortOrder', 'ASC']] }),
        SkillCategory.findAll({
          order: [['sortOrder', 'ASC']],
          include: [{ model: Skill, as: 'skills', where: { isPublished: true }, required: false }],
        }),
      ]);

    res.json({
      settings: Object.fromEntries(
        Object.entries(settings).filter(([, v]) => v !== null)
      ),
      projects: projects.map((p) => (p.image ? { ...p.toJSON(), image: publicFileUrl(p.image) } : p.toJSON())),
      events: events.map((e) => (e.image ? { ...e.toJSON(), image: publicFileUrl(e.image) } : e.toJSON())),
      teaching: teaching.map((t) => (t.image ? { ...t.toJSON(), image: publicFileUrl(t.image) } : t.toJSON())),
      certifications: certifications.map((c) => (c.image ? { ...c.toJSON(), image: publicFileUrl(c.image) } : c.toJSON())),
      publications: publications.map((p) => p.toJSON()),
      experiences: experiences.map((e) => e.toJSON()),
      education: education.map((e) => e.toJSON()),
      socialLinks: socialLinks.map((s) => s.toJSON()),
      skillCategories: skills.map((c) => ({
        ...c.toJSON(),
        skills: (c.skills || []).map((s) => s.toJSON()),
      })),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { dashboard, homeBundle };
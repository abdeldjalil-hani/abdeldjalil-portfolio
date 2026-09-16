const User = require('./User');
const SiteSetting = require('./SiteSetting');
const Project = require('./Project');
const Publication = require('./Publication');
const Experience = require('./Experience');
const Education = require('./Education');
const SkillCategory = require('./SkillCategory');
const Skill = require('./Skill');
const Event = require('./Event');
const Teaching = require('./Teaching');
const Certification = require('./Certification');
const ContactMessage = require('./ContactMessage');
const SocialLink = require('./SocialLink');

SkillCategory.hasMany(Skill, { as: 'skills', foreignKey: 'categoryId' });
Skill.belongsTo(SkillCategory, { as: 'category', foreignKey: 'categoryId' });

const models = {
  User,
  SiteSetting,
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
};

module.exports = models;
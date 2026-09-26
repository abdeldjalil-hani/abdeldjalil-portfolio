/**
 * Seed script — creates placeholder admin user and default site settings.
 *
 * Usage:
 *   node seeds/seed.js
 *   node seeds/seed.js --reset
 *
 * Everything written here is EDITABLE placeholder content; it does not
 * fabricate facts. Update it from the admin dashboard after deploy.
 */
require('../src/config/env');

const sequelize = require('../src/config/database');
const models = require('../src/models');
const bcrypt = require('bcryptjs');

const { User, SiteSetting, SkillCategory, Skill, SocialLink } = models;

const DEFAULT_SETTINGS = {
  name: 'Abdeldjalil Hani',
  title_line_1: 'AI & Machine Learning Engineer',
  title_line_2: 'Data Scientist · PhD Researcher · Software Developer',
  hero_heading: 'Abdeldjalil Hani',
  hero_subheading: 'AI & Machine Learning Engineer · Data Scientist · PhD Researcher · Software Developer',
  hero_introduction:
    'PhD researcher and AI/ML engineer working at the intersection of artificial intelligence, data science, software development, and emerging computing technologies.',
  introduction:
    'PhD researcher and AI/ML engineer working at the intersection of artificial intelligence, data science, software development, and emerging computing technologies.',
  about_text: `I am a PhD researcher and AI/ML engineer with a multidisciplinary profile spanning artificial intelligence, machine learning, data science, software engineering, quantum computing, research, and teaching.

My research focuses on applying quantum metaheuristics and quantum computing techniques to complex optimization problems, with particular attention to healthcare applications. I build practical AI systems, work across the full software development stack, and am passionate about making cutting-edge computing research both accessible and applicable.

This space brings together my academic work, research projects, software projects, teaching activities, and professional experience.`,
  research_summary: `My PhD research focuses on optimizing complex health problems using quantum metaheuristics and quantum computing. This work explores how quantum-inspired and quantum-hybrid optimization techniques can solve combinatorial and constraint-heavy problems in healthcare more effectively than classical approaches.

Research areas:

- Quantum Computing
- Quantum Machine Learning
- Quantum Metaheuristics
- AI for Healthcare
- Quantum Data Encoding
- Quantum Image Processing`,
  footer_text: 'Built with a focus on clean engineering, responsible AI, and the conviction that good software should make complex ideas feel simple.',
  meta_title: 'Abdeldjalil Hani — AI & Machine Learning Engineer, Data Scientist, PhD Researcher',
  meta_description:
    'Portfolio of Abdeldjalil Hani: AI & Machine Learning Engineer, Data Scientist, PhD Researcher and Software Developer. Research, projects, publications, teaching and experience.',
  profile_image: '',
  cv_url: '',
  email: 'contact@example.com',
  github: 'https://github.com/',
  linkedin: 'https://www.linkedin.com/',
  website: '',
};

const DEFAULT_SKILL_CATEGORIES = [
  { name: 'Programming', icon: 'code', skills: ['Python', 'JavaScript', 'C/C++', 'TypeScript', 'Bash'] },
  { name: 'AI / ML', icon: 'brain', skills: ['Scikit-learn', 'TensorFlow', 'PyTorch', 'NumPy', 'Pandas'] },
  { name: 'Web', icon: 'globe', skills: ['React', 'Node.js', 'Express', 'Django', 'Flask'] },
  { name: 'Data', icon: 'chart', skills: ['SQL', 'Power BI', 'R', 'MATLAB'] },
  { name: 'Research', icon: 'flask', skills: ['Quantum Computing', 'Quantum Machine Learning', 'Quantum Metaheuristics', 'LaTeX', 'Scientific Computing'] },
];

async function seed() {
  try {
    await sequelize.authenticate();

    const reset = process.argv.includes('--reset');

    if (reset) {
      await sequelize.sync({ force: true });
      console.log('[seed] Database reset & recreated.');
    }

    // Admin user (placeholder — CHANGE THIS password after deploy)
    const email = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
    const password = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!';
    const userExists = await User.findOne({ where: { email } });
    if (!userExists) {
      await User.create({
        name: 'Abdeldjalil Hani',
        email,
        passwordHash: password,
      });
      console.log(`[seed] Admin user created: ${email} / ${password}`);
    } else {
      console.log('[seed] Admin user already exists, skipping.');
    }

    // Settings
    for (const [name, value] of Object.entries(DEFAULT_SETTINGS)) {
      const [row, created] = await SiteSetting.findOrCreate({
        where: { name },
        defaults: { name, value },
      });
      if (!created) {
        // Keep existing admin-provided values; only set if currently empty
        if (row.value === null || row.value === '') {
          row.value = value;
          await row.save();
        }
      }
    }
    console.log('[seed] Site settings ensured.');

    // Skill categories + skills
    for (const cat of DEFAULT_SKILL_CATEGORIES) {
      const [category] = await SkillCategory.findOrCreate({
        where: { name: cat.name },
        defaults: { name: cat.name, icon: cat.icon || null, sortOrder: 0 },
      });
      for (const skillName of cat.skills) {
        await Skill.findOrCreate({
          where: { name: skillName, categoryId: category.id },
          defaults: {
            name: skillName,
            categoryId: category.id,
            level: null,
            isPublished: true,
            sortOrder: 0,
          },
        });
      }
    }
    console.log('[seed] Skill categories & skills ensured.');

    // Default social links
    await SocialLink.findOrCreate({ where: { platform: 'github' }, defaults: { platform: 'github', url: DEFAULT_SETTINGS.github, username: '', icon: 'github', sortOrder: 1 } });
    await SocialLink.findOrCreate({ where: { platform: 'linkedin' }, defaults: { platform: 'linkedin', url: DEFAULT_SETTINGS.linkedin, username: '', icon: 'linkedin', sortOrder: 2 } });
    await SocialLink.findOrCreate({ where: { platform: 'email' }, defaults: { platform: 'email', url: `mailto:${DEFAULT_SETTINGS.email}`, username: '', icon: 'mail', sortOrder: 3 } });
    console.log('[seed] Social links ensured.');

    console.log('\n[seed] Done. Login at /admin with the admin email above.');
    process.exit(0);
  } catch (err) {
    console.error('[seed] Failed:', err.message);
    process.exit(1);
  }
}

seed();
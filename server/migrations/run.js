/**
 * Database migration runner for shared hosting.
 *
 * Usage:
 *   node migrations/run.js
 *
 * Creates tables from the Sequelize models if they do not exist yet.
 * In production this is intentionally non-destructive (no ALTER DROP),
 * which is safe to run via SSH or cPanel Terminal on the live database.
 */
require('../src/config/env');

const sequelize = require('../src/config/database');
const models = require('../src/models');

/**
 * Tables that other tables reference are created first so foreign keys resolve.
 * New models added later are appended after existing ones automatically.
 */
const ORDERED = [
  'User',
  'SiteSetting',
  'SkillCategory',
  'Skill',
  'Project',
  'Publication',
  'Experience',
  'Education',
  'Event',
  'Teaching',
  'Certification',
  'ContactMessage',
  'SocialLink',
];

async function run() {
  try {
    await sequelize.authenticate();
    for (const name of ORDERED) {
      const table = models[name];
      if (!table) continue;
      // eslint-disable-next-line no-await-in-loop
      await table.sync({ alter: false });
    }
    for (const [name, table] of Object.entries(models)) {
      if (ORDERED.includes(name)) continue;
      // eslint-disable-next-line no-await-in-loop
      await table.sync({ alter: false });
    }

    // Dates can be stored as "YYYY-MM" (month/year only) or "YYYY-MM-DD" (full date),
    // so the columns must be VARCHAR(10) instead of DATE.
    const DATE_COLUMNS = [
      ['experiences', 'start_date'],
      ['experiences', 'end_date'],
      ['education', 'start_date'],
      ['education', 'end_date'],
      ['events', 'event_date'],
      ['events', 'end_date'],
      ['teaching', 'date'],
      ['certifications', 'date'],
    ];
    for (const [table, column] of DATE_COLUMNS) {
      // eslint-disable-next-line no-await-in-loop
      await sequelize.query(`ALTER TABLE \`${table}\` MODIFY \`${column}\` VARCHAR(10) NULL`);
    }

    console.log('Migration complete: all tables ensured.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  }
}

run();
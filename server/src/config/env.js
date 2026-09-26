const path = require('path');
const dotenv = require('dotenv');

/**
 * Single .env loader for the whole server, so every entry point agrees on
 * where configuration comes from.
 *
 * Order: repository root first, then server/.env. dotenv never overwrites a
 * variable that is already set, so real environment variables (cPanel's
 * environment variable editor) always take priority over both files, and
 * server/.env wins over the repository root when a key is duplicated.
 */
const serverDir = path.resolve(__dirname, '..', '..');
const repoRoot = path.resolve(serverDir, '..');

dotenv.config({ path: path.join(repoRoot, '.env') });
dotenv.config({ path: path.join(serverDir, '.env') });

module.exports = { serverDir, repoRoot };

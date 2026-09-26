/**
 * Database provisioning hook for shared hosting (cPanel / Setup Node.js App).
 *
 * Shared hosting gives no shell access, so `node migrations/run.js` cannot be
 * run by hand. npm's `postinstall` lifecycle runs automatically when cPanel's
 * "Run NPM Install" button is clicked, which makes this the one place where
 * the schema and the admin user get created on a fresh database.
 *
 * Guarded by DEPLOY_PROVISION=true so that a normal `npm install` on a
 * developer machine (or in CI) never touches a database.
 *
 * Both scripts are idempotent: migrations only create missing tables, and the
 * seed only fills in settings that are empty. Re-running is safe.
 */
const { spawnSync } = require('child_process');
const path = require('path');

if (process.env.DEPLOY_PROVISION !== 'true') {
  process.exit(0);
}

const serverDir = path.resolve(__dirname, '..');
const scripts = ['migrations/run.js', 'seeds/seed.js'];

for (const script of scripts) {
  const label = path.basename(script);
  console.log(`[postinstall] running ${script}`);

  const result = spawnSync(process.execPath, [path.join(serverDir, script)], {
    cwd: serverDir,
    stdio: 'inherit',
  });

  if (result.error) {
    console.error(`[postinstall] could not start ${label}: ${result.error.message}`);
    process.exit(1);
  }
  if (result.status !== 0) {
    console.error(`[postinstall] ${label} failed with exit code ${result.status}`);
    process.exit(result.status || 1);
  }
}

console.log('[postinstall] database provisioned.');

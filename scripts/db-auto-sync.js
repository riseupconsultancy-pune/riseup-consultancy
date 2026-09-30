const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.join(__dirname, '..');
const prismaDir = path.join(rootDir, 'prisma');

let dbUrl = process.env.DATABASE_URL || '';

if (!dbUrl) {
  const envFiles = [
    path.join(rootDir, '.env.production.local'),
    path.join(rootDir, '.env.production'),
    path.join(rootDir, '.env.local'),
    path.join(rootDir, '.env'),
  ];
  for (const envFile of envFiles) {
    if (fs.existsSync(envFile)) {
      const content = fs.readFileSync(envFile, 'utf8');
      const match = content.match(/^DATABASE_URL\s*=\s*["']?([^"'\r\n]+)["']?/m);
      if (match && match[1]) {
        dbUrl = match[1].trim().replace(/^["']|["']$/g, '');
        break;
      }
    }
  }
}

const isMysql = dbUrl.startsWith('mysql:');
const targetMode = isMysql ? 'prod' : 'local';

console.log(`[RiseUp Auto-DB] Detected DB URL: ${dbUrl ? (dbUrl.startsWith('file:') ? 'SQLite (file:)' : 'MySQL (mysql:)') : 'Not set'}`);
console.log(`[RiseUp Auto-DB] Configuring environment for: ${targetMode.toUpperCase()} (${isMysql ? 'MySQL' : 'SQLite'})...`);

const targetSchema = isMysql 
  ? path.join(prismaDir, 'schema.mysql.prisma')
  : path.join(prismaDir, 'schema.sqlite.prisma');
const activeSchema = path.join(prismaDir, 'schema.prisma');

if (fs.existsSync(targetSchema)) {
  let schemaContent = fs.readFileSync(targetSchema, 'utf8');
  if (schemaContent.charCodeAt(0) === 0xFEFF) {
    schemaContent = schemaContent.slice(1);
  }
  fs.writeFileSync(activeSchema, schemaContent, 'utf8');
  console.log(`[RiseUp Auto-DB] Active schema set to ${targetMode.toUpperCase()}`);
}

try {
  console.log('[RiseUp Auto-DB] Generating Prisma Client...');
  try {
    const out = execSync('npx prisma generate', { stdio: 'pipe' });
    if (out) console.log(out.toString());
  } catch (genErr) {
    const detail = `${genErr.stdout ? genErr.stdout.toString() : ''} ${genErr.stderr ? genErr.stderr.toString() : ''}`;
    if (detail.includes('EPERM')) {
      console.warn('[RiseUp Auto-DB] Notice: Local Windows file lock detected (dev server active). Retaining existing Prisma Client.');
    } else {
      console.error('[RiseUp Auto-DB] Prisma generate notice:', detail.trim() || genErr.message);
    }
  }

  if (isMysql && dbUrl.startsWith('mysql:')) {
    console.log('[RiseUp Auto-DB] Synchronizing database schema to Hostinger MySQL...');
    try {
      execSync('npx prisma db push --skip-generate', { stdio: 'inherit' });
      console.log('[RiseUp Auto-DB] Database schema synchronized successfully with Hostinger MySQL!');
    } catch (pushErr) {
      console.warn('[RiseUp Auto-DB] Note: prisma db push skipped or encountered non-fatal notice:', pushErr.message);
    }
  }

  // Synchronize Master Super Admin credentials to ensure login works on every deployment
  try {
    const syncScript = path.join(__dirname, 'sync-admin-credentials.js');
    if (fs.existsSync(syncScript)) {
      console.log('[RiseUp Auto-DB] Synchronizing Super Admin credentials...');
      execSync(`node "${syncScript}"`, { stdio: 'inherit' });
    }
  } catch (syncErr) {
    console.warn('[RiseUp Auto-DB] Admin sync notice (non-fatal):', syncErr.message);
  }
} catch (err) {
  console.error('[RiseUp Auto-DB] Auto-sync notice:', err.message);
}

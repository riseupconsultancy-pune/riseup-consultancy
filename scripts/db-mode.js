const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const targetMode = process.argv[2] || 'local'; // 'local' (sqlite) or 'prod' (mysql)

const prismaDir = path.join(__dirname, '..', 'prisma');
const targetSchema = targetMode === 'prod' 
  ? path.join(prismaDir, 'schema.mysql.prisma')
  : path.join(prismaDir, 'schema.sqlite.prisma');

const activeSchema = path.join(prismaDir, 'schema.prisma');

if (!fs.existsSync(targetSchema)) {
  console.error(`Error: Schema template ${targetSchema} not found!`);
  process.exit(1);
}

fs.copyFileSync(targetSchema, activeSchema);
console.log(`[RiseUp DB Mode] Switched active schema to: ${targetMode.toUpperCase()} (${targetMode === 'prod' ? 'MySQL' : 'SQLite'})`);

try {
  console.log('[RiseUp DB Mode] Regenerating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log(`[RiseUp DB Mode] Successfully configured for ${targetMode.toUpperCase()} environment!`);
} catch (error) {
  console.error('[RiseUp DB Mode] Error regenerating Prisma Client:', error.message);
  process.exit(1);
}

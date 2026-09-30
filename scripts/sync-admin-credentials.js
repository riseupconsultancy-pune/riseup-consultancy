const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

async function syncAdminCredentials() {
  const rootDir = path.join(__dirname, '..');
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

  const prisma = new PrismaClient();

  const NEW_ADMIN_EMAIL = 'admin@riseupconsultancyy.com';
  const NEW_ADMIN_PASSWORD = 'Admin@Riseup@2025';
  const OLD_ADMIN_EMAIL = 'admin@riseupconsultancy.in';

  console.log(`[RiseUp Admin Sync] Synchronizing Super Admin credentials to: ${NEW_ADMIN_EMAIL}...`);

  try {
    const passwordHash = await bcrypt.hash(NEW_ADMIN_PASSWORD, 12);

    // 1. Check if user with new email already exists
    const existingNewAdmin = await prisma.user.findUnique({
      where: { email: NEW_ADMIN_EMAIL },
    });

    if (existingNewAdmin) {
      // Update password hash and ensure ACTIVE SUPER_ADMIN
      await prisma.user.update({
        where: { id: existingNewAdmin.id },
        data: {
          passwordHash,
          role: 'SUPER_ADMIN',
          status: 'ACTIVE',
          fullName: 'RiseUp Executive Admin',
        },
      });
      console.log(`[RiseUp Admin Sync] Updated existing admin user (${NEW_ADMIN_EMAIL}) with new password hash.`);
    } else {
      // Check if user with old email exists
      const existingOldAdmin = await prisma.user.findUnique({
        where: { email: OLD_ADMIN_EMAIL },
      });

      if (existingOldAdmin) {
        // Migrate old admin user in-place to new email & password
        await prisma.user.update({
          where: { id: existingOldAdmin.id },
          data: {
            email: NEW_ADMIN_EMAIL,
            passwordHash,
            role: 'SUPER_ADMIN',
            status: 'ACTIVE',
            fullName: 'RiseUp Executive Admin',
          },
        });
        console.log(`[RiseUp Admin Sync] Successfully migrated old admin (${OLD_ADMIN_EMAIL}) -> (${NEW_ADMIN_EMAIL}) with new credentials.`);
      } else {
        // Create fresh Super Admin
        await prisma.user.create({
          data: {
            email: NEW_ADMIN_EMAIL,
            fullName: 'RiseUp Executive Admin',
            passwordHash,
            role: 'SUPER_ADMIN',
            phone: '+91 98765 43210',
            status: 'ACTIVE',
          },
        });
        console.log(`[RiseUp Admin Sync] Created new Super Admin user (${NEW_ADMIN_EMAIL}).`);
      }
    }

    // 2. Clean up any leftover old admin if both somehow existed
    if (existingNewAdmin) {
      const leftoverOldAdmin = await prisma.user.findUnique({
        where: { email: OLD_ADMIN_EMAIL },
      });
      if (leftoverOldAdmin) {
        await prisma.user.delete({ where: { id: leftoverOldAdmin.id } });
        console.log(`[RiseUp Admin Sync] Purged leftover old admin record (${OLD_ADMIN_EMAIL}).`);
      }
    }

    console.log('[RiseUp Admin Sync] Admin credentials sync completed successfully!');
  } catch (err) {
    console.error('[RiseUp Admin Sync] Error during admin sync:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  syncAdminCredentials();
}

module.exports = { syncAdminCredentials };

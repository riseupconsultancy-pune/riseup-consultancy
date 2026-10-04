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

  const CLIENT_EMAIL = 'info@riseupconsultancyy.com';
  const CLIENT_PASSWORD = 'Client@1810';

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

    // 3. Clean up legacy demo users if present on deployment
    const demoEmails = [
      'client@apexglobal.com',
      'client@digitide.com',
      'hr.priya@riseupconsultancy.in',
      'hr.rahul@riseupconsultancy.in',
    ];
    for (const email of demoEmails) {
      const demoUser = await prisma.user.findUnique({ where: { email } });
      if (demoUser) {
        await prisma.user.delete({ where: { id: demoUser.id } });
        console.log(`[RiseUp Admin Sync] Purged demo account: ${email}`);
      }
    }

    // 4. Synchronize Fresh Client Profile (info@riseupconsultancyy.com / Client@1810)
    console.log(`[RiseUp Client Sync] Synchronizing Client profile for: ${CLIENT_EMAIL}...`);
    const clientPassHash = await bcrypt.hash(CLIENT_PASSWORD, 12);
    const existingClient = await prisma.user.findUnique({
      where: { email: CLIENT_EMAIL },
      include: { clientProfile: true },
    });

    if (existingClient) {
      await prisma.user.update({
        where: { id: existingClient.id },
        data: {
          passwordHash: clientPassHash,
          role: 'CLIENT',
          status: 'ACTIVE',
          fullName: 'Rise Up Consultancy',
        },
      });

      if (!existingClient.clientProfile) {
        await prisma.clientProfile.create({
          data: {
            userId: existingClient.id,
            companyName: 'Rise Up Consultancy',
            country: 'India',
            city: 'Pune',
            industry: 'BPO / BPM / Staffing',
            contactPerson: 'Operations Desk',
            phone: '+91 93598 92819',
            billingAddress: '1st floor, S.No-49, opp. Hari-Krushna Complex, Chandan Nagar, Pune, Maharashtra 411014.',
            billingGstin: '27ABLFR4477Q1Z4',
            billingPan: 'ABLFR4477Q',
            billingContactPerson: 'Operations Desk',
            billingEmail: CLIENT_EMAIL,
            billingPhone: '+91 93598 92819',
          },
        });
      }
      console.log(`[RiseUp Client Sync] Verified and updated Client credentials for ${CLIENT_EMAIL}.`);
    } else {
      await prisma.user.create({
        data: {
          email: CLIENT_EMAIL,
          passwordHash: clientPassHash,
          fullName: 'Rise Up Consultancy',
          role: 'CLIENT',
          status: 'ACTIVE',
          phone: '+91 93598 92819',
          clientProfile: {
            create: {
              companyName: 'Rise Up Consultancy',
              country: 'India',
              city: 'Pune',
              industry: 'BPO / BPM / Staffing',
              contactPerson: 'Operations Desk',
              phone: '+91 93598 92819',
              billingAddress: '1st floor, S.No-49, opp. Hari-Krushna Complex, Chandan Nagar, Pune, Maharashtra 411014.',
              billingGstin: '27ABLFR4477Q1Z4',
              billingPan: 'ABLFR4477Q',
              billingContactPerson: 'Operations Desk',
              billingEmail: CLIENT_EMAIL,
              billingPhone: '+91 93598 92819',
            },
          },
        },
      });
      console.log(`[RiseUp Client Sync] Created fresh Client profile for ${CLIENT_EMAIL}.`);
    }

    console.log('[RiseUp Admin Sync] Credentials sync completed successfully!');
  } catch (err) {
    console.error('[RiseUp Admin Sync] Error during sync:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  syncAdminCredentials();
}

module.exports = { syncAdminCredentials };

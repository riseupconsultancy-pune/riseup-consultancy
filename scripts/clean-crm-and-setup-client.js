const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Cleaning all existing demo data from CRM panel ---');

  // 1. Delete Candidate Status History
  const delStatusHistory = await prisma.candidateStatusHistory.deleteMany({});
  console.log(`Deleted ${delStatusHistory.count} candidate status history records.`);

  // 2. Delete Candidates
  const delCandidates = await prisma.candidate.deleteMany({});
  console.log(`Deleted ${delCandidates.count} candidate records.`);

  // 3. Delete HR Public Links
  const delHrLinks = await prisma.hrPublicLink.deleteMany({});
  console.log(`Deleted ${delHrLinks.count} HR public link records.`);

  // 4. Delete Vacancies
  const delVacancies = await prisma.vacancy.deleteMany({});
  console.log(`Deleted ${delVacancies.count} vacancy records.`);

  // 5. Delete Invoices and Items
  const delInvoiceItems = await prisma.invoiceItem.deleteMany({});
  console.log(`Deleted ${delInvoiceItems.count} invoice items.`);
  const delInvoices = await prisma.invoice.deleteMany({});
  console.log(`Deleted ${delInvoices.count} invoices.`);

  // 6. Delete Client Agreements
  const delAgreements = await prisma.clientAgreement.deleteMany({});
  console.log(`Deleted ${delAgreements.count} agreements.`);

  // 7. Delete all HrProfiles
  const delHrProfiles = await prisma.hrProfile.deleteMany({});
  console.log(`Deleted ${delHrProfiles.count} HR profiles.`);

  // 8. Delete all existing ClientProfiles
  const delClientProfiles = await prisma.clientProfile.deleteMany({});
  console.log(`Deleted ${delClientProfiles.count} client profiles.`);

  // 9. Delete all non-admin users (keeping only SUPER_ADMIN)
  const delUsers = await prisma.user.deleteMany({
    where: {
      role: { not: 'SUPER_ADMIN' },
    },
  });
  console.log(`Deleted ${delUsers.count} non-admin users.`);

  // 10. Reset System Counters to clean baselines
  await prisma.systemCounter.upsert({
    where: { id: 'JOB_COUNTER' },
    update: { currentValue: 1000 },
    create: { id: 'JOB_COUNTER', currentValue: 1000 },
  });
  await prisma.systemCounter.upsert({
    where: { id: 'CANDIDATE_COUNTER' },
    update: { currentValue: 1000 },
    create: { id: 'CANDIDATE_COUNTER', currentValue: 1000 },
  });
  await prisma.systemCounter.upsert({
    where: { id: 'AGREEMENT_COUNTER' },
    update: { currentValue: 1000 },
    create: { id: 'AGREEMENT_COUNTER', currentValue: 1000 },
  });
  await prisma.systemCounter.upsert({
    where: { id: 'HR_COUNTER' },
    update: { currentValue: 100 },
    create: { id: 'HR_COUNTER', currentValue: 100 },
  });
  await prisma.systemCounter.upsert({
    where: { id: 'INVOICE_COUNTER' },
    update: { currentValue: 1000 },
    create: { id: 'INVOICE_COUNTER', currentValue: 1000 },
  });

  // 11. Create the new fresh client profile:
  // Username: info@riseupconsultancyy.com
  // Password: Client@1810
  const CLIENT_EMAIL = 'info@riseupconsultancyy.com';
  const CLIENT_PASS = 'Client@1810';
  const passwordHash = await bcrypt.hash(CLIENT_PASS, 12);

  const newClientUser = await prisma.user.create({
    data: {
      email: CLIENT_EMAIL,
      passwordHash,
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
    include: {
      clientProfile: true,
    },
  });

  console.log('--- Successfully created new fresh client profile ---');
  console.log(`Email: ${newClientUser.email}`);
  console.log(`Company: ${newClientUser.clientProfile.companyName}`);
  console.log(`Client Profile ID: ${newClientUser.clientProfile.id}`);
  console.log('HR Profiles count: 0 (No HR profiles created as requested)');
}

main()
  .catch((e) => {
    console.error('Error during cleanup and setup:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

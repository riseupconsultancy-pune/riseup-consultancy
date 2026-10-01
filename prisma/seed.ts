import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding RiseUp Consultancy database (Production Baseline)...");

  // 1. Initialize System Counters
  await prisma.systemCounter.upsert({
    where: { id: "JOB_COUNTER" },
    update: {},
    create: { id: "JOB_COUNTER", currentValue: 1000 },
  });

  await prisma.systemCounter.upsert({
    where: { id: "CANDIDATE_COUNTER" },
    update: {},
    create: { id: "CANDIDATE_COUNTER", currentValue: 1000 },
  });

  await prisma.systemCounter.upsert({
    where: { id: "AGREEMENT_COUNTER" },
    update: {},
    create: { id: "AGREEMENT_COUNTER", currentValue: 1000 },
  });

  await prisma.systemCounter.upsert({
    where: { id: "HR_COUNTER" },
    update: {},
    create: { id: "HR_COUNTER", currentValue: 100 },
  });

  await prisma.systemCounter.upsert({
    where: { id: "INVOICE_COUNTER" },
    update: {},
    create: { id: "INVOICE_COUNTER", currentValue: 1000 },
  });

  // 1b. Seed Rise Up Consultancy Billing Config
  await prisma.consultancyBillingConfig.upsert({
    where: { id: "RISEUP_BILLING_CONFIG" },
    update: {},
    create: {
      id: "RISEUP_BILLING_CONFIG",
      companyName: "Rise Up Consultancy Pune",
      tagline: "Staffing and Recruiting Services",
      address: "1st floor, S.No-49, opp. Hari-Krushna Complex, Chandan Nagar, Pune, Maharashtra 411014.",
      gstin: "27ABLFR4477Q1Z4",
      pan: "ABLFR4477Q",
      hsnSac: "998512",
      placeOfSupply: "Pune",
      bankName: "AU Small Finance Bank",
      bankAccountName: "Rise Up Consultancy Pune",
      bankAccountNumber: "2502261678246645",
      bankIfsc: "AUBL0002616",
      termsText: "Payment Due: Net 30 days from invoice date. Late Payments: Overdue invoices incur a 1.5% monthly interest fee plus recovery costs. Queries: Raise billing discrepancies within 7 days of invoice receipt.",
    },
  });

  // 1c. Seed Default GST Tax Rules
  await prisma.taxSetting.deleteMany({});
  await prisma.taxSetting.createMany({
    data: [
      { name: "CGST", rate: 9.0, isSelectedByDefault: true },
      { name: "SGST", rate: 9.0, isSelectedByDefault: true },
      { name: "IGST", rate: 18.0, isSelectedByDefault: false },
    ],
  });

  // 2. Create Master Super Admin
  const adminPasswordHash = await bcrypt.hash("Admin@Riseup@2025", 12);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@riseupconsultancyy.com" },
    update: { passwordHash: adminPasswordHash, status: "ACTIVE" },
    create: {
      email: "admin@riseupconsultancyy.com",
      fullName: "RiseUp Executive Admin",
      passwordHash: adminPasswordHash,
      role: "SUPER_ADMIN",
      phone: "+91 98765 43210",
      status: "ACTIVE",
    },
  });
  console.log("Admin user verified/created:", adminUser.email);

  // 3. Create Fresh Client Profile (Rise Up Consultancy / info@riseupconsultancyy.com)
  const clientPasswordHash = await bcrypt.hash("Client@1810", 12);
  const clientUser = await prisma.user.upsert({
    where: { email: "info@riseupconsultancyy.com" },
    update: {
      passwordHash: clientPasswordHash,
      status: "ACTIVE",
      role: "CLIENT",
    },
    create: {
      email: "info@riseupconsultancyy.com",
      fullName: "Rise Up Consultancy",
      passwordHash: clientPasswordHash,
      role: "CLIENT",
      phone: "+91 93598 92819",
      status: "ACTIVE",
      clientProfile: {
        create: {
          companyName: "Rise Up Consultancy",
          country: "India",
          city: "Pune",
          industry: "BPO / BPM / Staffing",
          contactPerson: "Operations Desk",
          phone: "+91 93598 92819",
          billingAddress: "1st floor, S.No-49, opp. Hari-Krushna Complex, Chandan Nagar, Pune, Maharashtra 411014.",
          billingGstin: "27ABLFR4477Q1Z4",
          billingPan: "ABLFR4477Q",
          billingContactPerson: "Operations Desk",
          billingEmail: "info@riseupconsultancyy.com",
          billingPhone: "+91 93598 92819",
        },
      },
    },
    include: { clientProfile: true },
  });
  console.log("Client profile verified/created:", clientUser.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
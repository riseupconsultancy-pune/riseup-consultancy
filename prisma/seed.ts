import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding RiseUp Consultancy database...");

  // 1. Initialize System Counters
  await prisma.systemCounter.upsert({
    where: { id: "JOB_COUNTER" },
    update: {},
    create: { id: "JOB_COUNTER", currentValue: 1003 },
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
    create: { id: "HR_COUNTER", currentValue: 101 },
  });

  // 2. Create Master Super Admin
  const adminPasswordHash = await bcrypt.hash("AdminRiseUp@2026", 12);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@riseupconsultancy.in" },
    update: { passwordHash: adminPasswordHash, status: "ACTIVE" },
    create: {
      email: "admin@riseupconsultancy.in",
      fullName: "RiseUp Executive Admin",
      passwordHash: adminPasswordHash,
      role: "SUPER_ADMIN",
      phone: "+91 98765 43210",
      status: "ACTIVE",
    },
  });
  console.log("Admin user created:", adminUser.email);

  // 3. Create Sample Corporate Client (Apex Global BPO Solutions)
  const clientPasswordHash = await bcrypt.hash("ClientApex@2026", 12);
  const clientUser = await prisma.user.upsert({
    where: { email: "client@apexglobal.com" },
    update: { 
      passwordHash: clientPasswordHash, 
      status: "ACTIVE",
      clientProfile: {
        upsert: {
          create: {
            companyName: "Apex Global BPO Solutions",
            country: "India",
            city: "Pune",
            industry: "BPO / BPM / Back Office",
            contactPerson: "Rajesh Kulkarni (Director HR)",
            phone: "+91 98220 11223",
          },
          update: {},
        },
      },
    },
    create: {
      email: "client@apexglobal.com",
      fullName: "Rajesh Kulkarni",
      passwordHash: clientPasswordHash,
      role: "CLIENT",
      phone: "+91 98220 11223",
      status: "ACTIVE",
      clientProfile: {
        create: {
          companyName: "Apex Global BPO Solutions",
          country: "India",
          city: "Pune",
          industry: "BPO / BPM / Back Office",
          contactPerson: "Rajesh Kulkarni (Director HR)",
          phone: "+91 98220 11223",
        },
      },
    },
    include: { clientProfile: true },
  });
  console.log("Client user created:", clientUser.email);

  const clientProfileId = clientUser.clientProfile!.id;

  // 4. Create Sample HR Recruiter (Priya Sharma)
  const hrPasswordHash = await bcrypt.hash("HRPriya@2026", 12);
  const hrUser = await prisma.user.upsert({
    where: { email: "hr.priya@riseupconsultancy.in" },
    update: { 
      passwordHash: hrPasswordHash, 
      status: "ACTIVE",
      hrProfile: {
        upsert: {
          create: {
            employeeCode: "RUP-HR-101",
            commissionRate: 5.0,
            whatsappTemplate: "Hello {Candidate_Name}, this is Priya from RiseUp Consultancy regarding your application for {Job_Title} in {City}. Are you available for a brief discussion regarding the interview schedule?",
          },
          update: {},
        },
      },
    },
    create: {
      email: "hr.priya@riseupconsultancy.in",
      fullName: "Priya Sharma",
      passwordHash: hrPasswordHash,
      role: "HR_RECRUITER",
      phone: "+91 97654 32109",
      status: "ACTIVE",
      hrProfile: {
        create: {
          employeeCode: "RUP-HR-101",
          commissionRate: 5.0,
          whatsappTemplate: "Hello {Candidate_Name}, this is Priya from RiseUp Consultancy regarding your application for {Job_Title} in {City}. Are you available for a brief discussion regarding the interview schedule?",
        },
      },
    },
    include: { hrProfile: true },
  });
  console.log("HR user created:", hrUser.email);

  // 5. Create Initial Vacancies
  const job1 = await prisma.vacancy.upsert({
    where: { jobId: "RUP-JOB-1001" },
    update: {},
    create: {
      jobId: "RUP-JOB-1001",
      title: "Senior Customer Success Associate (Voice Process)",
      category: "Voice Process",
      clientId: clientProfileId,
      country: "India",
      city: "Pune",
      expMin: 1,
      expMax: 3,
      workMode: "On-site",
      shift: "Day Shift",
      salaryMin: 350000,
      salaryMax: 500000,
      salaryCurrency: "INR",
      headcount: 25,
      availabilityRequired: "Immediate Joiner",
      description: "Handling inbound and outbound customer inquiries for enterprise clients. Excellent English and Hindi communication required with strong problem-solving skills.",
      requirements: "Graduate in any stream. Minimum 1 year experience in BPO / Customer Service. Immediate availability preferred.",
      status: "ACTIVE",
      isBroadcastedToHR: true,
      isPostedOnWebsite: true,
      broadcastedAt: new Date(),
    },
  });

  const job2 = await prisma.vacancy.upsert({
    where: { jobId: "RUP-JOB-1002" },
    update: {},
    create: {
      jobId: "RUP-JOB-1002",
      title: "Back Office Operations Specialist (Non-Voice)",
      category: "Back Office",
      clientId: clientProfileId,
      country: "India",
      city: "Pune",
      expMin: 0,
      expMax: 2,
      workMode: "On-site",
      shift: "Day Shift",
      salaryMin: 280000,
      salaryMax: 420000,
      salaryCurrency: "INR",
      headcount: 40,
      availabilityRequired: "Immediate Joiner",
      description: "Transaction processing, records verification, and back-office documentation for financial services accounts. Freshers with good typing and analytical skills welcome.",
      requirements: "B.Com / BBA / BCA / Any Graduate. Typing speed 35+ WPM. Keen attention to detail.",
      status: "ACTIVE",
      isBroadcastedToHR: true,
      isPostedOnWebsite: true,
      broadcastedAt: new Date(),
    },
  });

  const job3 = await prisma.vacancy.upsert({
    where: { jobId: "RUP-JOB-1003" },
    update: {},
    create: {
      jobId: "RUP-JOB-1003",
      title: "BPM Chat & Email Support Specialist",
      category: "Non-Voice",
      clientId: clientProfileId,
      country: "India",
      city: "Mumbai",
      expMin: 1,
      expMax: 3,
      workMode: "On-site",
      shift: "Rotational",
      salaryMin: 320000,
      salaryMax: 480000,
      salaryCurrency: "INR",
      headcount: 15,
      availabilityRequired: "Within 15 Days",
      description: "Providing high-speed chat and email resolutions for global tech accounts. Exceptional written communication skills required.",
      requirements: "Strong English typing and grammar. Previous chat support experience is a plus.",
      status: "ACTIVE",
      isBroadcastedToHR: true,
      isPostedOnWebsite: false,
      broadcastedAt: new Date(),
    },
  });

  console.log("Seeded vacancies:", job1.jobId, job2.jobId, job3.jobId);
  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
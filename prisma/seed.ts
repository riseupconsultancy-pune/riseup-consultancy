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

  await prisma.systemCounter.upsert({
    where: { id: "INVOICE_COUNTER" },
    update: {},
    create: { id: "INVOICE_COUNTER", currentValue: 1001 },
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

  // 6. Create Digitide Business Solutions (P) Client from invoice_format.docx
  const digitidePasswordHash = await bcrypt.hash("ClientDigitide@2026", 12);
  const digitideUser = await prisma.user.upsert({
    where: { email: "client@digitide.com" },
    update: { passwordHash: digitidePasswordHash, status: "ACTIVE" },
    create: {
      email: "client@digitide.com",
      fullName: "Nitin Patil (Operations Head)",
      passwordHash: digitidePasswordHash,
      role: "CLIENT",
      phone: "+91 98900 12345",
      status: "ACTIVE",
      clientProfile: {
        create: {
          companyName: "Digitide Business  Solutions (P)",
          country: "India",
          city: "Pune",
          industry: "BPO / BPM",
          contactPerson: "Nitin Patil",
          phone: "+91 98900 12345",
          billingAddress: "Kharadi Pune -411014",
          billingGstin: "27AACCC4278P1Z3",
          billingPan: "AACCC4278P",
          billingContactPerson: "Nitin Patil",
          billingEmail: "accounts@digitide.com",
          billingPhone: "+91 98900 12345",
        },
      },
    },
    include: { clientProfile: true },
  });

  const digitideProfileId = digitideUser.clientProfile!.id;

  // Create Digitide Vacancy
  const digitideJob = await prisma.vacancy.upsert({
    where: { jobId: "RUP-JOB-1004" },
    update: {},
    create: {
      jobId: "RUP-JOB-1004",
      title: "Tele sales Executive / Customer Support",
      category: "Voice",
      clientId: digitideProfileId,
      country: "India",
      city: "Pune",
      expMin: 0,
      expMax: 2,
      workMode: "On-site",
      shift: "Day Shift",
      salaryMin: 240000,
      salaryMax: 360000,
      salaryCurrency: "INR",
      headcount: 20,
      availabilityRequired: "Immediate Joiner",
      description: "Customer support & telesales executives for ecommerce and corporate accounts.",
      status: "ACTIVE",
      isBroadcastedToHR: true,
      isPostedOnWebsite: true,
      broadcastedAt: new Date(),
    },
  });

  // Seed sample candidates matching invoice_format.docx
  const sampleCandidates = [
    {
      candidateId: "RUP-CAN-1001",
      fullName: "Pushpa Sharma",
      email: "pushpa.sharma@example.com",
      phone: "+91 98111 22331",
      city: "Pune",
      qualification: "Graduate",
      status: "SELECTED",
      selectedAt: new Date("2026-01-05"),
      empId: "1520417",
      process: "TCS GEM",
      designation: "Tele sales Executive",
      dateOfJoining: new Date("2026-01-10"),
      billingAmount: 2500,
      billingInfoStatus: "INFO_SUBMITTED", // Green
    },
    {
      candidateId: "RUP-CAN-1002",
      fullName: "Darshan Narsing Gurram",
      email: "darshan.gurram@example.com",
      phone: "+91 98111 22332",
      city: "Pune",
      qualification: "Graduate",
      status: "SELECTED",
      selectedAt: new Date("2026-02-08"),
      empId: "1530092",
      process: "Meesho",
      designation: "Tele sales Executive",
      dateOfJoining: new Date("2026-02-14"),
      billingAmount: 2500,
      billingInfoStatus: "INFO_SUBMITTED", // Green
    },
    {
      candidateId: "RUP-CAN-1003",
      fullName: "Mandar Sanjay Kulkarni",
      email: "mandar.kulkarni@example.com",
      phone: "+91 98111 22333",
      city: "Pune",
      qualification: "BBA",
      status: "SELECTED",
      selectedAt: new Date("2026-02-15"),
      empId: null,
      process: null,
      designation: null,
      dateOfJoining: null,
      billingAmount: null,
      billingInfoStatus: "PENDING_INFO", // Yellow
    },
    {
      candidateId: "RUP-CAN-1004",
      fullName: "Diksha Malpani",
      email: "diksha.malpani@example.com",
      phone: "+91 98111 22334",
      city: "Pune",
      qualification: "B.Com",
      status: "SELECTED",
      selectedAt: new Date("2026-03-01"),
      empId: "1536775",
      process: "Tcs gem",
      designation: "Customer support",
      dateOfJoining: new Date("2026-03-09"),
      billingAmount: 2500,
      billingInfoStatus: "INFO_SUBMITTED", // Green
    },
    {
      candidateId: "RUP-CAN-1005",
      fullName: "Punam Subhash Pardeshi",
      email: "punam.pardeshi@example.com",
      phone: "+91 98111 22335",
      city: "Pune",
      qualification: "Any Graduate",
      status: "SELECTED",
      selectedAt: new Date("2026-03-10"),
      empId: null,
      process: null,
      designation: null,
      dateOfJoining: null,
      billingAmount: null,
      billingInfoStatus: "PENDING_INFO", // Yellow
    },
  ];

  for (const c of sampleCandidates) {
    await prisma.candidate.upsert({
      where: { candidateId: c.candidateId },
      update: {
        empId: c.empId,
        process: c.process,
        designation: c.designation,
        dateOfJoining: c.dateOfJoining,
        billingAmount: c.billingAmount,
        billingInfoStatus: c.billingInfoStatus,
        status: c.status,
      },
      create: {
        candidateId: c.candidateId,
        fullName: c.fullName,
        email: c.email,
        phone: c.phone,
        city: c.city,
        qualification: c.qualification,
        interestedRoles: JSON.stringify(["Voice", "Customer Support", "Tele sales"]),
        vacancyId: digitideJob.id,
        resumeUrl: "/uploads/resumes/sample.pdf",
        resumeFileName: `${c.fullName.replace(/\s+/g, "_")}_Resume.pdf`,
        resumeFileSize: 1024 * 180,
        status: c.status,
        selectedAt: c.selectedAt,
        empId: c.empId,
        process: c.process,
        designation: c.designation,
        dateOfJoining: c.dateOfJoining,
        billingAmount: c.billingAmount,
        billingInfoStatus: c.billingInfoStatus,
      },
    });
  }

  console.log("Seeded Digitide client and sample candidates for invoicing!");
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
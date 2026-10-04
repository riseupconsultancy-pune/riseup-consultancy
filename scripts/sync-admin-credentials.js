const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const MANDATES = [
  {
    jobId: "RUP-JOB-1001",
    title: "Customer Representative Officer",
    category: "Sales & Business Development",
    city: "Pune",
    expMin: 0,
    expMax: 2,
    workMode: "On-site",
    shift: "Day Shift (9:30 AM - 6:30 PM)",
    salaryMin: 10700,
    salaryMax: 13700,
    headcount: 400,
    availabilityRequired: "Immediate Joiner",
    description: "Urgent hiring drive for 400+ Customer Representative Officers for an outbound sales process in Pune Station and Viman Nagar. Both freshers and experienced candidates can apply. The role offers a take-home salary of ₹10,700 per month with an attractive ₹3,000 joining bonus and high performance incentives, with total monthly package reaching up to ₹13,700. Day shift with rotational week offs. Candidates will handle customer interaction, explain service offerings, and generate customer interest.",
    requirements: "Minimum HSC (12th Pass), Good spoken Hindi, English, and Marathi, Basic customer service knowledge, Documents required: 10th & 12th marksheets, Aadhaar card, PAN card.",
    interviewVenue: "Interview venue will be updated over here (Pune Station / Viman Nagar, Pune)",
    interviewLocationUrl: "https://maps.google.com/?q=Viman+Nagar+Pune",
  },
  {
    jobId: "RUP-JOB-1002",
    title: "Telesales Executive – Personal Loan Lead Generation",
    category: "Sales & Business Development",
    city: "Chennai",
    expMin: 0,
    expMax: 2,
    workMode: "On-site",
    shift: "Day Shift (9:30 AM - 6:30 PM)",
    salaryMin: 15978,
    salaryMax: 19000,
    headcount: 200,
    availabilityRequired: "Immediate Joiner",
    description: "Leading banking process in Chennai is hiring enthusiastic Freshers and Experienced Telesales Executives for Personal Loan Lead Generation. 200 open positions available across regional language desks (Tamil, Malayalam, and Kannada). Fixed Sunday off with regular day shift timings from 9:30 AM to 6:30 PM. Monthly take-home salary ranges from ₹15,978 to ₹19,000 per month plus attractive performance incentives, with CTC up to ₹22,000.",
    requirements: "Tamil (Versant V4) or Malayalam (Versant V3) or Kannada (Versant V3), HSC / 12th Pass or Any Graduate, Good convincing abilities, Telesales aptitude, Direct walk-in interview.",
    interviewVenue: "Interview venue will be updated over here (Chennai, Tamil Nadu)",
    interviewLocationUrl: "https://maps.google.com/?q=Chennai+Tamil+Nadu",
  },
  {
    jobId: "RUP-JOB-1003",
    title: "Customer Care Representative – Voice Process",
    category: "Voice BPO / Customer Service",
    city: "Pune",
    expMin: 1,
    expMax: 3,
    workMode: "On-site",
    shift: "Day Shift (9:30 AM - 6:30 PM)",
    salaryMin: 21400,
    salaryMax: 26000,
    headcount: 30,
    availabilityRequired: "Immediate Joiner",
    description: "Excellent career opportunity for experienced customer care professionals in Kharadi, Pune. This voice process offers a monthly salary of ₹21,400 in-hand with ₹26,000 monthly CTC. Day shift with fixed Sunday off. Candidates will handle customer inbound and outbound voice queries with high quality resolution and corporate customer satisfaction standards.",
    requirements: "Graduation Mandatory, Minimum 6 months of voice customer support experience (on paper), Excellent English communication skills (Versant V5 rating), Professional phone etiquette.",
    interviewVenue: "Interview venue will be updated over here (Kharadi, Pune)",
    interviewLocationUrl: "https://maps.google.com/?q=Kharadi+Pune",
  },
  {
    jobId: "RUP-JOB-1004",
    title: "Customer Support & Telesales Executive",
    category: "Voice BPO / Customer Service",
    city: "Pune",
    expMin: 0,
    expMax: 2,
    workMode: "On-site",
    shift: "Day Shift (9:30 AM - 6:30 PM)",
    salaryMin: 13000,
    salaryMax: 16000,
    headcount: 50,
    availabilityRequired: "Immediate Joiner",
    description: "Immediate hiring for Customer Support and Telesales Executives in Swargate, Pune. Positions open for both Freshers and experienced candidates across English, Hindi, Marathi, Gujarati, Kannada, and Malayalam language desks. Monthly take-home salary ranges from ₹13,000 to ₹14,000 in-hand (up to ₹16,000 CTC) plus performance incentives. Candidates handle customer queries through voice calls, deliver courteous service, and communicate confidently with corporate clients.",
    requirements: "Graduate in any discipline or 12th Pass currently pursuing graduation, 0 to 2 years experience, Good communication skills, Fluency in English / Hindi / Marathi / Gujarati / Kannada / Malayalam, Telecom / broadband knowledge preferred.",
    interviewVenue: "Interview venue will be updated over here (Swargate, Pune)",
    interviewLocationUrl: "https://maps.google.com/?q=Swargate+Pune",
  },
  {
    jobId: "RUP-JOB-1005",
    title: "Customer Service Representative (CSR) – Back Office",
    category: "Back Office Operations",
    city: "Pune",
    expMin: 0,
    expMax: 1,
    workMode: "On-site",
    shift: "Evening Shift (4:00 PM - 1:00 AM)",
    salaryMin: 11436,
    salaryMax: 15200,
    headcount: 36,
    availabilityRequired: "Immediate Joiner",
    description: "Immediate opening for Customer Service Representatives in Back Office Operations in Kalyani Nagar, Pune. 36 positions open for data entry and document verification across banking and loan processes. Male candidates only. Evening shift from 4:00 PM to 1:00 AM with rotational week offs. Monthly salary ranges from ₹11,436 to ₹14,102 in-hand (Apprentice rate up to ₹15,200 without PF). Comprehensive 7-day CSR training with direct joining upon certification.",
    requirements: "Male candidates only, B.Com Freshers welcome, Basic knowledge of accounting, auditing, taxation, or financial management, Spoken English, Hindi & Marathi, Typing accuracy.",
    interviewVenue: "Interview venue will be updated over here (Kalyani Nagar, Pune – 411006)",
    interviewLocationUrl: "https://maps.google.com/?q=Kalyani+Nagar+Pune",
  },
  {
    jobId: "RUP-JOB-1006",
    title: "Female Telecaller – Customer Service",
    category: "Sales & Business Development",
    city: "Pune",
    expMin: 0,
    expMax: 2,
    workMode: "On-site",
    shift: "Day Shift (9:30 AM - 6:30 PM)",
    salaryMin: 15000,
    salaryMax: 20000,
    headcount: 20,
    availabilityRequired: "Immediate Joiner",
    description: "Rise Up Consultancy is hiring enthusiastic and confident Female Telecallers in Manjari, Pune. Freshers looking to start their career are warmly encouraged to apply. Monthly compensation up to ₹20,000 per month with fixed Sunday off and a friendly corporate work environment. Responsibilities include handling outbound and inbound customer calls professionally, explaining product offerings, maintaining call records, and scheduling follow-ups.",
    requirements: "Female candidates only, Freshers welcome, Good spoken Hindi and English, Confident phone etiquette, Willingness to learn, Basic computer knowledge.",
    interviewVenue: "Interview venue will be updated over here (Manjari, Pune)",
    interviewLocationUrl: "https://maps.google.com/?q=Manjari+Pune",
  },
  {
    jobId: "RUP-JOB-1007",
    title: "Malayalam Telesales Executive – Health Insurance",
    category: "Sales & Business Development",
    city: "Bengaluru",
    expMin: 1,
    expMax: 3,
    workMode: "On-site",
    shift: "Day Shift (10:00 AM - 7:00 PM / 11:00 AM - 8:00 PM)",
    salaryMin: 21300,
    salaryMax: 23800,
    headcount: 100,
    availabilityRequired: "Immediate Joiner",
    description: "Massive hiring drive for 100 Malayalam-speaking Telesales Executives for a top Health Insurance process in Koramangala, Bangalore. Monthly take-home salary is ₹21,300 with CTC of ₹23,800 plus statutory PF, PT, and ESIC benefits. Candidates will handle customer outbound calls for health insurance policies, explain coverage options, and achieve monthly sales targets.",
    requirements: "Fluent Malayalam speaking, Versant Level 4 mandatory, Minimum 6 months of sales experience in any domain, Graduation not mandatory, Strong convincing skills.",
    interviewVenue: "Interview venue will be updated over here (Koramangala, Bengaluru, Karnataka)",
    interviewLocationUrl: "https://maps.google.com/?q=Koramangala+Bengaluru",
  },
  {
    jobId: "RUP-JOB-1008",
    title: "Bank Process Customer Specialist – Versant V4",
    category: "Voice BPO / Customer Service",
    city: "Thane",
    expMin: 0,
    expMax: 2,
    workMode: "On-site",
    shift: "Day Shift (9:30 AM - 6:30 PM)",
    salaryMin: 17000,
    salaryMax: 21000,
    headcount: 50,
    availabilityRequired: "Immediate Joiner",
    description: "Urgent hiring for Bank Voice Process in Thane for both Freshers and experienced candidates. Fixed Sunday off with regular day shift hours (9:30 AM – 6:30 PM). Monthly take-home salary ranges from ₹17,000 to ₹21,000 in-hand (up to ₹22,000 CTC). Comes with free pick and drop cab service from Thane Railway Station starting directly from day one of training.",
    requirements: "HSC (12th Pass) or Graduates, Versant Level 4 required for freshers, Clear English communication, Banking process orientation, Immediate joiners.",
    interviewVenue: "Interview venue will be updated over here (Thane, Maharashtra)",
    interviewLocationUrl: "https://maps.google.com/?q=Thane+Station+Maharashtra",
  },
  {
    jobId: "RUP-JOB-1009",
    title: "Seller Support Specialist – Customer Support",
    category: "Voice BPO / Customer Service",
    city: "Pune",
    expMin: 0,
    expMax: 3,
    workMode: "On-site",
    shift: "Rotational Shift (24/7 Window)",
    salaryMin: 22000,
    salaryMax: 32000,
    headcount: 800,
    availabilityRequired: "Immediate Joiner",
    description: "High-priority mega hiring drive for 800+ Seller Support & Customer Support Executives for a leading global e-commerce retail brand in Kharadi, Pune. Excellent career opening offering monthly salary up to ₹32,000 CTC (₹22,000 to ₹28,000 in-hand). 5.5 days working with rotational shifts and one-way cab facility provided during odd hours. Selection includes HR round, Operations round, and Versant written assessment.",
    requirements: "Freshers and experienced candidates can apply, Excellent English communication skills, Problem-solving approach, Comfortable with rotational shifts, Immediate joining.",
    interviewVenue: "Interview venue will be updated over here (Kharadi, Pune)",
    interviewLocationUrl: "https://maps.google.com/?q=Kharadi+Pune",
  },
  {
    jobId: "RUP-JOB-1010",
    title: "Home Loan Collection Executive – Gujarati Voice",
    category: "Voice BPO / Customer Service",
    city: "Mumbai",
    expMin: 1,
    expMax: 3,
    workMode: "On-site",
    shift: "Day Shift (9:00 AM - 6:00 PM)",
    salaryMin: 18000,
    salaryMax: 23000,
    headcount: 30,
    availabilityRequired: "Immediate Joiner",
    description: "Immediate opening for Home Loan Collection Executives in Mumbai. Specifically seeking Gujarati speaking candidates with collections and telecalling experience. Monthly take-home salary ranges from ₹20,000 to ₹23,000 for Gujarati speakers (₹18,000 to ₹20,000 for general profiles). Regular day shift from 9:00 AM to 6:00 PM with 1 rotational off. Interview rounds consist of HR, Operations, and Client rounds.",
    requirements: "HSC or Graduate, Minimum 6 months to 1 year experience in debt collection or recovery, Spoken fluency in Gujarati, Hard copy resume required for interview.",
    interviewVenue: "Interview venue will be updated over here (Mumbai, Maharashtra)",
    interviewLocationUrl: "https://maps.google.com/?q=Mumbai+Maharashtra",
  },
  {
    jobId: "RUP-JOB-1011",
    title: "Sales Executive – Business Loan Process",
    category: "Sales & Business Development",
    city: "Pune",
    expMin: 0,
    expMax: 2,
    workMode: "On-site",
    shift: "Day Shift (9:30 AM - 6:30 PM)",
    salaryMin: 14000,
    salaryMax: 16000,
    headcount: 200,
    availabilityRequired: "Immediate Joiner",
    description: "Mega sales hiring drive for 200 Business Loan Sales Executives in Viman Nagar, Pune. Open for both freshers and experienced candidates aged 18 to 32 years. Monthly in-hand salary of ₹14,000 for freshers (undergraduates and graduates) and ₹16,000 in-hand for candidates with 6+ months experience. Day shift from 9:30 AM to 6:30 PM with 1 rotational weekly off.",
    requirements: "Age 18 to 32 years, Fluent in Hindi, Marathi, and English, Undergraduates & Graduates eligible, Freshers welcome, 4 to 6 months sales experience preferred for experienced roles.",
    interviewVenue: "Interview venue will be updated over here (Viman Nagar, Pune)",
    interviewLocationUrl: "https://maps.google.com/?q=Viman+Nagar+Pune",
  },
  {
    jobId: "RUP-JOB-1012",
    title: "DRA Telecaller – Debt Recovery Process",
    category: "Voice BPO / Customer Service",
    city: "Ahmedabad",
    expMin: 1,
    expMax: 3,
    workMode: "On-site",
    shift: "Day Shift (9:00 AM - 6:00 PM)",
    salaryMin: 15000,
    salaryMax: 17000,
    headcount: 40,
    availabilityRequired: "Immediate Joiner",
    description: "Urgent requirement for DRA Telecallers and Debt Recovery Executives in Ellisbridge, Ahmedabad. Monthly in-hand salary of ₹15,000 to ₹17,000 with regular day shift hours (9:00 AM to 6:00 PM). Responsibilities include making outbound calls regarding overdue EMIs, providing repayment options, maintaining CRM records, and meeting recovery targets with professional customer conflict resolution.",
    requirements: "12th Pass or Graduate, DRA Certification mandatory or preferred as per banking process, 6 months to 1 year telecalling or NBFC collection experience, Good convincing skills in Hindi and Gujarati.",
    interviewVenue: "Interview venue will be updated over here (Ellisbridge, Ahmedabad, Gujarat)",
    interviewLocationUrl: "https://maps.google.com/?q=Ellisbridge+Ahmedabad",
  },
  {
    jobId: "RUP-JOB-1013",
    title: "BPO Calling Executive – Election Survey Process",
    category: "Voice BPO / Customer Service",
    city: "Mohali",
    expMin: 0,
    expMax: 1,
    workMode: "On-site",
    shift: "Day Shift (9:30 AM - 6:30 PM)",
    salaryMin: 10000,
    salaryMax: 13000,
    headcount: 50,
    availabilityRequired: "Immediate Joiner",
    description: "Urgent opening for BPO Calling Executives for an Election Survey process in Mohali, Punjab. Freshers are warmly welcome to apply. Monthly compensation of ₹10,000 to ₹13,000 per month. Job responsibilities include making outbound survey calls, collecting and recording voter responses accurately in the system, and achieving daily productivity targets.",
    requirements: "10th Pass & Above, Age 18 to 30 years, Languages: Hindi & Punjabi, Good communication skills, Male & Female candidates welcome, Immediate joiners preferred.",
    interviewVenue: "Interview venue will be updated over here (Mohali, Punjab)",
    interviewLocationUrl: "https://maps.google.com/?q=Mohali+Punjab",
  },
  {
    jobId: "RUP-JOB-1014",
    title: "Tele Caller – Survey Process",
    category: "Voice BPO / Customer Service",
    city: "Noida",
    expMin: 0,
    expMax: 1,
    workMode: "On-site",
    shift: "Day Shift (9:30 AM - 6:30 PM)",
    salaryMin: 10000,
    salaryMax: 12000,
    headcount: 50,
    availabilityRequired: "Immediate Joiner",
    description: "Urgent requirement for Tele Callers for outbound survey campaigns in Noida (Delhi NCR). Freshers are welcome to apply. Monthly salary up to ₹12,000 per month with regular day shifts. Tasks include conducting outbound calls for market research and survey campaigns, recording customer responses accurately, and meeting daily call volume metrics.",
    requirements: "10th Pass & Above, Age 18 to 30 years, Good communication skills in Hindi & English, Male & Female candidates welcome, Immediate joining.",
    interviewVenue: "Interview venue will be updated over here (Noida, Delhi NCR)",
    interviewLocationUrl: "https://maps.google.com/?q=Noida+Sector+62",
  },
  {
    jobId: "RUP-JOB-1015",
    title: "Customer Support Executive – Regional Survey (Tamil / Telugu)",
    category: "Voice BPO / Customer Service",
    city: "Noida",
    expMin: 0,
    expMax: 1,
    workMode: "On-site",
    shift: "Day Shift (9:30 AM - 6:30 PM)",
    salaryMin: 18000,
    salaryMax: 25000,
    headcount: 40,
    availabilityRequired: "Immediate Joiner",
    description: "High-paying regional voice opening for Customer Support Executives in Noida for South Indian language survey campaigns. Monthly salary up to ₹25,000 per month for candidates fluent in Tamil or Telugu. Freshers are welcome. Responsibilities involve conducting outbound survey calls, collecting responses, maintaining documentation, and ensuring daily quality compliance.",
    requirements: "12th Pass & Above, Age 18 to 30 years, Fluent in Tamil or Telugu, Conversational English/Hindi, Professional speaking etiquette, Immediate joiners.",
    interviewVenue: "Interview venue will be updated over here (Noida, Delhi NCR)",
    interviewLocationUrl: "https://maps.google.com/?q=Noida+Sector+62",
  },
  {
    jobId: "RUP-JOB-1016",
    title: "Executive – Customer Service (US Healthcare Process)",
    category: "Voice BPO / Customer Service",
    city: "Pune",
    expMin: 1,
    expMax: 5,
    workMode: "On-site",
    shift: "US Rotational Shift (24/7 Window / Night)",
    salaryMin: 25000,
    salaryMax: 58000,
    headcount: 50,
    availabilityRequired: "Immediate Joiner",
    description: "Urgent hiring for Customer Service Executives for an inbound US Healthcare process in Kharadi, Pune. Exceptional compensation package of ₹3 LPA to ₹7 LPA (₹25,000 to ₹58,000/month) based on experience. Free home pick and drop transportation, comprehensive medical and life insurance, and KRA-based monthly incentives. 8.5-hour shifts with 2 consecutive rotational weekly offs. Role involves handling inbound patient and healthcare provider calls, resolving queries, handling escalations, and maintaining HIPAA compliance.",
    requirements: "Clear US / International English accent preferred, Strong customer service and problem resolution abilities, Willingness to work rotational 24/7 US shifts, 2 weeks new hire training provided.",
    interviewVenue: "Interview venue will be updated over here (Kharadi, Pune)",
    interviewLocationUrl: "https://maps.google.com/?q=Kharadi+Pune",
  },
  {
    jobId: "RUP-JOB-1017",
    title: "Executive – US Collections & Customer Support",
    category: "Voice BPO / Customer Service",
    city: "Pune",
    expMin: 0,
    expMax: 4,
    workMode: "On-site",
    shift: "Evening Login Shifts (4:30 PM | 8:30 PM | 1:30 AM)",
    salaryMin: 25000,
    salaryMax: 50000,
    headcount: 60,
    availabilityRequired: "Immediate Joiner",
    description: "Urgent requirement for Customer Service and Collections Executives in Kharadi, Pune across Soft Collections, First-Party Collections, Healthcare, and Telecom tracks. Freshers start at ₹25,000 take-home per month; experienced executives earn up to ₹45,000 to ₹50,000 take-home per month plus performance incentives. Shift options include 4:30 PM, 8:30 PM, and 1:30 AM login windows with rotational offs. Candidates interact with US customers regarding account queries, payment solutions, and service assistance.",
    requirements: "Strong US accent communication skills mandatory, Only candidates with clear US/International English accent should apply, Freshers & experienced welcome, Strong negotiation and customer support skills.",
    interviewVenue: "Interview venue will be updated over here (Kharadi, Pune)",
    interviewLocationUrl: "https://maps.google.com/?q=Kharadi+Pune",
  },
];

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

    let clientProfileId = null;

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

      const profile = await prisma.clientProfile.upsert({
        where: { userId: existingClient.id },
        update: {
          companyName: 'Rise Up Consultancy',
          country: 'India',
          city: 'Pune',
          industry: 'BPO / BPM / Staffing',
          contactPerson: 'Operations Desk',
          phone: '+91 93598 92819',
          billingEmail: CLIENT_EMAIL,
        },
        create: {
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
      clientProfileId = profile.id;
      console.log(`[RiseUp Client Sync] Verified and updated Client credentials and profile for ${CLIENT_EMAIL}.`);
    } else {
      const newClientUser = await prisma.user.create({
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
        include: { clientProfile: true },
      });
      clientProfileId = newClientUser.clientProfile.id;
      console.log(`[RiseUp Client Sync] Created fresh Client profile for ${CLIENT_EMAIL}.`);
    }

    // 5. Synchronize all 17 Vacancy Mandates under info@riseupconsultancyy.com
    if (clientProfileId) {
      console.log(`[RiseUp Mandate Sync] Synchronizing 17 mandates for ${CLIENT_EMAIL}...`);
      const now = new Date();
      for (const m of MANDATES) {
        await prisma.vacancy.upsert({
          where: { jobId: m.jobId },
          update: {
            title: m.title,
            category: m.category,
            clientId: clientProfileId,
            country: 'India',
            city: m.city,
            expMin: m.expMin,
            expMax: m.expMax,
            workMode: m.workMode,
            shift: m.shift,
            salaryMin: m.salaryMin,
            salaryMax: m.salaryMax,
            salaryCurrency: 'INR',
            headcount: m.headcount,
            availabilityRequired: m.availabilityRequired,
            description: m.description,
            requirements: m.requirements,
            interviewVenue: m.interviewVenue,
            interviewLocationUrl: m.interviewLocationUrl,
            interviewContactPerson: 'RiseUp HR Operations Desk',
            interviewContactPhone: '7030122065',
            interviewInstructions: 'Carry 2 hard copies of updated CV, 10th/12th/Graduation marksheets, Aadhaar card, PAN card, formal attire. Mention Rise Up Consultancy at the reception.',
            status: 'ACTIVE',
            isBroadcastedToHR: true,
            isPostedOnWebsite: true,
          },
          create: {
            jobId: m.jobId,
            title: m.title,
            category: m.category,
            clientId: clientProfileId,
            country: 'India',
            city: m.city,
            expMin: m.expMin,
            expMax: m.expMax,
            workMode: m.workMode,
            shift: m.shift,
            salaryMin: m.salaryMin,
            salaryMax: m.salaryMax,
            salaryCurrency: 'INR',
            headcount: m.headcount,
            availabilityRequired: m.availabilityRequired,
            description: m.description,
            requirements: m.requirements,
            interviewVenue: m.interviewVenue,
            interviewLocationUrl: m.interviewLocationUrl,
            interviewContactPerson: 'RiseUp HR Operations Desk',
            interviewContactPhone: '7030122065',
            interviewInstructions: 'Carry 2 hard copies of updated CV, 10th/12th/Graduation marksheets, Aadhaar card, PAN card, formal attire. Mention Rise Up Consultancy at the reception.',
            status: 'ACTIVE',
            isBroadcastedToHR: true,
            isPostedOnWebsite: true,
            broadcastedAt: now,
            createdAt: now,
            updatedAt: now,
          },
        });
      }
      console.log(`[RiseUp Mandate Sync] 17 mandates successfully verified and active in DB!`);

      // Ensure Job Counter is set to 1018
      await prisma.systemCounter.upsert({
        where: { id: 'JOB_COUNTER' },
        update: { currentValue: 1018 },
        create: { id: 'JOB_COUNTER', currentValue: 1018 },
      });
    }

    // 6. Ensure Tushar's HR Profile exists and is Active
    const tusharUser = await prisma.user.findFirst({
      where: {
        email: { in: ['tusharchoudhari@gmail.com', 'tusharchaudhari@gmail.com'] },
      },
      include: { hrProfile: true },
    });

    if (tusharUser) {
      if (!tusharUser.hrProfile) {
        await prisma.hrProfile.create({
          data: {
            userId: tusharUser.id,
            employeeCode: 'RUP-HR-101',
            commissionRate: 5.0,
            whatsappTemplate: 'Hello {Candidate_Name}, this is Tushar from RiseUp Consultancy regarding your application for {Job_Title} in {City}. Are you available for interview today? Please reply fast.',
          },
        });
        console.log(`[RiseUp HR Sync] Initialized HR profile for ${tusharUser.email}.`);
      } else {
        console.log(`[RiseUp HR Sync] Verified HR profile for ${tusharUser.email}.`);
      }
    }

    console.log('[RiseUp Admin Sync] Credentials & Mandates sync completed successfully!');
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

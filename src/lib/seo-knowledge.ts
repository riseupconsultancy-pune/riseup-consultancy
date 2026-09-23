/**
 * Centralized SEO & Agentic AI Knowledge Base for Rise Up Consultancy
 * Contains 7 Major Indian Metro Cities, 70 Micro-Market IT/BPO Hubs,
 * 52 Specialized Job Profiles, and Programmatic SEO generation utilities.
 */

export interface MicroMarket {
  name: string;
  landmarks: string[];
  popularRoles: string[];
  employerQueries?: string[];
  b2bServices?: string[];
}

export interface B2bServiceOffering {
  id: string;
  name: string;
  shortDesc: string;
  turnaroundSla: string;
  replacementWarranty: string;
  bestSuitedFor: string;
  keyDeliverables: string[];
}

export interface CitySeoProfile {
  slug: string;
  name: string;
  state: string;
  country: string;
  headline: string;
  description: string;
  hubs: MicroMarket[];
  faqs: { question: string; answer: string }[];
}

export interface JobProfileCategory {
  cluster: string;
  roles: string[];
}

export const JOB_PROFILE_CLUSTERS: JobProfileCategory[] = [
  {
    cluster: "BPO / BPM Voice & International Operations",
    roles: [
      "Inbound Customer Support Specialist",
      "Outbound Telecalling Associate",
      "International Voice Process Executive (US/UK Shift)",
      "Domestic Voice Process Executive (Day Shift)",
      "Blended Customer Service Representative",
      "Technical Support Executive (L1 / L2 Desktop Support)",
      "Customer Retention & Escalations Officer",
      "Customer Success Associate",
      "Client Relationship Executive",
      "Telesales Specialist (B2B / B2C Inside Sales)",
    ],
  },
  {
    cluster: "Non-Voice, Back Office & Digital Support",
    roles: [
      "Back Office Executive",
      "Back Office Operations Specialist",
      "Non-Voice Customer Support Associate",
      "Live Chat Support Specialist",
      "Email Support Representative",
      "Omnichannel Digital Support Executive",
      "Order Processing Coordinator",
      "Catalog Management & E-Commerce Listing Associate",
      "Dispatch & Logistics Operations Executive",
      "Content Moderation & Review Specialist",
    ],
  },
  {
    cluster: "Data Processing, MIS & Office Automation",
    roles: [
      "Data Entry Operator (DEO)",
      "Advanced Excel Specialist",
      "MIS Executive (Management Information Systems)",
      "Billing & Invoicing Operations Clerk",
      "Document Verification Specialist",
      "Records Management Analyst",
      "Office Assistant / Computer Operator",
      "Data Mining & Web Research Associate",
      "Lead Generation Executive",
      "Inventory Data Coordinator",
    ],
  },
  {
    cluster: "Banking, Financial Services & Insurance (BFSI)",
    roles: [
      "KYC (Know Your Customer) Verification Officer",
      "AML (Anti-Money Laundering) Analyst",
      "Banking Operations Associate (CASA / Teller Support)",
      "Loan Processing & Documentation Officer",
      "Credit Card Verification Executive",
      "Accounts Payable (AP) Clerk",
      "Accounts Receivable (AR) Specialist",
      "Collections & Debt Recovery Executive",
      "Insurance Claims Processing Associate",
      "Underwriting Support Executive",
    ],
  },
  {
    cluster: "Healthcare BPO & Revenue Cycle Management (RCM)",
    roles: [
      "US Healthcare AR Caller",
      "Medical Billing Executive",
      "Medical Coding Trainee / Specialist",
      "Prior Authorization Specialist",
      "Healthcare Claims Adjudicator",
    ],
  },
  {
    cluster: "Management, Quality & Recruitment",
    roles: [
      "BPO Quality Analyst (QA / Call Auditor)",
      "Workforce Management (WFM) Real-Time Analyst",
      "BPO Team Leader (Operations Supervisor)",
      "Voice & Accent (V&A) Soft Skills Trainer",
      "HR Recruiter (BPO / Staffing Talent Acquisition)",
      "Front Office Executive / Corporate Receptionist",
      "Executive Assistant / Administrative Coordinator",
    ],
  },
];

export const ALL_JOB_PROFILES = JOB_PROFILE_CLUSTERS.flatMap((c) => c.roles);

/**
 * 53 High-Converting B2B Employer & Corporate Talent Supply Query Archetypes
 * Parameterized by {city}, {area}, and {landmark}.
 */
export const EMPLOYER_QUERY_TEMPLATES: string[] = [
  // 1. Core Talent Supply & Agency Formats (15)
  "talent supply in {city} {area}",
  "talent supply agency in {area} {city}",
  "best talent supply agency in {city}",
  "top talent supply agency in {area} {city}",
  "recruitment agency in {area} {city}",
  "top recruitment agency in {area} {city}",
  "manpower consultancy in {area} {city}",
  "manpower supply agency in {area} {city}",
  "manpower recruitment vendor in {area} {city}",
  "staffing agency in {area} {city}",
  "corporate staffing solutions in {area} {city}",
  "staffing company near {landmark}",
  "placement consultancy for companies in {area} {city}",
  "corporate talent acquisition partner in {area} {city}",
  "corporate manpower supplier in {area} {city}",

  // 2. BPO, BPM, Voice & Customer Care Staffing (10)
  "BPO recruitment agency in {area} {city}",
  "BPO staffing agency in {area} {city}",
  "BPO talent supplier in {area} {city}",
  "call center staffing agency in {area} {city}",
  "customer support talent supply in {area} {city}",
  "international voice process staffing in {area} {city}",
  "domestic customer care recruitment in {area} {city}",
  "night shift BPO staffing agency in {area} {city}",
  "telesales and inside sales manpower supplier in {area} {city}",
  "customer experience CX talent partner in {area} {city}",

  // 3. Non-Voice, Back Office & Data Operations Staffing (10)
  "back office staffing agency in {area} {city}",
  "back office manpower supplier in {area} {city}",
  "non-voice staff recruitment agency in {area} {city}",
  "data entry manpower supply in {area} {city}",
  "chat support staffing agency in {area} {city}",
  "email support executive talent supplier in {area} {city}",
  "advanced excel and MIS executive recruitment in {area} {city}",
  "catalog and order processing manpower vendor in {area} {city}",
  "document verification and KYC staff supplier in {area} {city}",
  "content moderation staffing partner in {area} {city}",

  // 4. BFSI, Healthcare & IT Helpdesk Staffing (8)
  "BFSI and banking recruitment agency in {area} {city}",
  "KYC and AML analyst talent supplier in {area} {city}",
  "medical billing staffing agency in {area} {city}",
  "US healthcare AR caller staffing in {area} {city}",
  "healthcare claims processing manpower in {area} {city}",
  "IT helpdesk recruitment consultants in {area} {city}",
  "desktop support L1 L2 staffing in {area} {city}",
  "accounts payable and receivable staffing in {area} {city}",

  // 5. Volume Hiring, SLAs & Hiring Models (10)
  "bulk hiring agency in {area} {city}",
  "volume hiring consultants in {area} {city}",
  "contract staffing agency in {area} {city}",
  "contract to hire staffing agency in {area} {city}",
  "temporary staffing agency in {area} {city}",
  "permanent staffing agency in {area} {city}",
  "RPO recruitment process outsourcing in {area} {city}",
  "turnkey recruitment agency in {area} {city}",
  "immediate joiners talent supply in {area} {city}",
  "fast turnaround staffing agency in {area} {city}",
];

/**
 * Generates 53 localized corporate employer search queries for any given city and area.
 */
export function generateEmployerSearchQueries(
  cityName: string,
  areaName: string,
  landmarks: string[] = []
): string[] {
  const primaryLandmark = landmarks[0] || areaName;
  return EMPLOYER_QUERY_TEMPLATES.map((tpl) =>
    tpl
      .replace(/{city}/g, cityName)
      .replace(/{area}/g, areaName)
      .replace(/{landmark}/g, primaryLandmark)
  );
}

/**
 * B2B Corporate Staffing Service Pillars with explicit SLAs and Guarantees.
 */
export const B2B_SERVICE_OFFERINGS: B2bServiceOffering[] = [
  {
    id: "bulk-bpo-staffing",
    name: "High-Volume BPO / BPM Cohort Staffing",
    shortDesc: "End-to-end batch sourcing and onboarding for 25 to 200+ customer support and telecalling seats.",
    turnaroundSla: "24–48 Hours First Batch Pipeline",
    replacementWarranty: "90-Day Free Candidate Replacement",
    bestSuitedFor: "Enterprise BPOs, E-commerce Support Centers, Fintech Helplines",
    keyDeliverables: [
      "Voice & Accent (V&A) assessed candidates",
      "Rotational & Night shift availability verified",
      "Immediate joiners with zero candidate drop-off guarantee",
      "Batch walk-in drives managed at client premises or RiseUp center",
    ],
  },
  {
    id: "back-office-data-ops",
    name: "Back Office, Non-Voice & Data Operations Manpower",
    shortDesc: "Screened clerical, data verification, Advanced Excel/MIS, and digital chat/email associates.",
    turnaroundSla: "24–36 Hours Shortlist Turnaround",
    replacementWarranty: "60-Day Free Candidate Replacement",
    bestSuitedFor: "Shared Services Centers, BFSI Back Offices, Logistics Hubs",
    keyDeliverables: [
      "Typing speed test verified (30–45+ WPM with 95%+ accuracy)",
      "MS Excel test conducted (VLOOKUP, Pivot Tables, SUMIFS)",
      "Document verification and compliance adherence checked",
      "Flexible Day or Night shift alignment",
    ],
  },
  {
    id: "lateral-permanent-hiring",
    name: "Permanent Lateral Placement & Executive Staffing",
    shortDesc: "Mid-level corporate hiring for Team Leaders, Quality Analysts, Process Trainers, and Operations Supervisors.",
    turnaroundSla: "3–5 Business Days",
    replacementWarranty: "90-Day Free Replacement Guarantee",
    bestSuitedFor: "Growing Tech Startups, Global In-House Centers (GICs), Established Corporates",
    keyDeliverables: [
      "Deep behavioral & KPI performance verification",
      "Past attrition management and team retention audit",
      "Competitive CTC benchmark negotiation",
      "Reference and credential background check",
    ],
  },
  {
    id: "turnkey-rpo",
    name: "Turnkey Recruitment Process Outsourcing (RPO)",
    shortDesc: "Dedicated recruitment taskforce acting as an integrated extension of corporate talent acquisition.",
    turnaroundSla: "Continuous Real-Time Talent Pipeline",
    replacementWarranty: "Full Term Account SLA Guarantee",
    bestSuitedFor: "Rapid-scale expansions, new city launch setups, seasonal ramp-ups",
    keyDeliverables: [
      "Dedicated On-site or Virtual Account Lead",
      "Custom applicant tracking and ATS pipeline reporting",
      "Standardized interview scorecard delivery",
      "Zero candidate placement fee guarantee across all operations",
    ],
  },
];

export const METRO_CITY_SEO_PROFILES: Record<string, CitySeoProfile> = {
  pune: {
    slug: "pune",
    name: "Pune",
    state: "Maharashtra",
    country: "India",
    headline: "Back Office, BPO Voice & Non-Voice Jobs in Pune",
    description:
      "Explore 100% free placement openings for freshers and experienced candidates across Kharadi, Hinjewadi, Viman Nagar, Magarpatta, Hadapsar, and PCMC. Verified corporate and MNC placements on direct company payroll.",
    hubs: [
      {
        name: "Kharadi",
        landmarks: ["EON Free Zone Phase 1 & 2", "World Trade Center (WTC)", "Zensar Knowledge Park"],
        popularRoles: ["Back Office Operations", "Voice Customer Care", "International BPO", "Chat Support"],
      },
      {
        name: "Hinjewadi",
        landmarks: ["Rajiv Gandhi Infotech Park Phase 1", "Phase 2 & 3", "Embassy TechZone", "Quadron Business Park"],
        popularRoles: ["Technical Support L1", "Non-Voice Process", "US Shift Voice Support", "MIS Executive"],
      },
      {
        name: "Viman Nagar",
        landmarks: ["Giga Space IT Park", "Weikfield Infotech Park", "Town Square", "Symbiosis Road"],
        popularRoles: ["Inbound Customer Support", "Email & Chat Process", "Domestic BPO", "Day Shift Back Office"],
      },
      {
        name: "Magarpatta City",
        landmarks: ["Cybercity Tower 1-12", "Destiny IT SEZ", "Mega Center Hadapsar"],
        popularRoles: ["Banking Operations", "KYC Verification", "Data Entry Operator", "Advanced Excel MIS"],
      },
      {
        name: "Hadapsar",
        landmarks: ["SP Infocity", "Phursungi IT Park", "Pune-Solapur Highway Belt"],
        popularRoles: ["Non-Voice Customer Service", "Order Processing", "AR Calling", "Telecalling Executive"],
      },
      {
        name: "Baner & Balewadi",
        landmarks: ["Balewadi High Street", "Amar Apex", "Sadanand Business District"],
        popularRoles: ["Inside Sales", "Customer Success", "Digital Support", "Lead Generation Executive"],
      },
      {
        name: "Pimpri-Chinchwad (PCMC)",
        landmarks: ["Bhosari MIDC", "Talawade IT Park", "Nigdi Commercial Corridor"],
        popularRoles: ["Back Office Clerk", "Computer Operator", "Billing Executive", "Data Entry Operator"],
      },
      {
        name: "Yerwada",
        landmarks: ["Commerzone IT Park", "Business Bay", "Golf Course Road"],
        popularRoles: ["Financial Data Entry", "International Voice", "Night Shift Support", "Quality Analyst"],
      },
      {
        name: "Kalyani Nagar",
        landmarks: ["Cerebrum IT Park", "Marigold Complex", "Gold Adlabs Commercial Corridor"],
        popularRoles: ["Client Relationship Executive", "Chat Support", "Email Support", "Front Office"],
      },
      {
        name: "Chandan Nagar",
        landmarks: ["Near Kumar Megaplex", "Nagar Road Corridor", "RiseUp Pune Headquarters"],
        popularRoles: ["Freshers Placement", "Direct Walk-in Interview", "HR Recruiter", "BPO Process Associate"],
      },
    ],
    faqs: [
      {
        question: "Does Rise Up Consultancy charge any registration or interview fee in Pune?",
        answer:
          "No. Rise Up Consultancy operates under a strict 100% Free Candidate Placement standard. We never charge registration fees, bond money, or training charges from job seekers. All compensation comes from corporate hiring partners.",
      },
      {
        question: "Which areas in Pune have the most back office and BPO vacancies?",
        answer:
          "Kharadi (EON IT Park & WTC), Hinjewadi Infotech Park (Phases 1-3), Viman Nagar (Giga Space), and Magarpatta City Hadapsar are the primary employment clusters with daily hiring drives.",
      },
      {
        question: "Can freshers (12th Pass / Graduate) apply for jobs in Pune through Rise Up?",
        answer:
          "Yes. We specialize in fresher hiring across Voice, Non-Voice, Back Office, and Data Entry with starting salary packages typically ranging from ₹18,000 to ₹35,000 per month depending on English communication skills and shift availability.",
      },
    ],
  },

  bengaluru: {
    slug: "bengaluru",
    name: "Bengaluru",
    state: "Karnataka",
    country: "India",
    headline: "BPO, Back Office & Tech Support Jobs in Bengaluru (Bangalore)",
    description:
      "Find genuine, verified customer support, non-voice back office, and international service desk openings in Whitefield, Electronic City, Manyata Tech Park, Bellandur, and Koramangala.",
    hubs: [
      {
        name: "Whitefield",
        landmarks: ["ITPB (International Tech Park)", "EPIP Zone", "Sigma Tech Park"],
        popularRoles: ["Technical Support L1", "International Voice", "Chat Process", "Data Entry"],
      },
      {
        name: "Electronic City",
        landmarks: ["Phase 1 & Phase 2", "Infosys Campus Corridor", "Wipro SEZ"],
        popularRoles: ["Non-Voice Back Office", "MIS Specialist", "Customer Care Executive", "KYC Analyst"],
      },
      {
        name: "Manyata Tech Park",
        landmarks: ["Nagawara Outer Ring Road", "Thanisandra Main Road", "Hebbal Junction"],
        popularRoles: ["US Healthcare AR Caller", "Global Service Desk", "Customer Success", "Back Office"],
      },
      {
        name: "Bellandur & ORR",
        landmarks: ["RMZ Ecospace", "Prestige Tech Park", "Ecoworld Campus"],
        popularRoles: ["Fintech Operations", "Order Processing", "Email Support", "Advanced Excel"],
      },
      {
        name: "Koramangala",
        landmarks: ["Sony World Junction", "Inner Ring Road", "Koramangala 4th & 5th Block"],
        popularRoles: ["Inside Sales", "Customer Support Specialist", "Startup Operations", "Telecalling"],
      },
      {
        name: "HSR Layout",
        landmarks: ["Sectors 1-7", "27th Main Road Commercial Hub", "Silk Board Connector"],
        popularRoles: ["Client Relationship Associate", "Digital Support", "Back Office", "Billing Clerk"],
      },
      {
        name: "Marathahalli",
        landmarks: ["Multiplex Junction", "ORR Bridge", "Kalamandir Tech Corridor"],
        popularRoles: ["Inbound Voice Process", "Day Shift Customer Support", "Data Entry Operator"],
      },
      {
        name: "Indiranagar",
        landmarks: ["100 Feet Road", "12th Main Road", "CMH Road"],
        popularRoles: ["Executive Assistant", "Customer Experience Specialist", "Front Office Coordinator"],
      },
      {
        name: "BTM Layout",
        landmarks: ["Outer Ring Road BTM 2nd Stage", "Bannerghatta Road Junction"],
        popularRoles: ["Fresher Customer Care", "Domestic BPO", "Documentation Clerk", "Telecalling"],
      },
      {
        name: "Bagmane Tech Park",
        landmarks: ["CV Raman Nagar", "Kaggadasapura", "Old Madras Road"],
        popularRoles: ["IT Helpdesk Analyst", "Medical Billing", "Claims Processing", "Content Moderation"],
      },
    ],
    faqs: [
      {
        question: "How can I apply for verified BPO openings in Bengaluru?",
        answer:
          "Submit your application through Rise Up Consultancy's direct online portal. Our recruiters pre-screen your profile and connect you with verified enterprise employers with zero charges.",
      },
      {
        question: "Do companies in Bangalore offer cab facilities for night shifts?",
        answer:
          "Yes. International BPO processes operating on US or UK shifts in Whitefield, Manyata, and Electronic City provide two-way door-to-door cab facilities along with shift allowances.",
      },
    ],
  },

  hyderabad: {
    slug: "hyderabad",
    name: "Hyderabad",
    state: "Telangana",
    country: "India",
    headline: "BPO, Back Office & IT Helpdesk Jobs in Hyderabad",
    description:
      "Direct company payroll vacancies in HITEC City, Gachibowli, Madhapur, Kondapur, and Nanakramguda Financial District. 100% Free candidate placement assistance.",
    hubs: [
      {
        name: "HITEC City",
        landmarks: ["Cyber Towers", "Mindspace IT Park", "Cyber Gateway"],
        popularRoles: ["International Voice Process", "US Healthcare AR Caller", "Chat Support", "Back Office"],
      },
      {
        name: "Gachibowli",
        landmarks: ["DLF Cyber City", "IIIT Junction", "Telecom Nagar"],
        popularRoles: ["Technical Support Executive", "Non-Voice Associate", "MIS Executive", "Data Entry"],
      },
      {
        name: "Madhapur",
        landmarks: ["Image Gardens Road", "Inorbit Mall Corridor", "Avasa Commercial Hub"],
        popularRoles: ["Customer Care Representative", "Inbound Voice Support", "Email Support"],
      },
      {
        name: "Financial District",
        landmarks: ["Nanakramguda", "Waverock SEZ", "Q-City"],
        popularRoles: ["Banking Operations", "AML / KYC Compliance", "Accounts Payable", "Financial Data Entry"],
      },
      {
        name: "Kondapur",
        landmarks: ["Botanical Garden Road", "Kothaguda Junction", "Tech Mahindra Corridor"],
        popularRoles: ["Fresher BPO Jobs", "Inside Sales Associate", "Day Shift Support", "Telecalling"],
      },
      {
        name: "Kukatpally (KPHB)",
        landmarks: ["JNTU Tech Road", "KPHB Colony Commercial Area"],
        popularRoles: ["Domestic BPO", "Data Entry Operator", "Documentation Clerk", "Back Office"],
      },
      {
        name: "Begumpet & Secunderabad",
        landmarks: ["Prakash Nagar", "Rashtrapati Road", "SP Road"],
        popularRoles: ["Office Assistant", "Customer Support", "Telecalling Executive", "Billing Clerk"],
      },
      {
        name: "Uppal",
        landmarks: ["NSL Arena SEZ", "Genpact Uppal Campus", "Inner Ring Road"],
        popularRoles: ["Non-Voice Process", "Claims Processing", "Content Review", "Data Processing"],
      },
      {
        name: "Pocharam",
        landmarks: ["Raheja Mindspace East", "Infosys SEZ Campus"],
        popularRoles: ["IT Service Desk", "Technical Support", "Night Shift BPO", "Back Office"],
      },
      {
        name: "Jubilee Hills",
        landmarks: ["Road No. 36", "Checkpost Commercial Area"],
        popularRoles: ["Client Relationship Manager", "Customer Success", "Front Office Executive"],
      },
    ],
    faqs: [
      {
        question: "What is the typical salary for freshers in Hyderabad BPOs?",
        answer:
          "Starting CTC for freshers in Hyderabad ranges from ₹18,000 to ₹32,000 per month for international Voice and Non-Voice processes with additional night shift allowances.",
      },
      {
        question: "Are there day-shift back office jobs available in Hyderabad?",
        answer:
          "Yes. Multiple banking, fintech, and domestic operations in HITEC City and Gachibowli offer pure day-shift schedules (10:00 AM to 7:00 PM) with weekend offs.",
      },
    ],
  },

  mumbai: {
    slug: "mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    country: "India",
    headline: "Back Office, BPO & Banking Operations Jobs in Mumbai & Navi Mumbai",
    description:
      "Explore immediate joining jobs across Powai, Andheri East, BKC, Malad Mindspace, Airoli, Ghansoli, and Thane. 100% Free placement assistance by Rise Up Consultancy.",
    hubs: [
      {
        name: "Powai",
        landmarks: ["Hiranandani Business Park", "Supreme Business Park", "Kensington SEZ"],
        popularRoles: ["Investment Banking Operations", "KYC Verification", "US Voice Support", "Advanced Excel"],
      },
      {
        name: "Andheri East",
        landmarks: ["MIDC Industrial Area", "SEEPZ SEZ", "Chakala", "JB Nagar"],
        popularRoles: ["Back Office Executive", "Data Entry Operator", "International BPO", "Customer Care"],
      },
      {
        name: "Bandra Kurla Complex (BKC)",
        landmarks: ["G Block", "MMRDA Grounds", "Bharat Diamond Bourse Area"],
        popularRoles: ["Financial Operations", "Compliance Associate", "Client Services", "Accounts Receivable"],
      },
      {
        name: "Malad West",
        landmarks: ["Mindspace IT Park", "Link Road Commercial Belt", "Inorbit Malad"],
        popularRoles: ["International Voice Process", "UK Shift Non-Voice", "Collections Executive", "Chat Support"],
      },
      {
        name: "Airoli (Navi Mumbai)",
        landmarks: ["Mindspace Airoli East", "Mindspace West", "Gigaplex IT Park"],
        popularRoles: ["Healthcare AR Caller", "IT Service Desk", "Back Office Operations", "Customer Support"],
      },
      {
        name: "Ghansoli (Navi Mumbai)",
        landmarks: ["Millennium Business Park (MBP)", "Reliance Corporate Park (RCP)"],
        popularRoles: ["Data Processing", "Computer Operator", "Domestic BPO", "Email Support Representative"],
      },
      {
        name: "Thane West",
        landmarks: ["Wagle Estate", "Ashar IT Park", "Ghodbunder Road"],
        popularRoles: ["Voice Process Executive", "Telecalling", "MIS Coordinator", "Back Office Clerk"],
      },
      {
        name: "Vashi (Navi Mumbai)",
        landmarks: ["Infotech Park", "Sector 30A Commercial Hub", "Vashi Plaza"],
        popularRoles: ["Inbound Customer Support", "KYC Executive", "Billing Specialist", "Inside Sales"],
      },
      {
        name: "Goregaon East",
        landmarks: ["Nesco IT Park", "Commerz 1 & 2", "Western Express Highway"],
        popularRoles: ["Digital Operations", "Customer Experience", "Content Moderation", "Non-Voice Support"],
      },
      {
        name: "Lower Parel",
        landmarks: ["One World Center", "Peninsula Business Park", "Kamala Mills"],
        popularRoles: ["Financial Data Analyst", "Relationship Associate", "Executive Assistant", "Front Desk"],
      },
    ],
    faqs: [
      {
        question: "Does Rise Up Consultancy provide jobs near local train stations in Mumbai?",
        answer:
          "Yes. Most of our partner hiring hubs in Andheri East, Malad Mindspace, Thane Wagle Estate, and Navi Mumbai Airoli are located within 10–15 minutes of local railway and metro stations.",
      },
    ],
  },

  "delhi-ncr": {
    slug: "delhi-ncr",
    name: "Delhi-NCR",
    state: "Delhi & Haryana",
    country: "India",
    headline: "BPO, Customer Support & Back Office Jobs in Gurgaon & Noida",
    description:
      "Find top MNC and enterprise BPO vacancies in Cyber City Gurgaon, Udyog Vihar, Sector 62 Noida, and Okhla South Delhi. 100% Free recruiter support.",
    hubs: [
      {
        name: "Cyber City (Gurgaon)",
        landmarks: ["DLF Cyber Hub", "Building 5, 8, 10 & 14", "Rapid Metro Corridor"],
        popularRoles: ["International Voice Process", "Customer Success Specialist", "Technical Support", "Chat Process"],
      },
      {
        name: "Udyog Vihar (Gurgaon)",
        landmarks: ["Phases 1-5", "Old Delhi-Gurgaon Road", "Sector 18 Gurgaon"],
        popularRoles: ["Back Office Executive", "Non-Voice Associate", "Data Entry Operator", "Inside Sales"],
      },
      {
        name: "Golf Course Road (Gurgaon)",
        landmarks: ["One Horizon Center", "Two Horizon", "Sector 54/55 Metro"],
        popularRoles: ["Financial Operations", "Client Servicing", "Executive Assistant", "US Healthcare AR"],
      },
      {
        name: "Sector 62 (Noida)",
        landmarks: ["Stellar IT Park", "The Correnthum", "Logix Cyber Park"],
        popularRoles: ["Medical Billing Executive", "BPO Customer Support", "MIS Specialist", "Data Entry"],
      },
      {
        name: "Sector 18 & Film City (Noida)",
        landmarks: ["Sector 18 Commercial Market", "Sector 16 Film City"],
        popularRoles: ["Telecalling Executive", "Digital Marketing Support", "Customer Care Associate"],
      },
      {
        name: "Noida Expressway (Sectors 125-135)",
        landmarks: ["Advant Navis Business Park", "Express Trade Towers", "Oxygen SEZ"],
        popularRoles: ["International Voice", "Non-Voice Support", "KYC Officer", "Claims Processing"],
      },
      {
        name: "Okhla Industrial Area",
        landmarks: ["Phases 1, 2 & 3", "Modi Mill", "Kalka Mandir Corridor"],
        popularRoles: ["Back Office Clerk", "Computer Operator", "Domestic Call Center", "Billing Executive"],
      },
      {
        name: "Connaught Place",
        landmarks: ["Barakhamba Road", "Kasturba Gandhi Marg", "Tolstoy Marg"],
        popularRoles: ["Travel BPO Specialist", "Visa Operations Associate", "Customer Relationship Executive"],
      },
      {
        name: "Nehru Place",
        landmarks: ["Eros Corporate Tower", "Devika Tower", "Metro Hub"],
        popularRoles: ["IT Helpdesk Analyst", "Accounts Assistant", "Data Processing", "Front Office"],
      },
      {
        name: "Greater Noida",
        landmarks: ["Knowledge Park 1-3", "Pari Chowk IT Corridor"],
        popularRoles: ["Fresher BPO Openings", "Documentation Associate", "Day Shift Support"],
      },
    ],
    faqs: [
      {
        question: "Which companies hire through Rise Up in Gurgaon Cyber City?",
        answer:
          "We coordinate staffing for Tier-1 BPOs, Fortune 500 shared services, e-commerce giants, and fintech platforms in Gurgaon. Candidate placement is completely free.",
      },
    ],
  },

  chennai: {
    slug: "chennai",
    name: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    headline: "BPO Voice, Non-Voice & Healthcare AR Jobs in Chennai",
    description:
      "Top customer support, US healthcare medical billing, and back office vacancies across OMR, Sholinganallur, Taramani TIDEL Park, Guindy, and Ambattur.",
    hubs: [
      {
        name: "OMR (IT Expressway)",
        landmarks: ["Rajiv Gandhi Salai", "TIDEL Park", "Kandanchavadi IT Zone"],
        popularRoles: ["International Voice Process", "US Healthcare AR Caller", "Chat Support", "Back Office"],
      },
      {
        name: "Sholinganallur",
        landmarks: ["ELCOT SEZ", "Wipro Junction", "TCS Sholinganallur Campus"],
        popularRoles: ["Medical Billing Executive", "Non-Voice Associate", "MIS Specialist", "Data Entry"],
      },
      {
        name: "Taramani",
        landmarks: ["Ascendas International Tech Park", "TIDEL Park Phase 1 & 2"],
        popularRoles: ["Technical Support Executive", "Global Service Desk", "Customer Care", "Claims Analyst"],
      },
      {
        name: "Guindy",
        landmarks: ["Olympia Tech Park", "SIDCO Industrial Estate", "Kathipara Junction"],
        popularRoles: ["Inbound Customer Support", "Day Shift Back Office", "KYC Officer", "Telecalling"],
      },
      {
        name: "Siruseri",
        landmarks: ["SIPCOT IT Park", "Asia's Largest IT SEZ"],
        popularRoles: ["Night Shift Voice BPO", "Medical Coding Trainee", "Data Processing", "IT Helpdesk"],
      },
      {
        name: "Ambattur",
        landmarks: ["AMBIT IT Park", "Prince Info Park", "Industrial Estate"],
        popularRoles: ["Domestic BPO", "Computer Operator", "Documentation Clerk", "Inside Sales"],
      },
      {
        name: "Porur",
        landmarks: ["DLF Cybercity", "L&T Infotech Campus", "Mount-Poonamallee Road"],
        popularRoles: ["Customer Success", "Digital Support", "Email Process", "Accounts Receivable"],
      },
      {
        name: "Perungudi",
        landmarks: ["SP Infocity", "RMZ Millenia Business Park"],
        popularRoles: ["Financial Operations", "AR Calling", "Quality Analyst", "Back Office Executive"],
      },
      {
        name: "Velachery",
        landmarks: ["Grand Square Junction", "100 Feet Bypass Road"],
        popularRoles: ["Customer Care Representative", "Billing Executive", "Data Entry Operator"],
      },
      {
        name: "Nungambakkam & Mount Road",
        landmarks: ["Anna Salai Commercial Corridor", "Gemini Flyover Hub"],
        popularRoles: ["Front Office Executive", "Executive Assistant", "Client Servicing Specialist"],
      },
    ],
    faqs: [
      {
        question: "Are US Healthcare and Medical Billing jobs available in Chennai?",
        answer:
          "Yes. Chennai OMR and Sholinganallur are India's premier hubs for US Revenue Cycle Management (RCM), medical billing, and AR calling with excellent night shift packages.",
      },
    ],
  },

  kolkata: {
    slug: "kolkata",
    name: "Kolkata",
    state: "West Bengal",
    country: "India",
    headline: "BPO Voice, Chat & Back Office Jobs in Kolkata (Sector V & New Town)",
    description:
      "Verified BPO customer service, non-voice chat, and data entry job vacancies in Salt Lake Sector V, Rajarhat New Town, and Park Street. 100% Free candidate placement.",
    hubs: [
      {
        name: "Salt Lake Sector V",
        landmarks: ["Webel Bhavan", "Infinity Benchmark", "RDB Boulevard", "College More"],
        popularRoles: ["International Voice Process", "Chat Support", "Email Support", "Back Office Executive"],
      },
      {
        name: "New Town Action Area 1",
        landmarks: ["DLF 1 & 2", "Candor TechSpace", "Axis Mall Corridor"],
        popularRoles: ["Non-Voice Customer Service", "Data Entry Operator", "Advanced Excel MIS", "Telecalling"],
      },
      {
        name: "New Town Action Area 2 & 3",
        landmarks: ["EcoSpace Business Park", "TCS Gitanjali Park", "Unitech Infospace"],
        popularRoles: ["Technical Support", "Healthcare AR Calling", "KYC Officer", "Order Processing"],
      },
      {
        name: "Park Street & Camac Street",
        landmarks: ["Park Center", "Industry House", "Russell Street"],
        popularRoles: ["Client Relationship Associate", "Front Desk Executive", "Inside Sales Specialist"],
      },
      {
        name: "Dalhousie & BBD Bagh",
        landmarks: ["Brabourne Road", "Fairlie Place", "Exchange Place"],
        popularRoles: ["Banking Back Office", "Accounts Clerk", "Documentation Officer", "Computer Operator"],
      },
      {
        name: "Kasba Industrial Estate",
        landmarks: ["Ruby Hospital Connector", "Acropolis Mall Commercial Towers"],
        popularRoles: ["Customer Support Executive", "Billing Specialist", "Lead Generation Executive"],
      },
      {
        name: "Bidhannagar & Karunamoyee",
        landmarks: ["Central Park Bidhannagar", "Karunamoyee Bus Terminus Hub"],
        popularRoles: ["Domestic BPO Jobs", "Day Shift Telecaller", "Office Assistant", "Data Processing"],
      },
      {
        name: "Topsia & EM Bypass",
        landmarks: ["Silver Spring Commercial", "Science City Connector"],
        popularRoles: ["Logistics Coordinator", "Customer Care Associate", "Back Office Clerk"],
      },
      {
        name: "Howrah & Shibpur",
        landmarks: ["Kona Expressway Corridor", "Howrah Commercial Area"],
        popularRoles: ["Data Entry Operator", "Computer Operator", "Telesales Executive"],
      },
      {
        name: "Alipore & Taratala",
        landmarks: ["Diamond Harbour Road", "Taratala Industrial Area"],
        popularRoles: ["Accounts Assistant", "Inventory Data Coordinator", "Office Clerk"],
      },
    ],
    faqs: [
      {
        question: "Can freshers get immediate BPO joining in Kolkata Sector V?",
        answer:
          "Yes. Sector V and New Town feature dozens of large international and domestic BPO centers conducting daily walk-in interviews with immediate offer letters for candidates with good English or regional language skills.",
      },
    ],
  },
};

// -----------------------------------------------------------------------------
// Auto-Enrich All 70 Micro-Markets with 53 Localized B2B Employer Search Queries
// -----------------------------------------------------------------------------
const CITY_EMPLOYER_FAQS: Record<string, { question: string; answer: string }[]> = {
  pune: [
    {
      question: "How does Rise Up Consultancy supply BPO and Back Office talent to companies in Pune (Kharadi & Hinjewadi)?",
      answer:
        "Rise Up Consultancy operates a dedicated sourcing hub in Chandan Nagar (Nagar Road), maintaining an active talent pool of over 5,000+ pre-assessed candidates across Kharadi EON IT Park, Hinjewadi Infotech Park, Viman Nagar, and PCMC. We deliver shortlists within 24–48 hours, conduct preliminary Voice & Accent (V&A) or typing/Excel tests, and provide a 90-day free candidate replacement guarantee under corporate client agreements.",
    },
    {
      question: "What is the fee structure for corporate employers hiring through Rise Up Consultancy in Pune?",
      answer:
        "Rise Up Consultancy charges zero fees from candidates. Corporate clients are billed on standard success-based contingency or turnkey RPO placement fees, payable only upon successful joining and candidate verification.",
    },
  ],
  bengaluru: [
    {
      question: "What is Rise Up Consultancy's turnaround time for BPO talent supply in Whitefield and Electronic City?",
      answer:
        "For volume hiring batches (25 to 100+ customer support or technical service desk associates), our dedicated Bengaluru recruitment team provides initial qualified interview batches within 24 to 48 hours, with on-site interview coordination at client tech parks (ITPB, Manyata, Ecospace).",
    },
    {
      question: "Does Rise Up Consultancy provide US healthcare AR caller and tech support staffing in Manyata & ORR?",
      answer:
        "Yes. We specialize in sourcing pre-screened US healthcare revenue cycle management (RCM) callers, medical billing executives, and L1/L2 IT helpdesk specialists with verified English communication and night-shift willingness.",
    },
  ],
  hyderabad: [
    {
      question: "Can companies in HITEC City and Gachibowli hire immediate joiners for BPO and non-voice operations?",
      answer:
        "Yes. We maintain a live pipeline of immediate joiners (0–15 days notice) for customer service, domestic/international voice, KYC verification, and transaction processing across Madhapur, Financial District, and Uppal SEZs.",
    },
  ],
  mumbai: [
    {
      question: "How does Rise Up Consultancy handle high-volume BPO hiring in Powai, Airoli Mindspace, and Malad?",
      answer:
        "We conduct centralized digital screening and drive coordination across MMR. Our recruiters verify commuting convenience, shift rotation readiness, and technical aptitude to maintain 90%+ interview attendance ratios.",
    },
  ],
  "delhi-ncr": [
    {
      question: "Does Rise Up Consultancy support corporate staffing across Gurugram Cyber City and Noida Expressway?",
      answer:
        "Yes. We supply talent for corporate back offices, travel BPOs, fintech verification desks, and omnichannel customer care across DLF Cyber City, Udyog Vihar, and Noida Sector 62 / Expressway SEZs.",
    },
  ],
  chennai: [
    {
      question: "What corporate staffing solutions are available for IT and BPO firms in OMR and Taramani?",
      answer:
        "Rise Up Consultancy supplies pre-screened voice process associates, medical coders, AR callers, and IT service desk engineers with guaranteed 24–48 hour interview pipelines across TIDEL Park, Sholinganallur, and Guindy.",
    },
  ],
  kolkata: [
    {
      question: "Can enterprise clients in Salt Lake Sector V and New Town engage Rise Up Consultancy for bulk recruitment?",
      answer:
        "Yes. We partner with international and domestic BPO centers in Sector V and EcoSpace New Town for high-volume customer care, chat support, and back-office data processing ramps.",
    },
  ],
};

// Initialize B2B queries and FAQs for all cities
for (const [citySlug, cityProfile] of Object.entries(METRO_CITY_SEO_PROFILES)) {
  // Append B2B FAQs
  const employerFaqs = CITY_EMPLOYER_FAQS[citySlug];
  if (employerFaqs) {
    cityProfile.faqs.push(...employerFaqs);
  }

  // Enrich each micro-market hub
  for (const hub of cityProfile.hubs) {
    hub.employerQueries = generateEmployerSearchQueries(cityProfile.name, hub.name, hub.landmarks);
    hub.b2bServices = [
      `High-Volume BPO & Customer Care Staffing in ${hub.name}`,
      `Back Office, Non-Voice & Data Operations Manpower Supply`,
      `Permanent Lateral & Team Leader Placement near ${hub.landmarks[0] || hub.name}`,
      `Contract-to-Hire & Rapid RPO Turnaround in ${cityProfile.name}`,
    ];
  }
}

/**
 * Returns all generated B2B corporate employer search queries for an entire city (500+ queries).
 */
export function getAllEmployerQueriesForCity(citySlug: string): string[] {
  const profile = METRO_CITY_SEO_PROFILES[citySlug];
  if (!profile) return [];
  return profile.hubs.flatMap((h) => h.employerQueries || []);
}

/**
 * Returns top curated employer queries for a specific micro-market hub.
 */
export function getTopEmployerQueriesForHub(citySlug: string, hubName: string, count = 12): string[] {
  const profile = METRO_CITY_SEO_PROFILES[citySlug];
  if (!profile) return [];
  const hub = profile.hubs.find((h) => h.name.toLowerCase() === hubName.toLowerCase());
  if (!hub || !hub.employerQueries) return [];
  return hub.employerQueries.slice(0, count);
}


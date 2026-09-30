const path = require('path');
const { PrismaClient } = require(path.join(__dirname, '..', 'node_modules', '@prisma', 'client'));
const prisma = new PrismaClient();

const DEFAULT_WHATSAPP_TEMPLATE = `Dear {candidate_name},

Congratulations! You have been shortlisted for an interview with {company_name} for the position of *{job_title}* (Job ID: *{job_id}*).

Your interview has been scheduled. Please visit the given location for your interview:

📅 *Interview Date & Time:*
{interview_date}

📍 *Interview Venue / Location:*
{interview_venue}

🗺️ *Google Maps GPS Location:*
{google_map_url}

👤 *Contact Person / SPOC:* {contact_person}
📞 *Contact Phone:* {contact_phone}

⚠️ *Important Instructions:*
1. Kindly visit the above interview location on your scheduled date & time.
2. At the company reception desk, please don't forget to mention *RiseUp Consultancy* as your consultancy referral.
3. Carry 2 printed hard copies of your updated resume and a valid Government Photo ID.
{interview_instructions}

Best of luck!
— {recruiter_name} | RiseUp Consultancy
📞 {recruiter_phone}`;

async function run() {
  const result = await prisma.hrProfile.updateMany({
    data: {
      whatsappTemplate: DEFAULT_WHATSAPP_TEMPLATE,
    },
  });
  console.log(`Successfully updated ${result.count} HR profiles with the official template.`);

  const profiles = await prisma.hrProfile.findMany({
    select: {
      employeeCode: true,
      whatsappTemplate: true,
    },
  });
  console.log("Updated Profiles:", profiles);
}

run()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

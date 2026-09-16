import prisma from "./prisma";

export async function generateJobId(): Promise<string> {
  const counter = await prisma.systemCounter.upsert({
    where: { id: "JOB_COUNTER" },
    update: { currentValue: { increment: 1 } },
    create: { id: "JOB_COUNTER", currentValue: 1001 },
  });
  return `RUP-JOB-${counter.currentValue}`;
}

export async function generateCandidateId(): Promise<string> {
  const counter = await prisma.systemCounter.upsert({
    where: { id: "CANDIDATE_COUNTER" },
    update: { currentValue: { increment: 1 } },
    create: { id: "CANDIDATE_COUNTER", currentValue: 1001 },
  });
  return `RUP-CAN-${counter.currentValue}`;
}

export async function generateAgreementId(): Promise<string> {
  const counter = await prisma.systemCounter.upsert({
    where: { id: "AGREEMENT_COUNTER" },
    update: { currentValue: { increment: 1 } },
    create: { id: "AGREEMENT_COUNTER", currentValue: 1001 },
  });
  return `RUP-AGR-${counter.currentValue}`;
}

export async function generateHREmployeeCode(): Promise<string> {
  const counter = await prisma.systemCounter.upsert({
    where: { id: "HR_COUNTER" },
    update: { currentValue: { increment: 1 } },
    create: { id: "HR_COUNTER", currentValue: 101 },
  });
  return `RUP-HR-${counter.currentValue}`;
}
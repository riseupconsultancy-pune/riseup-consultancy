-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'HR_RECRUITER',
    `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
    `lastLoginAt` DATETIME(3) NULL,
    `lastActiveAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClientProfile` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `companyName` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL DEFAULT 'India',
    `city` VARCHAR(191) NOT NULL,
    `industry` VARCHAR(191) NULL DEFAULT 'BPO / BPM',
    `contactPerson` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `billingAddress` TEXT NULL,
    `billingGstin` VARCHAR(191) NULL,
    `billingPan` VARCHAR(191) NULL,
    `billingContactPerson` VARCHAR(191) NULL,
    `billingEmail` VARCHAR(191) NULL,
    `billingPhone` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ClientProfile_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HrProfile` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `employeeCode` VARCHAR(191) NOT NULL,
    `commissionRate` DOUBLE NULL DEFAULT 0.0,
    `whatsappTemplate` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `HrProfile_userId_key`(`userId`),
    UNIQUE INDEX `HrProfile_employeeCode_key`(`employeeCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vacancy` (
    `id` VARCHAR(191) NOT NULL,
    `jobId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `clientId` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL DEFAULT 'India',
    `city` VARCHAR(191) NOT NULL,
    `expMin` INTEGER NOT NULL DEFAULT 0,
    `expMax` INTEGER NOT NULL DEFAULT 5,
    `workMode` VARCHAR(191) NOT NULL DEFAULT 'On-site',
    `shift` VARCHAR(191) NULL DEFAULT 'Day Shift',
    `salaryMin` DOUBLE NULL,
    `salaryMax` DOUBLE NULL,
    `salaryCurrency` VARCHAR(191) NOT NULL DEFAULT 'INR',
    `headcount` INTEGER NOT NULL DEFAULT 1,
    `availabilityRequired` VARCHAR(191) NOT NULL DEFAULT 'Immediate Joiner',
    `description` TEXT NOT NULL,
    `requirements` TEXT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING_REVIEW',
    `isBroadcastedToHR` BOOLEAN NOT NULL DEFAULT false,
    `isPostedOnWebsite` BOOLEAN NOT NULL DEFAULT false,
    `broadcastedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Vacancy_jobId_key`(`jobId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HrPublicLink` (
    `id` VARCHAR(191) NOT NULL,
    `uniqueSlug` VARCHAR(191) NOT NULL,
    `hrId` VARCHAR(191) NOT NULL,
    `vacancyId` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
    `clickCount` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `HrPublicLink_uniqueSlug_key`(`uniqueSlug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Candidate` (
    `id` VARCHAR(191) NOT NULL,
    `candidateId` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL DEFAULT 'India',
    `city` VARCHAR(191) NOT NULL,
    `qualification` VARCHAR(191) NOT NULL,
    `totalExperience` VARCHAR(191) NOT NULL DEFAULT 'Fresher',
    `availability` VARCHAR(191) NOT NULL DEFAULT 'Immediate Joiner',
    `interestedRoles` TEXT NOT NULL,
    `resumeUrl` VARCHAR(191) NOT NULL,
    `resumeFileName` VARCHAR(191) NOT NULL,
    `resumeFileSize` INTEGER NOT NULL,
    `source` VARCHAR(191) NOT NULL DEFAULT 'HR_LINK',
    `vacancyId` VARCHAR(191) NOT NULL,
    `hrId` VARCHAR(191) NULL,
    `hrPublicLinkId` VARCHAR(191) NULL,
    `referralTag` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'APPLIED',
    `clientFeedback` TEXT NULL,
    `interviewDate` DATETIME(3) NULL,
    `selectedAt` DATETIME(3) NULL,
    `placementFee` DOUBLE NULL,
    `commissionAmount` DOUBLE NULL,
    `empId` VARCHAR(191) NULL,
    `process` VARCHAR(191) NULL,
    `designation` VARCHAR(191) NULL,
    `dateOfJoining` DATETIME(3) NULL,
    `billingAmount` DOUBLE NULL,
    `billingInfoStatus` VARCHAR(191) NOT NULL DEFAULT 'PENDING_INFO',
    `invoiceId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Candidate_candidateId_key`(`candidateId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CandidateStatusHistory` (
    `id` VARCHAR(191) NOT NULL,
    `candidateId` VARCHAR(191) NOT NULL,
    `previousStatus` VARCHAR(191) NULL,
    `newStatus` VARCHAR(191) NOT NULL,
    `changedByUserId` VARCHAR(191) NULL,
    `changedByRole` VARCHAR(191) NOT NULL,
    `note` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClientAgreement` (
    `id` VARCHAR(191) NOT NULL,
    `agreementNumber` VARCHAR(191) NOT NULL,
    `clientId` VARCHAR(191) NOT NULL,
    `adminId` VARCHAR(191) NOT NULL,
    `placementFeePercent` DOUBLE NOT NULL DEFAULT 8.33,
    `fixedFeePerHead` DOUBLE NULL,
    `paymentTermDays` INTEGER NOT NULL DEFAULT 30,
    `replacementGuaranteeDays` INTEGER NOT NULL DEFAULT 90,
    `termsText` TEXT NOT NULL,
    `hashToken` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'DRAFT',
    `signedByName` VARCHAR(191) NULL,
    `signedByDesignation` VARCHAR(191) NULL,
    `signatureImage` TEXT NULL,
    `signedAt` DATETIME(3) NULL,
    `signerIp` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ClientAgreement_agreementNumber_key`(`agreementNumber`),
    UNIQUE INDEX `ClientAgreement_hashToken_key`(`hashToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SystemCounter` (
    `id` VARCHAR(191) NOT NULL,
    `currentValue` INTEGER NOT NULL DEFAULT 1000,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ConsultancyBillingConfig` (
    `id` VARCHAR(191) NOT NULL DEFAULT 'RISEUP_BILLING_CONFIG',
    `companyName` VARCHAR(191) NOT NULL DEFAULT 'Rise Up Consultancy Pune',
    `tagline` VARCHAR(191) NULL DEFAULT 'Staffing and Recruiting Services',
    `address` TEXT NOT NULL,
    `gstin` VARCHAR(191) NOT NULL DEFAULT '27ABLFR4477Q1Z4',
    `pan` VARCHAR(191) NOT NULL DEFAULT 'ABLFR4477Q',
    `hsnSac` VARCHAR(191) NOT NULL DEFAULT '998512',
    `placeOfSupply` VARCHAR(191) NOT NULL DEFAULT 'Pune',
    `bankName` VARCHAR(191) NOT NULL DEFAULT 'AU Small Finance Bank',
    `bankAccountName` VARCHAR(191) NOT NULL DEFAULT 'Rise Up Consultancy Pune',
    `bankAccountNumber` VARCHAR(191) NOT NULL DEFAULT '2502261678246645',
    `bankIfsc` VARCHAR(191) NOT NULL DEFAULT 'AUBL0002616',
    `termsText` TEXT NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TaxSetting` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `rate` DOUBLE NOT NULL,
    `isSelectedByDefault` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Invoice` (
    `id` VARCHAR(191) NOT NULL,
    `invoiceNumber` VARCHAR(191) NOT NULL,
    `clientId` VARCHAR(191) NOT NULL,
    `invoiceDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dueDate` DATETIME(3) NULL,
    `terms` VARCHAR(191) NOT NULL DEFAULT 'Net 30 Days',
    `billingCycle` VARCHAR(191) NULL,
    `placeOfSupply` VARCHAR(191) NOT NULL DEFAULT 'Pune',
    `sellerName` VARCHAR(191) NOT NULL,
    `sellerAddress` TEXT NOT NULL,
    `sellerGstin` VARCHAR(191) NOT NULL,
    `sellerPan` VARCHAR(191) NOT NULL,
    `sellerHsnSac` VARCHAR(191) NOT NULL,
    `sellerBankName` VARCHAR(191) NOT NULL,
    `sellerAccountName` VARCHAR(191) NOT NULL,
    `sellerAccountNumber` VARCHAR(191) NOT NULL,
    `sellerIfsc` VARCHAR(191) NOT NULL,
    `termsText` TEXT NOT NULL,
    `clientName` VARCHAR(191) NOT NULL,
    `clientAddress` TEXT NOT NULL,
    `clientGstin` VARCHAR(191) NULL,
    `clientContactPerson` VARCHAR(191) NULL,
    `subTotal` DOUBLE NOT NULL,
    `taxesJson` TEXT NOT NULL,
    `taxTotal` DOUBLE NOT NULL DEFAULT 0,
    `tdsDeducted` DOUBLE NOT NULL DEFAULT 0,
    `grandTotal` DOUBLE NOT NULL,
    `totalInWords` TEXT NOT NULL,
    `balanceDue` DOUBLE NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'SENT',
    `paymentDate` DATETIME(3) NULL,
    `paymentReference` VARCHAR(191) NULL,
    `clientFeedback` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Invoice_invoiceNumber_key`(`invoiceNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InvoiceItem` (
    `id` VARCHAR(191) NOT NULL,
    `invoiceId` VARCHAR(191) NOT NULL,
    `candidateId` VARCHAR(191) NULL,
    `srNo` INTEGER NOT NULL,
    `empId` VARCHAR(191) NULL,
    `candidateName` VARCHAR(191) NOT NULL,
    `process` VARCHAR(191) NULL,
    `designation` VARCHAR(191) NULL,
    `dateOfJoining` DATETIME(3) NULL,
    `billingAmount` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Inquiry` (
    `id` VARCHAR(191) NOT NULL,
    `inquiryNumber` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `companyName` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NULL,
    `country` VARCHAR(191) NOT NULL DEFAULT 'India',
    `subject` VARCHAR(191) NULL,
    `roleRequirement` TEXT NULL,
    `message` TEXT NULL,
    `source` VARCHAR(191) NOT NULL DEFAULT 'WEBSITE',
    `status` VARCHAR(191) NOT NULL DEFAULT 'NEW',
    `adminNotes` TEXT NULL,
    `assignedTo` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Inquiry_inquiryNumber_key`(`inquiryNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ClientProfile` ADD CONSTRAINT `ClientProfile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HrProfile` ADD CONSTRAINT `HrProfile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vacancy` ADD CONSTRAINT `Vacancy_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `ClientProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HrPublicLink` ADD CONSTRAINT `HrPublicLink_hrId_fkey` FOREIGN KEY (`hrId`) REFERENCES `HrProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HrPublicLink` ADD CONSTRAINT `HrPublicLink_vacancyId_fkey` FOREIGN KEY (`vacancyId`) REFERENCES `Vacancy`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Candidate` ADD CONSTRAINT `Candidate_vacancyId_fkey` FOREIGN KEY (`vacancyId`) REFERENCES `Vacancy`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Candidate` ADD CONSTRAINT `Candidate_hrId_fkey` FOREIGN KEY (`hrId`) REFERENCES `HrProfile`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Candidate` ADD CONSTRAINT `Candidate_hrPublicLinkId_fkey` FOREIGN KEY (`hrPublicLinkId`) REFERENCES `HrPublicLink`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateStatusHistory` ADD CONSTRAINT `CandidateStatusHistory_candidateId_fkey` FOREIGN KEY (`candidateId`) REFERENCES `Candidate`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateStatusHistory` ADD CONSTRAINT `CandidateStatusHistory_changedByUserId_fkey` FOREIGN KEY (`changedByUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientAgreement` ADD CONSTRAINT `ClientAgreement_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `ClientProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientAgreement` ADD CONSTRAINT `ClientAgreement_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `ClientProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceItem` ADD CONSTRAINT `InvoiceItem_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `Invoice`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Candidate` ADD CONSTRAINT `Candidate_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `Invoice`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- ==========================================================
-- 1. SYSTEM COUNTERS INITIALIZATION
-- ==========================================================
INSERT INTO `SystemCounter` (`id`, `currentValue`) VALUES
('JOB_COUNTER', 1003),
('CANDIDATE_COUNTER', 1000),
('AGREEMENT_COUNTER', 1000),
('HR_COUNTER', 101),
('INVOICE_COUNTER', 1001),
('INQUIRY_COUNTER', 1001)
ON DUPLICATE KEY UPDATE `currentValue` = VALUES(`currentValue`);

-- ==========================================================
-- 1b. SEED BILLING CONFIG & TAX SETTINGS
-- ==========================================================
INSERT INTO `ConsultancyBillingConfig` (`id`, `companyName`, `tagline`, `address`, `gstin`, `pan`, `hsnSac`, `placeOfSupply`, `bankName`, `bankAccountName`, `bankAccountNumber`, `bankIfsc`, `termsText`, `updatedAt`) VALUES
('RISEUP_BILLING_CONFIG', 'Rise Up Consultancy Pune', 'Staffing and Recruiting Services', '1st floor, S.No-49, opp. Hari-Krushna Complex, Chandan Nagar, Pune, Maharashtra 411014.', '27ABLFR4477Q1Z4', 'ABLFR4477Q', '998512', 'Pune', 'AU Small Finance Bank', 'Rise Up Consultancy Pune', '2502261678246645', 'AUBL0002616', 'Payment Due: Net 30 days from invoice date. Late Payments: Overdue invoices incur a 1.5% monthly interest fee plus recovery costs. Queries: Raise billing discrepancies within 7 days of invoice receipt.', NOW(3))
ON DUPLICATE KEY UPDATE `companyName` = VALUES(`companyName`);

INSERT INTO `TaxSetting` (`id`, `name`, `rate`, `isSelectedByDefault`, `createdAt`) VALUES
('tax_cgst_9', 'CGST', 9.0, 1, NOW(3)),
('tax_sgst_9', 'SGST', 9.0, 1, NOW(3)),
('tax_igst_18', 'IGST', 18.0, 0, NOW(3))
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- ==========================================================
-- 2. SEED USERS & PROFILES
-- ==========================================================

-- Super Admin: admin@riseupconsultancyy.com / Admin@Riseup@2025
INSERT INTO `User` (`id`, `email`, `passwordHash`, `fullName`, `phone`, `role`, `status`, `createdAt`, `updatedAt`) VALUES
('usr_super_admin_001', 'admin@riseupconsultancyy.com', '$2b$12$IfdIXJF2RmJsnZQTRsGQT.DQaae9fQUUEuhZx50jxtKbHxh0KtgBm', 'RiseUp Executive Admin', '+91 98765 43210', 'SUPER_ADMIN', 'ACTIVE', NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE `email` = VALUES(`email`), `passwordHash` = VALUES(`passwordHash`), `status` = 'ACTIVE';

-- Corporate Client: client@apexglobal.com / ClientApex@2026
INSERT INTO `User` (`id`, `email`, `passwordHash`, `fullName`, `phone`, `role`, `status`, `createdAt`, `updatedAt`) VALUES
('usr_client_apex_001', 'client@apexglobal.com', '$2b$12$YspHT9hgnIbwXemWD4yM/.QaBX6fGTTPFzEfmFdiFGI2z2v2Sdsrq', 'Rajesh Kulkarni', '+91 98220 11223', 'CLIENT', 'ACTIVE', NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE `passwordHash` = VALUES(`passwordHash`), `status` = 'ACTIVE';

INSERT INTO `ClientProfile` (`id`, `userId`, `companyName`, `country`, `city`, `industry`, `contactPerson`, `phone`, `createdAt`, `updatedAt`) VALUES
('cli_apex_001', 'usr_client_apex_001', 'Apex Global BPO Solutions', 'India', 'Pune', 'BPO / BPM / Back Office', 'Rajesh Kulkarni (Director HR)', '+91 98220 11223', NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE `companyName` = VALUES(`companyName`);

-- HR Recruiter: hr.priya@riseupconsultancy.in / HRPriya@2026
INSERT INTO `User` (`id`, `email`, `passwordHash`, `fullName`, `phone`, `role`, `status`, `createdAt`, `updatedAt`) VALUES
('usr_hr_priya_001', 'hr.priya@riseupconsultancy.in', '$2b$12$KcoTNBnmntGcn4yCATmGv.cEBH1R8m3VENVkZnoJTEwmgVuCuAvmO', 'Priya Sharma', '+91 97654 32109', 'HR_RECRUITER', 'ACTIVE', NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE `passwordHash` = VALUES(`passwordHash`), `status` = 'ACTIVE';

INSERT INTO `HrProfile` (`id`, `userId`, `employeeCode`, `commissionRate`, `whatsappTemplate`, `createdAt`, `updatedAt`) VALUES
('hr_prof_priya_001', 'usr_hr_priya_001', 'RUP-HR-101', 5.0, 'Hello {Candidate_Name}, this is Priya from RiseUp Consultancy regarding your application for {Job_Title} in {City}. Are you available for a brief discussion regarding the interview schedule?', NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE `employeeCode` = VALUES(`employeeCode`);

-- ==========================================================
-- 3. SEED INITIAL VACANCIES
-- ==========================================================

-- Vacancy 1: Voice Process (Pune)
INSERT INTO `Vacancy` (`id`, `jobId`, `title`, `category`, `clientId`, `country`, `city`, `expMin`, `expMax`, `workMode`, `shift`, `salaryMin`, `salaryMax`, `salaryCurrency`, `headcount`, `availabilityRequired`, `description`, `requirements`, `status`, `isBroadcastedToHR`, `isPostedOnWebsite`, `broadcastedAt`, `createdAt`, `updatedAt`) VALUES
('vac_001', 'RUP-JOB-1001', 'Senior Customer Success Associate (Voice Process)', 'Voice Process', 'cli_apex_001', 'India', 'Pune', 1, 3, 'On-site', 'Day Shift', 350000, 500000, 'INR', 25, 'Immediate Joiner', 'Handling inbound and outbound customer inquiries for enterprise clients. Excellent English and Hindi communication required with strong problem-solving skills.', 'Graduate in any stream. Minimum 1 year experience in BPO / Customer Service. Immediate availability preferred.', 'ACTIVE', 1, 1, NOW(3), NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- Vacancy 2: Non-Voice Back Office (Pune)
INSERT INTO `Vacancy` (`id`, `jobId`, `title`, `category`, `clientId`, `country`, `city`, `expMin`, `expMax`, `workMode`, `shift`, `salaryMin`, `salaryMax`, `salaryCurrency`, `headcount`, `availabilityRequired`, `description`, `requirements`, `status`, `isBroadcastedToHR`, `isPostedOnWebsite`, `broadcastedAt`, `createdAt`, `updatedAt`) VALUES
('vac_002', 'RUP-JOB-1002', 'Back Office Operations Specialist (Non-Voice)', 'Back Office', 'cli_apex_001', 'India', 'Pune', 0, 2, 'On-site', 'Day Shift', 280000, 420000, 'INR', 40, 'Immediate Joiner', 'Transaction processing, records verification, and back-office documentation for financial services accounts. Freshers with good typing and analytical skills welcome.', 'B.Com / BBA / BCA / Any Graduate. Typing speed 35+ WPM. Keen attention to detail.', 'ACTIVE', 1, 1, NOW(3), NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- Vacancy 3: Chat Support (Mumbai)
INSERT INTO `Vacancy` (`id`, `jobId`, `title`, `category`, `clientId`, `country`, `city`, `expMin`, `expMax`, `workMode`, `shift`, `salaryMin`, `salaryMax`, `salaryCurrency`, `headcount`, `availabilityRequired`, `description`, `requirements`, `status`, `isBroadcastedToHR`, `isPostedOnWebsite`, `broadcastedAt`, `createdAt`, `updatedAt`) VALUES
('vac_003', 'RUP-JOB-1003', 'BPM Chat & Email Support Specialist', 'Non-Voice', 'cli_apex_001', 'India', 'Mumbai', 1, 3, 'On-site', 'Rotational', 320000, 480000, 'INR', 15, 'Within 15 Days', 'Providing high-speed chat and email resolutions for global tech accounts. Exceptional written communication skills required.', 'Strong English typing and grammar. Previous chat support experience is a plus.', 'ACTIVE', 1, 0, NOW(3), NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

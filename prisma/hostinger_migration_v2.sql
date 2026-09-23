-- ==========================================================
-- RiseUp Consultancy Pune
-- Hostinger MySQL Database Upgrade Migration (v2)
-- Purpose: Safely upgrades an existing Hostinger MySQL database 
--          by adding Invoicing, Billing, and Inquiry features
--          WITHOUT losing any existing data.
-- ==========================================================

-- 1. Add Billing Columns to ClientProfile (if not present)
ALTER TABLE `ClientProfile` 
  ADD COLUMN `billingAddress` TEXT NULL,
  ADD COLUMN `billingGstin` VARCHAR(191) NULL,
  ADD COLUMN `billingPan` VARCHAR(191) NULL,
  ADD COLUMN `billingContactPerson` VARCHAR(191) NULL,
  ADD COLUMN `billingEmail` VARCHAR(191) NULL,
  ADD COLUMN `billingPhone` VARCHAR(191) NULL;

-- 2. Add Invoicing & Employment Columns to Candidate (if not present)
ALTER TABLE `Candidate` 
  ADD COLUMN `empId` VARCHAR(191) NULL,
  ADD COLUMN `process` VARCHAR(191) NULL,
  ADD COLUMN `designation` VARCHAR(191) NULL,
  ADD COLUMN `dateOfJoining` DATETIME(3) NULL,
  ADD COLUMN `billingAmount` DOUBLE NULL,
  ADD COLUMN `billingInfoStatus` VARCHAR(191) NOT NULL DEFAULT 'PENDING_INFO',
  ADD COLUMN `invoiceId` VARCHAR(191) NULL;

-- 3. Create ConsultancyBillingConfig Table
CREATE TABLE IF NOT EXISTS `ConsultancyBillingConfig` (
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

-- 4. Create TaxSetting Table
CREATE TABLE IF NOT EXISTS `TaxSetting` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `rate` DOUBLE NOT NULL,
    `isSelectedByDefault` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 5. Create Invoice Table
CREATE TABLE IF NOT EXISTS `Invoice` (
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

-- 6. Create InvoiceItem Table
CREATE TABLE IF NOT EXISTS `InvoiceItem` (
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

-- 7. Create Inquiry Table
CREATE TABLE IF NOT EXISTS `Inquiry` (
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

-- 8. Add Foreign Keys
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `ClientProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `InvoiceItem` ADD CONSTRAINT `InvoiceItem_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `Invoice`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Candidate` ADD CONSTRAINT `Candidate_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `Invoice`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- 9. Initialize System Counters
INSERT INTO `SystemCounter` (`id`, `currentValue`) VALUES
('INVOICE_COUNTER', 1001),
('INQUIRY_COUNTER', 1001)
ON DUPLICATE KEY UPDATE `currentValue` = VALUES(`currentValue`);

-- 10. Seed Rise Up Consultancy Billing Master Config
INSERT INTO `ConsultancyBillingConfig` (`id`, `companyName`, `tagline`, `address`, `gstin`, `pan`, `hsnSac`, `placeOfSupply`, `bankName`, `bankAccountName`, `bankAccountNumber`, `bankIfsc`, `termsText`, `updatedAt`) VALUES
('RISEUP_BILLING_CONFIG', 'Rise Up Consultancy Pune', 'Staffing and Recruiting Services', '1st floor, S.No-49, opp. Hari-Krushna Complex, Chandan Nagar, Pune, Maharashtra 411014.', '27ABLFR4477Q1Z4', 'ABLFR4477Q', '998512', 'Pune', 'AU Small Finance Bank', 'Rise Up Consultancy Pune', '2502261678246645', 'AUBL0002616', 'Payment Due: Net 30 days from invoice date. Late Payments: Overdue invoices incur a 1.5% monthly interest fee plus recovery costs. Queries: Raise billing discrepancies within 7 days of invoice receipt.', NOW(3))
ON DUPLICATE KEY UPDATE `companyName` = VALUES(`companyName`);

-- 11. Seed Default Tax Rules (CGST 9%, SGST 9%, IGST 18%)
INSERT INTO `TaxSetting` (`id`, `name`, `rate`, `isSelectedByDefault`, `createdAt`) VALUES
('tax_cgst_9', 'CGST', 9.0, 1, NOW(3)),
('tax_sgst_9', 'SGST', 9.0, 1, NOW(3)),
('tax_igst_18', 'IGST', 18.0, 0, NOW(3))
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- ============================================================================
-- RiseUp Consultancy Pune - Production Database One-Time Clean Slate
-- Safely purges dummy test records while preserving:
-- 1. Super Admin (admin@riseupconsultancyy.com)
-- 2. Proxy Client (info@riseupconsultancyy.com) & all 17 live vacancy mandates
-- 3. HR Recruiter (tusharchoudhari@gmail.com / tusharchaudhari@gmail.com)
--
-- Safe for execution in Hostinger phpMyAdmin SQL Editor.
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Purge all Candidate Status History for dummy candidates
DELETE FROM `CandidateStatusHistory`
WHERE `candidateId` IN (
  SELECT `id` FROM `Candidate` 
  WHERE `vacancyId` NOT IN (
    SELECT `v`.`id` FROM `Vacancy` `v`
    JOIN `ClientProfile` `cp` ON `v`.`clientId` = `cp`.`id`
    JOIN `User` `u` ON `cp`.`userId` = `u`.`id`
    WHERE `u`.`email` = 'info@riseupconsultancyy.com'
  )
);

-- 2. Purge dummy Candidates (keep only candidates under info@riseupconsultancyy.com or clean for demo)
DELETE FROM `Candidate`
WHERE `vacancyId` NOT IN (
  SELECT `v`.`id` FROM `Vacancy` `v`
  JOIN `ClientProfile` `cp` ON `v`.`clientId` = `cp`.`id`
  JOIN `User` `u` ON `cp`.`userId` = `u`.`id`
  WHERE `u`.`email` = 'info@riseupconsultancyy.com'
);

-- 3. Purge dummy HR Public Links (keep only Tushar's links if any)
DELETE FROM `HrPublicLink`
WHERE `hrId` NOT IN (
  SELECT `hp`.`id` FROM `HrProfile` `hp`
  JOIN `User` `u` ON `hp`.`userId` = `u`.`id`
  WHERE `u`.`email` IN ('tusharchoudhari@gmail.com', 'tusharchaudhari@gmail.com')
);

-- 4. Purge dummy Invoices
DELETE FROM `Invoice`
WHERE `clientId` NOT IN (
  SELECT `cp`.`id` FROM `ClientProfile` `cp`
  JOIN `User` `u` ON `cp`.`userId` = `u`.`id`
  WHERE `u`.`email` = 'info@riseupconsultancyy.com'
);

-- 5. Purge dummy Client Agreements
DELETE FROM `ClientAgreement`
WHERE `clientId` NOT IN (
  SELECT `cp`.`id` FROM `ClientProfile` `cp`
  JOIN `User` `u` ON `cp`.`userId` = `u`.`id`
  WHERE `u`.`email` = 'info@riseupconsultancyy.com'
);

-- 6. Purge dummy Vacancies (keep all 17 live mandates under info@riseupconsultancyy.com)
DELETE FROM `Vacancy`
WHERE `clientId` NOT IN (
  SELECT `cp`.`id` FROM `ClientProfile` `cp`
  JOIN `User` `u` ON `cp`.`userId` = `u`.`id`
  WHERE `u`.`email` = 'info@riseupconsultancyy.com'
);

-- 7. Purge dummy HR Profiles (keep only Tushar Chaudhari)
DELETE FROM `HrProfile`
WHERE `userId` NOT IN (
  SELECT `id` FROM `User`
  WHERE `email` IN ('tusharchoudhari@gmail.com', 'tusharchaudhari@gmail.com')
);

-- 8. Purge dummy Client Profiles (keep only info@riseupconsultancyy.com)
DELETE FROM `ClientProfile`
WHERE `userId` NOT IN (
  SELECT `id` FROM `User`
  WHERE `email` = 'info@riseupconsultancyy.com'
);

-- 9. Purge all dummy Users (keep ONLY Admin, info@riseup, and Tushar)
DELETE FROM `User`
WHERE `email` NOT IN (
  'admin@riseupconsultancyy.com',
  'info@riseupconsultancyy.com',
  'tusharchoudhari@gmail.com',
  'tusharchaudhari@gmail.com'
);

-- 10. Reset System Counters to clean starting figures for demo
UPDATE `SystemCounter` SET `currentValue` = 1001 WHERE `id` = 'CANDIDATE_COUNTER';
UPDATE `SystemCounter` SET `currentValue` = 1001 WHERE `id` = 'INVOICE_COUNTER';
UPDATE `SystemCounter` SET `currentValue` = 1001 WHERE `id` = 'AGREEMENT_COUNTER';

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- VERIFICATION QUERY: Run this to confirm the clean state
-- ============================================================================
SELECT `email`, `role`, `fullName`, `status` FROM `User`;
SELECT COUNT(*) AS total_mandates FROM `Vacancy`;

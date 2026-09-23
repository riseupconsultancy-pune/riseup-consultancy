-- ============================================================================
-- RiseUp Consultancy Pune & Nigeria - Production Demo Dataset
-- Generated for Client Presentation & Stakeholder Review
-- Safe for direct execution in Hostinger phpMyAdmin SQL Editor
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. SYSTEM COUNTERS
INSERT INTO `SystemCounter` (`id`, `currentValue`) VALUES
('JOB_COUNTER', 1007),
('CANDIDATE_COUNTER', 1015),
('AGREEMENT_COUNTER', 1003),
('HR_COUNTER', 103),
('INVOICE_COUNTER', 1003),
('INQUIRY_COUNTER', 1005)
ON DUPLICATE KEY UPDATE `currentValue` = VALUES(`currentValue`);

-- 2. USERS (Super Admin, Corporate Clients, HR Recruiters)
-- Passwords:
-- admin@riseupconsultancy.in   => AdminRiseUp@2026
-- client@apexglobal.com        => ClientApex@2026
-- client@digitide.com          => ClientDigitide@2026
-- hr.priya@riseupconsultancy.in=> HRPriya@2026
-- hr.rahul@riseupconsultancy.in=> HRRahul@2026

INSERT INTO `User` (`id`, `email`, `passwordHash`, `fullName`, `phone`, `role`, `status`, `createdAt`, `updatedAt`) VALUES
('usr_super_admin_001', 'admin@riseupconsultancy.in', '$2b$12$HYmY6tBq0SMtSa/aeq9VZuycuuq4IeCGX8Y3km6PB/BMhE1AVPO3G', 'Rohit Sharma (Executive Director)', '+91 93598 92819', 'SUPER_ADMIN', 'ACTIVE', NOW(3), NOW(3)),
('usr_client_apex_001', 'client@apexglobal.com', '$2b$12$Sha0YUh4kb0ZtvqdEXjZc.8Svic5XgnsIFv9pkrEEkyzKaAyxRNmK', 'Rajesh Kulkarni (Director HR)', '+91 98220 11223', 'CLIENT', 'ACTIVE', NOW(3), NOW(3)),
('usr_client_digitide_001', 'client@digitide.com', '$2b$12$yLt6GWMUWK3SuQ/lKMeRbeFBQcaC1xrXuUx7hBenxh0AdernoWETy', 'Nitin Patil (Head TA)', '+91 98900 12345', 'CLIENT', 'ACTIVE', NOW(3), NOW(3)),
('usr_hr_priya_001', 'hr.priya@riseupconsultancy.in', '$2b$12$gWz3mE8o3rtykBT/QfcXtewwTc0tEimLjNyowU9sE37c/5MLAVgjS', 'Priya Sharma (Senior Recruiter)', '+91 97654 32109', 'HR_RECRUITER', 'ACTIVE', NOW(3), NOW(3)),
('usr_hr_rahul_001', 'hr.rahul@riseupconsultancy.in', '$2b$12$WhWa8Y7p97ZWqQmNT7K3GOdBtLw32Yt0Hbad6YT.Yd6L31LubX75W', 'Rahul Verma (BPO Talent Specialist)', '+91 97654 32110', 'HR_RECRUITER', 'ACTIVE', NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE `fullName` = VALUES(`fullName`), `passwordHash` = VALUES(`passwordHash`), `status` = 'ACTIVE';

-- 3. CLIENT PROFILES
INSERT INTO `ClientProfile` (`id`, `userId`, `companyName`, `country`, `city`, `industry`, `contactPerson`, `phone`, `billingAddress`, `billingGstin`, `billingPan`, `billingContactPerson`, `billingEmail`, `billingPhone`, `createdAt`, `updatedAt`) VALUES
('cli_apex_001', 'usr_client_apex_001', 'Apex Global BPO Solutions Pvt Ltd', 'India', 'Pune', 'BPO / BPM / Back Office', 'Rajesh Kulkarni', '+91 98220 11223', 'Tower 4, World Trade Center, Kharadi, Pune, Maharashtra 411014', '27AAACA1234A1Z5', 'AAACA1234A', 'Rajesh Kulkarni', 'accounts@apexglobal.com', '+91 98220 11223', NOW(3), NOW(3)),
('cli_digitide_001', 'usr_client_digitide_001', 'Digitide Business Solutions (P)', 'India', 'Pune', 'BPO / BPM', 'Nitin Patil', '+91 98900 12345', 'Unit 302, EON Free Zone Phase 1, Kharadi, Pune, Maharashtra 411014', '27AACCC4278P1Z3', 'AACCC4278P', 'Nitin Patil', 'billing@digitide.com', '+91 98900 12345', NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE `companyName` = VALUES(`companyName`), `billingAddress` = VALUES(`billingAddress`);

-- 4. HR PROFILES
INSERT INTO `HrProfile` (`id`, `userId`, `employeeCode`, `commissionRate`, `whatsappTemplate`, `createdAt`, `updatedAt`) VALUES
('hr_prof_priya_001', 'usr_hr_priya_001', 'RUP-HR-101', 5.0, 'Hello {Candidate_Name}, this is Priya Sharma from RiseUp Consultancy regarding your application for {Job_Title} in {City}. Are you available for a brief discussion regarding the interview schedule?', NOW(3), NOW(3)),
('hr_prof_rahul_001', 'usr_hr_rahul_001', 'RUP-HR-102', 6.0, 'Hi {Candidate_Name}, Rahul here from RiseUp Consultancy Pune. We have reviewed your profile for {Job_Title} with our corporate client. Please confirm your availability today.', NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE `employeeCode` = VALUES(`employeeCode`);

-- 5. VACANCIES (Open Jobs Across Categories)
INSERT INTO `Vacancy` (`id`, `jobId`, `title`, `category`, `clientId`, `country`, `city`, `expMin`, `expMax`, `workMode`, `shift`, `salaryMin`, `salaryMax`, `salaryCurrency`, `headcount`, `availabilityRequired`, `description`, `requirements`, `interviewVenue`, `interviewLocationUrl`, `interviewContactPerson`, `interviewContactPhone`, `interviewInstructions`, `status`, `isBroadcastedToHR`, `isPostedOnWebsite`, `broadcastedAt`, `createdAt`, `updatedAt`) VALUES
('vac_001', 'RUP-JOB-1001', 'Senior Customer Success Associate (Voice Process)', 'Voice Process', 'cli_apex_001', 'India', 'Pune', 1, 3, 'On-site', 'Day Shift', 350000, 500000, 'INR', 25, 'Immediate Joiner', 'Handling inbound and outbound customer inquiries for enterprise clients. Excellent English and Hindi communication required with strong problem-solving skills.', 'Graduate in any stream. Minimum 1 year experience in BPO / Customer Service. Immediate availability preferred.', 'World Trade Center, Tower 4, Kharadi, Pune', 'https://maps.google.com/?q=WTC+Pune', 'Mr. Amit Joshi', '+91 98220 55443', 'Carry 2 updated resumes and original Govt ID proof (Aadhaar / PAN).', 'ACTIVE', 1, 1, NOW(3), NOW(3), NOW(3)),

('vac_002', 'RUP-JOB-1002', 'Back Office Operations Specialist (Non-Voice)', 'Back Office', 'cli_apex_001', 'India', 'Pune', 0, 2, 'On-site', 'Day Shift', 280000, 420000, 'INR', 40, 'Immediate Joiner', 'Transaction processing, records verification, and back-office documentation for financial services accounts. Freshers with good typing and analytical skills welcome.', 'B.Com / BBA / BCA / Any Graduate. Typing speed 35+ WPM. Keen attention to detail.', 'World Trade Center, Tower 4, Kharadi, Pune', 'https://maps.google.com/?q=WTC+Pune', 'Ms. Sneha Patil', '+91 98220 55444', 'Basic MS Excel and typing test will be conducted on-site.', 'ACTIVE', 1, 1, NOW(3), NOW(3), NOW(3)),

('vac_003', 'RUP-JOB-1003', 'Tele sales Executive / Corporate Account Specialist', 'Voice', 'cli_digitide_001', 'India', 'Pune', 0, 2, 'On-site', 'Day Shift', 240000, 360000, 'INR', 20, 'Immediate Joiner', 'Managing corporate sales inquiries, outbound client onboarding, and lead verification for tier-1 digital brands.', 'HSC / Any Graduate. Good persuasive communication skills in English and Hindi.', 'EON Free Zone, Cluster D, Kharadi, Pune', 'https://maps.google.com/?q=EON+Kharadi', 'Mr. Nitin Patil', '+91 98900 12345', 'Dress code: Formal / Business Casual.', 'ACTIVE', 1, 1, NOW(3), NOW(3), NOW(3)),

('vac_004', 'RUP-JOB-1004', 'Healthcare AR Caller & Medical Billing Specialist', 'Non-Voice', 'cli_digitide_001', 'India', 'Pune', 1, 4, 'On-site', 'Night Shift', 380000, 580000, 'INR', 15, 'Within 15 Days', 'US healthcare claim status verification, accounts receivable follow-up, and denial resolution for hospital networks.', 'Graduate in Life Sciences / Commerce. Minimum 1 year US Healthcare AR experience.', 'EON Free Zone, Cluster D, Kharadi, Pune', 'https://maps.google.com/?q=EON+Kharadi', 'Ms. Kavita Nair', '+91 98900 12346', 'Night shift allowance and company cab service provided.', 'ACTIVE', 1, 1, NOW(3), NOW(3), NOW(3)),

('vac_005', 'RUP-JOB-1005', 'BPM Chat & Email Customer Resolution Specialist', 'Non-Voice', 'cli_apex_001', 'India', 'Mumbai', 1, 3, 'Hybrid', 'Rotational', 320000, 480000, 'INR', 15, 'Immediate Joiner', 'Providing high-speed written customer resolutions for leading e-commerce platforms. High accuracy and grammar standards required.', 'Any Graduate. Typing speed 40+ WPM with 95% accuracy.', 'Mindspace IT Park, Airoli, Navi Mumbai', 'https://maps.google.com/?q=Mindspace+Airoli', 'Mr. Vikram Sen', '+91 98220 55445', 'Bring your own laptop for the typing assessment round.', 'ACTIVE', 1, 1, NOW(3), NOW(3), NOW(3)),

('vac_006', 'RUP-JOB-1006', 'KYC & AML Verification Analyst (BFSI)', 'Back Office', 'cli_apex_001', 'India', 'Pune', 0, 2, 'On-site', 'Day Shift', 300000, 450000, 'INR', 30, 'Immediate Joiner', 'Client onboarding verification, identity checks, and fraud screening for international fintech accounts.', 'B.Com / BBA / Any Graduate with strong analytical skills.', 'World Trade Center, Tower 4, Kharadi, Pune', 'https://maps.google.com/?q=WTC+Pune', 'Mr. Rajesh Kulkarni', '+91 98220 11223', 'Awaiting final headcount signoff.', 'PENDING_REVIEW', 0, 0, NULL, NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`), `status` = VALUES(`status`);

-- 6. HR TRACKED PUBLIC APPLICATION LINKS
INSERT INTO `HrPublicLink` (`id`, `uniqueSlug`, `hrId`, `vacancyId`, `status`, `clickCount`, `createdAt`, `updatedAt`) VALUES
('link_001', 'job-rup-1001-hr101', 'hr_prof_priya_001', 'vac_001', 'ACTIVE', 48, NOW(3), NOW(3)),
('link_002', 'job-rup-1002-hr101', 'hr_prof_priya_001', 'vac_002', 'ACTIVE', 82, NOW(3), NOW(3)),
('link_003', 'job-rup-1003-hr102', 'hr_prof_rahul_001', 'vac_003', 'ACTIVE', 65, NOW(3), NOW(3)),
('link_004', 'job-rup-1004-hr102', 'hr_prof_rahul_001', 'vac_004', 'ACTIVE', 31, NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE `clickCount` = VALUES(`clickCount`);

-- 7. CONSULTANCY BILLING MASTER CONFIG
INSERT INTO `ConsultancyBillingConfig` (`id`, `companyName`, `tagline`, `address`, `gstin`, `pan`, `hsnSac`, `placeOfSupply`, `bankName`, `bankAccountName`, `bankAccountNumber`, `bankIfsc`, `termsText`, `updatedAt`) VALUES
('RISEUP_BILLING_CONFIG', 'Rise Up Consultancy Pune', 'Staffing and Recruiting Services', '1st floor, S.No-49, opp. Hari-Krushna Complex, Chandan Nagar, Pune, Maharashtra 411014.', '27ABLFR4477Q1Z4', 'ABLFR4477Q', '998512', 'Pune', 'AU Small Finance Bank', 'Rise Up Consultancy Pune', '2502261678246645', 'AUBL0002616', 'Payment Due: Net 30 days from invoice date. Late Payments: Overdue invoices incur a 1.5% monthly interest fee plus recovery costs. Queries: Raise billing discrepancies within 7 days of invoice receipt.', NOW(3))
ON DUPLICATE KEY UPDATE `companyName` = VALUES(`companyName`);

-- 8. TAX SETTINGS (CGST 9%, SGST 9%, IGST 18%)
INSERT INTO `TaxSetting` (`id`, `name`, `rate`, `isSelectedByDefault`, `createdAt`) VALUES
('tax_cgst_9', 'CGST', 9.0, 1, NOW(3)),
('tax_sgst_9', 'SGST', 9.0, 1, NOW(3)),
('tax_igst_18', 'IGST', 18.0, 0, NOW(3))
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 9. INVOICES
INSERT INTO `Invoice` (`id`, `invoiceNumber`, `clientId`, `invoiceDate`, `dueDate`, `terms`, `billingCycle`, `placeOfSupply`, `sellerName`, `sellerAddress`, `sellerGstin`, `sellerPan`, `sellerHsnSac`, `sellerBankName`, `sellerAccountName`, `sellerAccountNumber`, `sellerIfsc`, `termsText`, `clientName`, `clientAddress`, `clientGstin`, `clientContactPerson`, `subTotal`, `taxesJson`, `taxTotal`, `tdsDeducted`, `grandTotal`, `totalInWords`, `balanceDue`, `status`, `paymentDate`, `paymentReference`, `clientFeedback`, `createdAt`, `updatedAt`) VALUES
('inv_001', 'RUP-INV-1001', 'cli_digitide_001', NOW(3), DATE_ADD(NOW(3), INTERVAL 30 DAY), 'Net 30 Days', 'February 2026 Batch Placement', 'Pune', 'Rise Up Consultancy Pune', '1st floor, S.No-49, opp. Hari-Krushna Complex, Chandan Nagar, Pune, Maharashtra 411014.', '27ABLFR4477Q1Z4', 'ABLFR4477Q', '998512', 'AU Small Finance Bank', 'Rise Up Consultancy Pune', '2502261678246645', 'AUBL0002616', 'Payment Due: Net 30 days from invoice date. Late Payments: Overdue invoices incur a 1.5% monthly interest fee plus recovery costs. Queries: Raise billing discrepancies within 7 days of invoice receipt.', 'Digitide Business Solutions (P)', 'Unit 302, EON Free Zone Phase 1, Kharadi, Pune, Maharashtra 411014', '27AACCC4278P1Z3', 'Nitin Patil', 7500.0, '[{"name":"CGST","rate":9,"amount":675},{"name":"SGST","rate":9,"amount":675}]', 1350.0, 0.0, 8850.0, 'Rupees Eight Thousand Eight Hundred Fifty Only', 8850.0, 'SENT', NULL, NULL, NULL, NOW(3), NOW(3)),

('inv_002', 'RUP-INV-1002', 'cli_apex_001', DATE_SUB(NOW(3), INTERVAL 15 DAY), DATE_ADD(NOW(3), INTERVAL 15 DAY), 'Net 30 Days', 'January 2026 Executive Voice Batch', 'Pune', 'Rise Up Consultancy Pune', '1st floor, S.No-49, opp. Hari-Krushna Complex, Chandan Nagar, Pune, Maharashtra 411014.', '27ABLFR4477Q1Z4', 'ABLFR4477Q', '998512', 'AU Small Finance Bank', 'Rise Up Consultancy Pune', '2502261678246645', 'AUBL0002616', 'Payment Due: Net 30 days from invoice date. Late Payments: Overdue invoices incur a 1.5% monthly interest fee plus recovery costs. Queries: Raise billing discrepancies within 7 days of invoice receipt.', 'Apex Global BPO Solutions Pvt Ltd', 'Tower 4, World Trade Center, Kharadi, Pune, Maharashtra 411014', '27AAACA1234A1Z5', 'Rajesh Kulkarni', 32000.0, '[{"name":"CGST","rate":9,"amount":2880},{"name":"SGST","rate":9,"amount":2880}]', 5760.0, 0.0, 37760.0, 'Rupees Thirty-Seven Thousand Seven Hundred Sixty Only', 0.0, 'PAID', DATE_SUB(NOW(3), INTERVAL 3 DAY), 'NEFT/HDFC0028912/APEX', 'Verified and processed in full.', NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE `invoiceNumber` = VALUES(`invoiceNumber`), `status` = VALUES(`status`);

-- 10. CANDIDATES (Covering all CRM Stages & Invoicing)
INSERT INTO `Candidate` (`id`, `candidateId`, `fullName`, `email`, `phone`, `country`, `city`, `qualification`, `totalExperience`, `availability`, `interestedRoles`, `resumeUrl`, `resumeFileName`, `resumeFileSize`, `source`, `vacancyId`, `hrId`, `hrPublicLinkId`, `referralTag`, `status`, `clientFeedback`, `interviewDate`, `selectedAt`, `placementFee`, `commissionAmount`, `empId`, `process`, `designation`, `dateOfJoining`, `billingAmount`, `billingInfoStatus`, `invoiceId`, `createdAt`, `updatedAt`) VALUES

-- [Stage: SELECTED & INVOICED] Linked to RUP-INV-1001 (Digitide)
('can_001', 'RUP-CAN-1001', 'Pushpa Sharma', 'pushpa.sharma@example.com', '+91 98111 22331', 'India', 'Pune', 'Graduate', '1 Year', 'Immediate Joiner', '["Voice Process", "Tele sales"]', '/uploads/resumes/sample.pdf', 'Pushpa_Sharma_Resume.pdf', 184320, 'HR_LINK', 'vac_003', 'hr_prof_rahul_001', 'link_003', 'Referral: Rahul Verma | RiseUp Consultancy', 'SELECTED', 'Strong voice modulation and clear English diction. Selected for TCS GEM account.', DATE_SUB(NOW(3), INTERVAL 20 DAY), DATE_SUB(NOW(3), INTERVAL 18 DAY), 2500, 150, '1520417', 'TCS GEM', 'Tele sales Executive', DATE_SUB(NOW(3), INTERVAL 10 DAY), 2500, 'INVOICED', 'inv_001', NOW(3), NOW(3)),

('can_002', 'RUP-CAN-1002', 'Darshan Narsing Gurram', 'darshan.gurram@example.com', '+91 98111 22332', 'India', 'Pune', 'B.Com', 'Fresher', 'Immediate Joiner', '["Customer Support", "Tele sales"]', '/uploads/resumes/sample.pdf', 'Darshan_Gurram_Resume.pdf', 196608, 'HR_LINK', 'vac_003', 'hr_prof_rahul_001', 'link_003', 'Referral: Rahul Verma | RiseUp Consultancy', 'SELECTED', 'Confident fresher with good negotiation skills. Assigned to Meesho process.', DATE_SUB(NOW(3), INTERVAL 15 DAY), DATE_SUB(NOW(3), INTERVAL 14 DAY), 2500, 150, '1530092', 'Meesho', 'Tele sales Executive', DATE_SUB(NOW(3), INTERVAL 8 DAY), 2500, 'INVOICED', 'inv_001', NOW(3), NOW(3)),

('can_003', 'RUP-CAN-1003', 'Diksha Malpani', 'diksha.malpani@example.com', '+91 98111 22334', 'India', 'Pune', 'B.Com', '6 Months', 'Immediate Joiner', '["Customer Support"]', '/uploads/resumes/sample.pdf', 'Diksha_Malpani_Resume.pdf', 172032, 'HR_LINK', 'vac_003', 'hr_prof_rahul_001', 'link_003', 'Referral: Rahul Verma | RiseUp Consultancy', 'SELECTED', 'Prompt problem resolution skills. Onboarded into TCS GEM.', DATE_SUB(NOW(3), INTERVAL 12 DAY), DATE_SUB(NOW(3), INTERVAL 10 DAY), 2500, 150, '1536775', 'Tcs gem', 'Customer support', DATE_SUB(NOW(3), INTERVAL 5 DAY), 2500, 'INVOICED', 'inv_001', NOW(3), NOW(3)),

-- [Stage: SELECTED with GREEN - Ready for Invoicing]
('can_004', 'RUP-CAN-1004', 'Mandar Sanjay Kulkarni', 'mandar.kulkarni@example.com', '+91 98111 22333', 'India', 'Pune', 'BBA', '2 Years', 'Immediate Joiner', '["Voice Process"]', '/uploads/resumes/sample.pdf', 'Mandar_Kulkarni_Resume.pdf', 204800, 'HR_LINK', 'vac_001', 'hr_prof_priya_001', 'link_001', 'Referral: Priya Sharma | RiseUp Consultancy', 'SELECTED', 'Excellent communication skills and customer orientation. Ready for next invoice run.', DATE_SUB(NOW(3), INTERVAL 5 DAY), DATE_SUB(NOW(3), INTERVAL 3 DAY), 8000, 400, 'APX-7741', 'Enterprise Voice', 'Senior Customer Success Associate', DATE_ADD(NOW(3), INTERVAL 2 DAY), 8000, 'INFO_SUBMITTED', NULL, NOW(3), NOW(3)),

-- [Stage: SELECTED with YELLOW - Pending Client Info]
('can_005', 'RUP-CAN-1005', 'Punam Subhash Pardeshi', 'punam.pardeshi@example.com', '+91 98111 22335', 'India', 'Pune', 'Graduate', '1 Year', 'Immediate Joiner', '["Back Office", "Non-Voice"]', '/uploads/resumes/sample.pdf', 'Punam_Pardeshi_Resume.pdf', 155648, 'HR_LINK', 'vac_002', 'hr_prof_priya_001', 'link_002', 'Referral: Priya Sharma | RiseUp Consultancy', 'SELECTED', 'Selected in final HR round. Awaiting joining confirmation and employee ID.', DATE_SUB(NOW(3), INTERVAL 4 DAY), DATE_SUB(NOW(3), INTERVAL 2 DAY), 7500, 375, NULL, NULL, NULL, NULL, NULL, 'PENDING_INFO', NULL, NOW(3), NOW(3)),

-- [Stage: GOING_FOR_INTERVIEW - Active Scheduled Interview]
('can_006', 'RUP-CAN-1006', 'Aditya R. Shinde', 'aditya.shinde@example.com', '+91 98222 33441', 'India', 'Pune', 'B.Sc (Comp Sci)', 'Fresher', 'Immediate Joiner', '["Back Office", "Non-Voice"]', '/uploads/resumes/sample.pdf', 'Aditya_Shinde_Resume.pdf', 188416, 'WEBSITE_CARD', 'vac_002', NULL, NULL, 'RiseUp Direct (Website Application)', 'GOING_FOR_INTERVIEW', 'Interview slot confirmed with client HR at WTC Kharadi.', DATE_ADD(NOW(3), INTERVAL 1 DAY), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'PENDING_INFO', NULL, NOW(3), NOW(3)),

('can_007', 'RUP-CAN-1007', 'Rohan Vilas Gaikwad', 'rohan.gaikwad@example.com', '+91 98222 33442', 'India', 'Pune', 'B.Tech', '1 Year', '15 Days', '["Voice Process"]', '/uploads/resumes/sample.pdf', 'Rohan_Gaikwad_Resume.pdf', 215040, 'HR_LINK', 'vac_001', 'hr_prof_priya_001', 'link_001', 'Referral: Priya Sharma | RiseUp Consultancy', 'GOING_FOR_INTERVIEW', 'Scheduled for round 2 technical discussion.', DATE_ADD(NOW(3), INTERVAL 2 DAY), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'PENDING_INFO', NULL, NOW(3), NOW(3)),

-- [Stage: CONNECTED - Recruiter Sourced]
('can_008', 'RUP-CAN-1008', 'Sneha M. Deshpande', 'sneha.deshpande@example.com', '+91 98222 33443', 'India', 'Pune', 'B.A. English', '2 Years', 'Immediate Joiner', '["Non-Voice", "BPM Chat"]', '/uploads/resumes/sample.pdf', 'Sneha_Deshpande_Resume.pdf', 163840, 'HR_LINK', 'vac_005', 'hr_prof_priya_001', 'link_001', 'Referral: Priya Sharma | RiseUp Consultancy', 'CONNECTED', 'Pre-screened via phone. Verified typing speed 42 WPM.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'PENDING_INFO', NULL, NOW(3), NOW(3)),

-- [Stage: APPLIED - New Incoming Portal Applications]
('can_009', 'RUP-CAN-1009', 'Vikram Suresh Jadhav', 'vikram.jadhav@example.com', '+91 98222 33444', 'India', 'Pune', 'B.Com', 'Fresher', 'Immediate Joiner', '["Back Office"]', '/uploads/resumes/sample.pdf', 'Vikram_Jadhav_Resume.pdf', 147456, 'WEBSITE_CARD', 'vac_002', NULL, NULL, 'RiseUp Direct (Website Application)', 'APPLIED', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'PENDING_INFO', NULL, NOW(3), NOW(3)),

('can_010', 'RUP-CAN-1010', 'Ananya S. Iyer', 'ananya.iyer@example.com', '+91 98222 33445', 'India', 'Mumbai', 'B.Sc IT', '1 Year', 'Immediate Joiner', '["Non-Voice", "Chat Support"]', '/uploads/resumes/sample.pdf', 'Ananya_Iyer_Resume.pdf', 192512, 'WEBSITE_CARD', 'vac_005', NULL, NULL, 'RiseUp Direct (Website Application)', 'APPLIED', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'PENDING_INFO', NULL, NOW(3), NOW(3)),

-- [Stage: REJECTED - Realistic Pipeline Outcome]
('can_011', 'RUP-CAN-1011', 'Nilesh B. Sawant', 'nilesh.sawant@example.com', '+91 98222 33446', 'India', 'Pune', 'HSC (12th)', 'Fresher', 'Immediate Joiner', '["Voice Process"]', '/uploads/resumes/sample.pdf', 'Nilesh_Sawant_Resume.pdf', 131072, 'HR_LINK', 'vac_001', 'hr_prof_rahul_001', 'link_003', 'Referral: Rahul Verma | RiseUp Consultancy', 'REJECTED', 'Communication skills did not meet international BPO benchmark. Recommended for domestic voice training.', DATE_SUB(NOW(3), INTERVAL 6 DAY), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'PENDING_INFO', NULL, NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE `fullName` = VALUES(`fullName`), `status` = VALUES(`status`), `billingInfoStatus` = VALUES(`billingInfoStatus`);

-- 11. INVOICE LINE ITEMS (For RUP-INV-1001)
INSERT INTO `InvoiceItem` (`id`, `invoiceId`, `candidateId`, `srNo`, `empId`, `candidateName`, `process`, `designation`, `dateOfJoining`, `billingAmount`) VALUES
('item_001', 'inv_001', 'can_001', 1, '1520417', 'Pushpa Sharma', 'TCS GEM', 'Tele sales Executive', DATE_SUB(NOW(3), INTERVAL 10 DAY), 2500.0),
('item_002', 'inv_001', 'can_002', 2, '1530092', 'Darshan Narsing Gurram', 'Meesho', 'Tele sales Executive', DATE_SUB(NOW(3), INTERVAL 8 DAY), 2500.0),
('item_003', 'inv_001', 'can_003', 3, '1536775', 'Diksha Malpani', 'Tcs gem', 'Customer support', DATE_SUB(NOW(3), INTERVAL 5 DAY), 2500.0)
ON DUPLICATE KEY UPDATE `candidateName` = VALUES(`candidateName`), `billingAmount` = VALUES(`billingAmount`);

-- 12. CLIENT AGREEMENTS
INSERT INTO `ClientAgreement` (`id`, `agreementNumber`, `clientId`, `adminId`, `placementFeePercent`, `fixedFeePerHead`, `paymentTermDays`, `replacementGuaranteeDays`, `termsText`, `hashToken`, `status`, `signedByName`, `signedByDesignation`, `signatureImage`, `signedAt`, `signerIp`, `createdAt`, `updatedAt`) VALUES
('agr_001', 'RUP-AGR-1001', 'cli_apex_001', 'usr_super_admin_001', 8.33, NULL, 30, 90, 'RECRUITMENT AND TALENT SUPPLY AGREEMENT: 1. Fee Structure: 8.33% of Annual Gross CTC per successful placement. 2. Invoicing & Payment: Invoices will be raised upon candidate DOJ; payable within Net 30 days. 3. Free Replacement: 90-day replacement guarantee if candidate leaves voluntarily or is terminated for misconduct. 4. Jurisdiction: Pune Courts, Maharashtra.', 'c4a17d98305f6291a8e1b64d0f73b8219e5d481230f872a91e4b85c172d890ab', 'SIGNED', 'Rajesh Kulkarni', 'Director Human Resources', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', DATE_SUB(NOW(3), INTERVAL 25 DAY), '103.211.54.12', NOW(3), NOW(3)),

('agr_002', 'RUP-AGR-1002', 'cli_digitide_001', 'usr_super_admin_001', 8.33, 2500, 30, 90, 'STAFFING SERVICES AGREEMENT (FIXED FEE HEADCOUNT): 1. Fee Structure: Fixed ₹2,500 + GST per hired associate. 2. Credit Terms: Net 30 days from official invoice generation. 3. Replacement: 90-day replacement commitment from date of onboarding. 4. Exclusivity: Non-exclusive mandate for BPO/BPM hiring across Pune centers.', '7e9f3b21840dc51a69d2e4f0a718b539c82e6d17a45019f3b8e217d904c6281a', 'SENT', NULL, NULL, NULL, NULL, NULL, NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE `agreementNumber` = VALUES(`agreementNumber`), `status` = VALUES(`status`);

-- 13. WEBSITE INQUIRIES (Lead Intake)
INSERT INTO `Inquiry` (`id`, `inquiryNumber`, `type`, `fullName`, `companyName`, `email`, `phone`, `city`, `country`, `subject`, `roleRequirement`, `message`, `source`, `status`, `adminNotes`, `assignedTo`, `createdAt`, `updatedAt`) VALUES
('inq_001', 'RUP-INQ-1001', 'TALENT_REQUEST', 'Anand K. Mehta', 'TeleConnect BPM Solutions', 'anand.mehta@teleconnect.in', '+91 98230 44551', 'Pune', 'India', 'Immediate Bulk Requirement for 50 Voice Process Associates in Kharadi', 'Headcount: 50 | Roles: International Voice Process | Shift: UK/US Rotational | Budget: ₹3.0L - ₹4.5L CTC', 'We require an urgent batch of 50 English-fluent associates for our new BFSI process starting next month. Please get in touch for SLA and contract terms.', 'HERO_REQUEST_TALENT', 'NEW', 'High-priority prospective enterprise client. Priya to follow up with proposal deck.', 'usr_hr_priya_001', NOW(3), NOW(3)),

('inq_002', 'RUP-INQ-1002', 'EMPLOYER_QUERY', 'Sunita Rao', 'Nexora Fintech Services', 'sunita.rao@nexorafin.com', '+91 98230 44552', 'Pune', 'India', 'Vendor Empanelment for Back Office Verification Staffing', 'Headcount: 20 | Roles: KYC & Data Processing Specialists | Location: Hinjewadi Phase 2', 'Looking to empanel RiseUp Consultancy as an authorized staffing partner for our Pune operations. Kindly share commercial terms and master agreement copy.', 'CONTACT_PAGE', 'IN_PROGRESS', 'Agreement draft shared via email. Awaiting client procurement team call.', 'usr_super_admin_001', DATE_SUB(NOW(3), INTERVAL 2 DAY), NOW(3)),

('inq_003', 'RUP-INQ-1003', 'CANDIDATE_QUERY', 'Deepak More', NULL, 'deepak.more98@gmail.com', '+91 97640 11223', 'Pune', 'India', 'Inquiry regarding fresher back-office openings in Kharadi', NULL, 'Sir, I completed my B.Com in 2025 with 68%. I want to apply for back office or data entry jobs in Pune. Is there any registration fee?', 'WEBSITE_CONTACT', 'CONNECTED', 'Clarified 100% Free Candidate Placement policy. Candidate applied via portal.', 'usr_hr_priya_001', DATE_SUB(NOW(3), INTERVAL 3 DAY), NOW(3)),

('inq_004', 'RUP-INQ-1004', 'TALENT_REQUEST', 'Abiola Johnson', 'CloudGate Technologies Ltd', 'a.johnson@cloudgate.ng', '+234 803 123 4567', 'Lagos', 'Nigeria', 'Sourcing Customer Support Specialists for Lagos Tech Hub', 'Headcount: 10 | Roles: Technical Support & Customer Service | Location: Ikeja, Lagos', 'We are expanding our Lagos support team and need verified candidates with English fluency and CRM experience.', 'HERO_REQUEST_TALENT', 'NEW', 'International inquiry for Nigeria operations. Scheduled introductory Zoom call.', 'usr_super_admin_001', DATE_SUB(NOW(3), INTERVAL 1 DAY), NOW(3))
ON DUPLICATE KEY UPDATE `inquiryNumber` = VALUES(`inquiryNumber`), `status` = VALUES(`status`);

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- End of Demo Dataset Script
-- ============================================================================

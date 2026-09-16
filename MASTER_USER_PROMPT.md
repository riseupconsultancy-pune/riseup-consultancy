# RiseUp Consultancy — Master System Specification & Operational Blueprint

> **DOCUMENT PURPOSE:**  
> This file is the single source of truth for the RiseUp Consultancy platform. It combines all business rules, user roles, data flows, operational algorithms, and platform constraints. Every AI agent, developer, and auditor must reference this document before implementing or modifying any feature.

---

## 1. Executive Business Overview

* **Company Name:** RiseUp Consultancy
* **Core Business:** Recruitment and staffing consultancy specializing in high-volume and skilled hiring for BPO, BPM, Back Office, IT, and Non-IT corporate enterprises.
* **Operating Corridors:**
  * **India:** Pune (Headquarters), Mumbai, Bengaluru, Hyderabad, Coimbatore, Delhi NCR, Kolkata, Chennai, and other major hubs.
  * **Nigeria:** Lagos, Abuja, Port Harcourt, and major hubs.
  * **Job Types:** Primarily on-site roles, with hybrid and remote mandates where specified.
* **Candidate Policy:** **100% FREE** for all job seekers. Candidates are never charged any registration, processing, or placement fee.
* **Monetization & Commercial Terms:**
  * Client companies pay RiseUp an agreed placement fee per selected candidate (commercial terms agreed per client).
  * Invoices typically mature **30 days** after candidate joining/tenure verification.
  * Internal HR recruiters earn a performance commission for each successful placement attributed to them.

---

## 2. Core Recruitment Workflow & Referral Algorithm

```
[Client Posts Vacancy]
         │
         ▼
[Admin Reviews & Broadcasts to all HRs + Website]
         │
         ├────────────────────────────────────────┬───────────────────────────────────────┐
         ▼                                        ▼                                       ▼
[HR 1 generates unique link]            [HR 2 generates unique link]            [Website Job Card (Admin Source)]
         │                                        │                                       │
         ▼                                        ▼                                       ▼
[Shares on WhatsApp/LinkedIn]           [Shares on WhatsApp/LinkedIn]           [Candidate applies on /jobs]
         │                                        │                                       │
         ▼                                        ▼                                       ▼
[Candidate submits form]                [Candidate submits form]                [Candidate submits form]
         │                                        │                                       │
         ▼                                        ▼                                       ▼
[Flows into HR 1 Candidate Pool]        [Flows into HR 2 Candidate Pool]        [Flows into Admin Candidate Pool]
         │                                        │                                       │
         └────────────────────────────────────────┼───────────────────────────────────────┘
                                                  │
                                                  ▼
                     [HR/Admin screens profile & clicks 1-tap WhatsApp connect]
                                                  │
                                                  ▼
                     [Candidate agrees to interview with referral code: HR Name + RiseUp]
                                                  │
                                                  ▼
                     [HR marks status: "Going for Interview"]
                                                  │
                                                  ▼
             [Candidate instantly appears in Client's Candidate Review Dashboard]
                                                  │
                                                  ▼
                                     [Candidate attends interview]
                                                  │
                                                  ▼
                     [Client or HR updates status: Selected / Rejected / Absent]
                                                  │
                                                  ▼
                 [Selected status updates live in Admin KPIs, Client View & HR View]
                                                  │
                                                  ▼
                 [30-Day Placement Invoice Matures -> HR Commission Recorded]
```

---

## 3. Platform Architecture & User Roles

The platform consists of **1 Public Website** and **3 Authenticated CRM Portals**:

### 3.1 Public Portal (No Login Required)
* **Job Seekers:**
  * Browse open vacancies filtered by Country, City, Industry (IT / Non-IT), and Experience.
  * One-click apply with 2MB PDF resume without creating an account or logging in.
  * Submissions flow into the **Admin Candidate Pool**.
* **Prospective Employers:**
  * Submit corporate hiring inquiry ("Request Talent") without login.
  * Details flow into Admin CRM as a new Client Lead for sales follow-up and contract agreement.

---

### 3.2 Super Admin Portal (Full Platform Oversight)
1. **Master Dashboard:**
   * Time filters: `Today`, `This Week`, `This Month`, `Custom`.
   * **HR Workforce Metrics:** Total HR recruiters, logged in today, currently online, absent.
   * **Candidate Pipeline Metrics:** Total leads collected across all sources (HR links + website), total marked "Going for Interview", total "Selected", total "Rejected", total "Absent".
   * **Financial & Mandate Metrics:** Total active vacancies, placed candidates, pending 30-day billing, completed placements.
2. **Client Management:**
   * Create client company accounts securely:
     * Company Name, Country (India/Nigeria), City dropdown (Pune, Mumbai, Lagos, etc.), Contact Person, Official Email, Phone Number, Password.
   * Credential sharing and password reset management handled centrally by Admin.
   * View all vacancies requested by each client.
   * View all candidates interviewed and hired per client.
3. **HR Recruiter Management:**
   * Create HR recruiter accounts (Full Name, Official Email, Phone Number, Password).
   * Activate / Deactivate HR accounts.
   * Centralized password reset for recruiters.
   * Track HR performance: leads sourced, interviews scheduled, conversion rate, placed candidates, commissions earned.
4. **Vacancy Broadcast & Website Publishing:**
   * When a client submits a new vacancy request, it arrives in Admin's pending review queue.
   * Admin reviews role criteria and with one click:
     * **Broadcast to all HRs:** Pushes vacancy live to all recruiter dashboards with broadcast alert.
     * **Post to Website:** Publishes as a verified vacancy card on the public `/jobs` section with Admin tracking.
   * Admin can enable/disable/close any vacancy globally at any time.
5. **Agreements & Contract E-Signature:**
   * Select client from dropdown.
   * Fill standardized agency service agreement (placement fee %, payment timeline e.g. 30 days, candidate guarantee period, dispute terms).
   * Generates a secure hashed agreement URL for external client access and embeds it in the Client Portal.
   * Client reads, e-signs, and submits. Timestamped signature, IP address, and PDF agreement record saved.
6. **Admin Candidate Pool (Website Inflow):**
   * Review all applicants who applied via public website `/jobs` cards.
   * Filter, screen resumes, send customized WhatsApp messages, and assign or process through interview stages.

---

### 3.3 Corporate Client (Employer) Portal
1. **Dashboard:**
   * Ongoing drive metrics: Total vacancies open, candidates scheduled for interview, candidates interviewed, total selected, total rejected, total absent.
2. **Recruitment / Vacancy Management:**
   * Multi-step "Create Vacancy" form:
     * **Step 1:** Company profile confirmation (Company Name, Country, City auto-filled from account).
     * **Step 2:** Job Criteria: Title, Department/Category (Voice BPO, Non-Voice BPO, Back Office, BPM, IT Software, IT Support, Admin), Headcount needed, Experience required (0-1, 1-3, 3-5, 5+), Working mode (On-site / Hybrid / Remote), Shift timings, Salary/CTC range, Job Description, Required Skills.
     * **Step 3:** Commercial terms confirmation & submit.
   * Vacancy status view (Pending Review, Active/Recruiting, Fulfilled, Disabled).
   * Client can disable/close a vacancy at any point when hiring quota is met, which automatically deactivates it across all HR dashboards.
3. **Candidates Section (Interview Tracking):**
   * Real-time list of all candidates marked by **any HR** as "Going for Interview" for this client's mandates.
   * Displays: Candidate Name, Phone, Email, Qualification, Experience, Resume PDF, and Referring HR Name (`Referral: HR Name + RiseUp`).
   * **Dual Status Management:** Client can update candidate status directly:
     * `Interviewed`
     * `Selected` (Triggers celebratory update in HR & Admin dashboards)
     * `Rejected` (With feedback note)
     * `Absent / No-Show`
4. **Agreements Section:**
   * View ongoing and historical recruitment service agreements.
   * Review terms, payment milestones, and execute digital e-signature.

---

### 3.4 HR Recruiter / Consultant Portal
1. **Recruiter Dashboard:**
   * Personal KPIs: Leads generated, candidates contacted, interviews scheduled, candidates selected, commissions earned.
2. **Vacancies & Unique Link Generator:**
   * View all active vacancies broadcasted by Admin.
   * **One-Click Link Generator:** Creates a unique tracked URL tied specifically to this HR ID and the chosen Vacancy:
     * Example: `/apply/[vacancy-slug]?ref=[hr-unique-id]`
   * HR manages personal links: Enable, Disable, or Delete.
   * HR copies the link to distribute across WhatsApp groups, LinkedIn networks, Telegram, and job boards.
3. **Candidate Application Form (Rendered via HR Link):**
   * Auto-populated header: Job Title, Job Category, Location (City, Country).
   * Candidate inputs:
     * Full Name, Email, WhatsApp Phone Number.
     * Current City, Total Experience (Years & Months).
     * Highest Qualification.
     * **Multi-Skill / Cross-Role Checkboxes:** Voice Process, Non-Voice Process, Back Office Operations, Customer Support, Chat/Email Support, IT Helpdesk (enables talent banking for future openings).
     * Resume PDF upload (Strict 2MB limit).
4. **HR Candidate Pool & ATS Pipeline:**
   * All submissions from the HR's unique links land exclusively in this HR's candidate inbox.
   * **Search & Multi-Filter:** Filter by Role, Experience, City, and Status.
   * **One-Click WhatsApp Integration:**
     * Custom message template configured by HR.
     * Click button &rarr; opens `https://wa.me/[phone]?text=[formatted message with Candidate Name & Vacancy]`.
     * Automatically updates status to `Connected`.
   * **Stage Pipeline:**
     * `Applied / New Lead` &rarr; `Connected` &rarr; `Going for Interview` &rarr; `Interviewed` &rarr; `Selected` &rarr; `Rejected` &rarr; `Absent`.
   * **Trigger Behavior:** When HR changes status to `Going for Interview`, the candidate's profile is immediately pushed to the Client's portal with the official referral tag.
   * **Live Status Sync:** Any update made by the client (`Selected`, `Rejected`, `Absent`) updates in real-time on the HR's pipeline.

---

## 4. Universal Technical, Security & Design Constraints

* **Design Aesthetic:**
  * **Strict Square Edges (`rounded-none`):** Cards, buttons, tables, modals, badges, inputs across Public Site AND Admin/Client/HR CRM.
  * **Color Palette:** Pure White (`#ffffff`), Crisp Slate (`#f8fafc`), Royal Blue (`#1d4ed8` / `#2563eb`), Dark Slate (`#0f172a`).
  * **Floating Dock & Bars:** Apple-style `.liquid-glass` with 93% opacity and 28px soft diffusion blur.
  * **Typography:** Plus Jakarta Sans (Headings) and Inter (Body). Concise, context-rich text.
* **Mobile-First Responsiveness:**
  * Public site and all 3 CRM dashboards must be fully optimized for mobile viewports (320px – 420px) with zero horizontal overflow.
  * Table views on mobile collapse into vertical summary cards.
* **Security Standards:**
  * 100% Zod schema validation on all inputs and server actions.
  * Passwords hashed using Argon2id / bcrypt (cost factor >= 12).
  * Session management via HTTP-only, Secure, SameSite cookies.
  * Resumes strictly validated for 2MB limit and `%PDF-` binary magic bytes.
  * Parameterized Prisma queries with zero raw SQL interpolation.
  * Sensitive internal routes protected with `robots: noindex, nofollow`.
* **Deployment Constraints:**
  * Designed for **Hostinger Business Hosting** (Node.js + MySQL).
  * Self-contained: No external paid dependencies (no AWS S3, no third-party auth services). Resumes stored locally in `/uploads/resumes/` with UUID names.
* **Git Protocol:**
  * Feature-by-feature commits created locally.
  * Automated push disabled—developer pushes manually via terminal (`git push origin main`) to allow Windows account selection.
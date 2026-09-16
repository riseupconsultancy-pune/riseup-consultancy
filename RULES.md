# RiseUp Consultancy — Master Development, Design & Security Rules

> **MANDATE FOR ALL CODING AGENTS AND DEVELOPERS:**  
> This document defines the non-negotiable architectural standards, design specifications, and security-first engineering protocols for the **RiseUp Consultancy** web platform and internal ATS/CRM dashboard.  
> Every feature, page, component, server action, and database migration **MUST STRICTLY COMPLY** with these rules. Never take shortcuts, hallucinate temporary patches, or introduce unvetted libraries.

---

## 1. Architectural & Engineering Philosophy

### 1.1 Zero Patchwork & Enterprise Quality
* **No Quick Hacks or Band-Aids:** Write clean, modular, production-grade Next.js App Router (TypeScript) code designed for long-term maintainability.
* **No Incomplete Code / Placeholders:** Never leave `// TODO: implement later`, fake mock data in place of working database operations, or stubbed endpoints. Every feature implemented must be end-to-end complete and verified.
* **Double-Check & Self-Audit:** Before concluding any feature, analyze written code line-by-line for edge cases, null pointer exceptions, unhandled promises, and security flaws.
* **Self-Contained Deployment (Hostinger Business Hosting):**
  * Target environment is a Node.js web application running on Hostinger with local MySQL.
  * Do not introduce external paid third-party dependencies (no AWS S3, Firebase, Supabase, Auth0, or SendGrid). Authentication, file handling, and database operations must remain 100% self-hosted and self-contained.

---

## 2. Design & UI/UX Standards

### 2.1 Mobile-First Mindset & Complete Responsiveness
* **Design for Mobile First (320px – 420px):**
  * Prioritize narrow mobile viewports before scaling up to tablet and desktop.
  * Every component, modal, table, filter, and header must be designed specifically with mobile touch interactions, legible typography, and tight viewport constraints in mind.
* **Zero Horizontal Scroll:** The page body and containers must enforce `overflow-x: hidden`. No dropdown, table, or floating widget may bleed beyond the viewport edges.
* **Touch Target Sizing:** Interactive buttons, tabs, and inputs must maintain a minimum touch target of 44x44px with comfortable padding.
* **Adaptive Multi-Page & Split Layouts:**
  * Desktop complex layouts (e.g. 25% sidebar filters + 75% cards) must cleanly compress on mobile into collapsible drawer/filter pills on top, followed by streamlined single-column vertical cards.
  * Mobile cards must present high-signal data first (Title, Location, Experience, Action button) without taking up unnecessary screen height.

### 2.2 Aesthetic & Brand Identity
* **Sharp Architectural Geometry:**
  * **Strictly Square Edges (`rounded-none`):** Every button, input, card, modal, badge, table cell, and floating dock must use sharp square corners. Rounded pills (`rounded-full`, `rounded-xl`, `rounded-lg`) are strictly prohibited across the entire platform.
* **Color System:**
  * **Primary Action / Accent:** Royal Blue (`#1d4ed8` / `#2563eb`).
  * **Backgrounds:** Pure Canvas White (`#ffffff`), Slate Crisp (`#f8fafc`, `#f1f5f9`).
  * **Typography & Headings:** Executive Dark Slate (`#0f172a`).
  * **Muted / Secondary Text:** Slate Subdued (`#64748b` / `#475569`).
  * **Borders & Dividers:** Crisp Hairline Slate (`#e2e8f0` / `#cbd5e1`).
* **Liquid Glass Effect:**
  * Use `.liquid-glass` for floating docks and subtle navigation bars.
  * Glass must remain slightly solid (`background: rgba(255, 255, 255, 0.93)`) with high soft diffusion (`backdrop-filter: blur(28px) saturate(180%)`) and specular borders (`border: 1px solid rgba(255, 255, 255, 0.98)`). Background content must softly blur behind it rather than showing through sharply.
* **Typography & Copywriting:**
  * **Headings:** Plus Jakarta Sans (`font-heading`, bold, tight letter-spacing `-0.025em`).
  * **Body:** Inter (`font-sans`, clean, neutral).
  * **Text Volume:** Minimal, punchy, and context-rich. Avoid wordy corporate fluff, buzzwords, or verbose filler sentences.
* **Visual Symmetry & Alignment:**
  * Multi-column bars (e.g., bottom dock) must use strict fractional CSS grids (`grid grid-cols-N`) with equal slot widths (`w-full min-w-0`), ensuring no item gets clipped or distorted.

### 2.3 Universal Theme Across Public Portal & Admin Dashboard
* The internal Admin & HR CRM (candidate pipelines, vacancy managers, agreements, analytics) must share the **exact same design DNA**:
  * Square architectural containers (`rounded-none`).
  * White & crisp slate data grids with royal blue active accents.
  * Clean typographic hierarchy with zero visual clutter.

---

## 3. Security-First Architecture & Secure Coding

### 3.1 Strict Input Validation & Type Safety
* **Zero-Trust Input Sanitization:** Never trust data from clients, forms, URL parameters, or headers.
* **Schema Validation with Zod:** Every Server Action and API Route must parse incoming data through a strict **Zod** schema. Invalid payloads must be rejected immediately with structured error feedback.
* **Type Narrowing:** Enforce strict TypeScript types on all inputs, database queries, and component props. Never use `any`.

### 3.2 Authentication, Authorization & Session Management
* **Role-Based Access Control (RBAC):**
  * Roles: `SUPER_ADMIN`, `HR_CONSULTANT`, `EMPLOYER`, `CANDIDATE`.
  * Public endpoints must never leak candidate notes, client agreement terms, or internal contact numbers.
  * Protected routes (`/admin/*`) must be secured at the middleware layer (`middleware.ts`) and verified on every server action.
* **Password Hashing:**
  * Admin and recruiter credentials must be hashed using high-cost algorithms (**Argon2id** or **bcrypt** with a minimum salt round of 12). Plaintext passwords must never touch logs or databases.
* **Session Storage:**
  * Authentication sessions must use cryptographically secure HTTP-only cookies (`httpOnly: true`, `secure: process.env.NODE_ENV === "production"`, `sameSite: "lax"`, `path: "/"`).
  * Session IDs must be 256-bit cryptographically random tokens (`crypto.randomBytes(32)`).

### 3.3 File Upload Security (Resume & Document Vault)
* **Strict Size Limit:** Resumes and attachments must not exceed **2MB**. Larger files must be rejected immediately on both client and server before processing.
* **MIME & Magic Number Verification:**
  * Do not trust the file extension or the `Content-Type` header supplied by the browser.
  * Verify the file's binary magic bytes on the server: ensure PDF files begin with the `%PDF-` signature (`0x25, 0x50, 0x44, 0x46, 0x2D`).
* **Path Traversal Prevention:**
  * File names must never be saved directly from user input. Generate safe, unique UUID filenames (e.g. `uuidv4() + ".pdf"`).
  * Store files in a dedicated storage directory outside the public web root or in a controlled `/uploads/resumes/` folder protected from direct script execution.
* **Safe Delivery Headers:**
  * When downloading or viewing files, serve them with defensive HTTP headers:
    * `Content-Type: application/pdf`
    * `Content-Disposition: inline; filename="sanitized_name.pdf"`
    * `X-Content-Type-Options: nosniff`

### 3.4 Database & SQL Injection Protection
* **Exclusively Parameterized Queries via Prisma:**
  * Never use raw SQL string interpolation or concatenation (`$queryRawUnsafe`).
  * Use standard Prisma ORM methods (`findUnique`, `findMany`, `create`, `update`) which automatically parameterize all parameters.
* **Data Isolation:**
  * Queries must include explicit tenancy or ownership filters to prevent Insecure Direct Object References (IDOR).

### 3.5 Cross-Site Scripting (XSS) & CSRF Defense
* **No Raw HTML Injection:** Do not use `dangerouslySetInnerHTML`. If markdown rendering is ever required, sanitize it thoroughly with `DOMPurify` / `isomorphic-dompurify`.
* **Server Action CSRF Shield:**
  * Rely on Next.js built-in Host header and Origin header verification for Server Actions.
  * For custom REST endpoints, enforce CSRF tokens or custom request headers (`X-Requested-With`).

### 3.6 Security Headers
* In `next.config.ts`, ensure modern security response headers are configured:
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### 3.7 Rate Limiting & Abuse Prevention
* Implement rate limiting on sensitive public endpoints:
  * Application submission form (Candidate CV intake).
  * Employer vacancy request intake.
  * Admin login attempts.
* Prevents automated bot scraping, credential stuffing, and disk exhaustion attacks.

---

## 4. In-Flight SEO & Structured Metadata Engineering

### 4.1 Apply SEO During Development of Every Feature
* **Never Postpone SEO to the End:** Every page, dynamic route, and public component must have its search engine optimization built concurrently with the feature.
* **Semantic HTML5 Hierarchy:**
  * Exactly **one** `<h1>` per page representing the core topic.
  * Nested semantic heading hierarchy (`<h2>`, `<h3>`) with zero skipped levels.
  * Semantic container landmarks: `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, and `<footer>`.
* **Descriptive Image Alt Attributes:**
  * Every `<Image>` component from `next/image` must provide meaningful, descriptive `alt` text incorporating relevant keywords (e.g. `alt="RiseUp Consultancy - Recruitment and Staffing in Pune and Lagos"`). Never use empty or generic `alt="image"` strings.

### 4.2 Dynamic Metadata & OpenGraph Architecture
* **Metadata Export on Every Public Page:**
  * Every public `page.tsx` must export a tailored `Metadata` object or `generateMetadata()` function.
  * Title Template: `%s | RiseUp Consultancy - Executive Recruitment`.
  * Contextual Meta Descriptions: 140–160 characters, concise, high-value, action-oriented.
  * Canonical URLs: Every public route must declare its canonical URL to prevent duplicate content indexing.
  * OpenGraph (OG) & Twitter Cards: Provide `og:title`, `og:description`, `og:url`, `og:siteName`, `og:locale`, and `og:image` on all public marketing and job pages.

### 4.3 Rich JSON-LD Structured Data (Google for Jobs & Schema.org)
* **JobPosting Schema:**
  * The `/jobs/[id]` dynamic page must render a Google-compliant `<script type="application/ld+json">` containing `JobPosting` schema:
    * `title`, `description`, `datePosted`, `validThrough`, `employmentType`, `hiringOrganization`, `jobLocation` (specifying city, region, country for Pune/Mumbai/Bengaluru or Lagos/Abuja), and `baseSalary` (when applicable).
  * Enables native listing in **Google for Jobs** search engine results.
* **Organization & Breadcrumb Schema:**
  * Root layout must include `Organization` schema detailing official brand name, logo URL, addresses (Pune & Lagos), and contact endpoints.
  * Subpages must include `BreadcrumbList` schema to assist search bot navigation.

### 4.4 Defensive Privacy & Noindex on Internal Routes
* **Block Indexing on Sensitive Routes:**
  * Internal CRM, admin portal (`/admin/*`), recruiter workflows, and candidate confidential file viewers must strictly export:
    ```ts
    export const metadata: Metadata = {
      robots: {
        index: false,
        follow: false,
        nocache: true,
      },
    };
    ```
  * Never allow private candidate resumes, interview feedback, or corporate agreement terms to be crawled or indexed by search engines.

---

## 5. Development Workflow & Git Protocol

### 5.1 Feature-by-Feature Incremental Delivery
* Build and commit features one by one in logical, atomic stages:
  1. **Database Schema & Migrations** (Prisma)
  2. **Server Actions & Security Validation** (Zod + RBAC)
  3. **UI Components & Responsive Layouts** (Tailwind + Square Theme + SEO)
  4. **Integration, End-to-End Verification & Build Test**
* Each stage must be verified with `npm run build` before pushing to GitHub.

### 5.2 Git Commit Conventions
* Use clear, conventional commit messages:
  * `feat(jobs): add filter sidebar and verified vacancy cards`
  * `sec(auth): implement argon2id password hashing and session cookies`
  * `style(dock): apply liquid glass effect with sharp square styling`
  * `fix(mobile): resolve header dropdown overflow on 360px viewports`
  * `seo(jobs): add JobPosting JSON-LD and dynamic metadata`
* Note: Pushes to GitHub are executed manually by the developer to allow seamless multi-account selection in Windows Credential Manager.

---

## 6. Pre-Deployment Verification Checklist

Before deploying any feature or shipping to Hostinger, verify the following:
- [ ] **Mobile Responsiveness:** Tested on 360px, 390px, and 414px viewports without horizontal scroll.
- [ ] **Theme Adherence:** All corners are `rounded-none`, colors follow the blue-and-white scheme, typography is Plus Jakarta Sans + Inter.
- [ ] **SEO & Metadata:** Semantic HTML5 tags, unique title & description, canonical link, OpenGraph tags, and JSON-LD schema (JobPosting/Organization) applied. Admin routes set to `noindex`.
- [ ] **TypeScript Cleanliness:** `npm run build` passes with zero type errors, zero unhandled promises.
- [ ] **Input Validation:** All server actions validate with Zod schemas.
- [ ] **File Security:** Uploads strictly enforce 2MB limit and PDF magic byte verification.
- [ ] **Database Integrity:** Prisma migrations are applied cleanly without data loss.
- [ ] **Zero Console Errors:** DevTools console shows zero hydration warnings or runtime errors.

---
*Reference this file at the start of every implementation task to guarantee consistent quality, security, and architectural integrity.*
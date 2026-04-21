**Product Requirements Document (PRD) – OAG Official Website**  
**Project Name:** Office of the Auditor General (OAG) Solomon Islands – Official Website  
**Version:** 1.0  
**Date:** 20 April 2026  
**Tech Stack:** Next.js 15 (App Router + TypeScript + Tailwind CSS) + Strapi v5 (headless CMS)  

### 1. Background & Objectives (directly from TOR)
The OAG needs a modern, secure, responsive official website to:
- Increase public access to audit reports and institutional information.
- Improve transparency and accountability.
- Enable public engagement through news, resources, and contact channels.

**Success Criteria:**
- Fully functional, mobile-first website matching the 8 key pages in the TOR.
- Strapi admin panel for OAG staff to manage all content without coding.
- SEO-ready, fast-loading (<2s LCP), accessible (WCAG 2.1 AA).
- Completed in a learning-friendly way so you can understand every layer (Next.js frontend ↔ Strapi backend).

### 2. Scope
**In Scope:**
- All 8 pages listed in TOR.
- Strapi content types + admin panel.
- Public-facing API consumption in Next.js.
- Basic SEO (metadata, sitemap, Open Graph).
- Responsive design + modern UI.
- Contact form with email notification.
- Document/PDF upload & download for reports.
- Simple search/filter on Audit Reports and News.

**Out of Scope (for this learning project):**
- Live hosting / domain setup (you can do this later on Vercel + Render/DigitalOcean).
- User training videos / full documentation.
- Advanced analytics or payment integration.
- Multi-language (start with English only).

### 3. User Roles
1. **Public Visitor** – Browse all pages, download reports, submit contact form.
2. **OAG Admin** – Uses Strapi admin dashboard to create/edit content (no code required).

### 4. Page Requirements & Features

| Page              | Key Sections & Features                                                                 | Strapi Content Type     |
|-------------------|----------------------------------------------------------------------------------------|--------------------------|
| Home              | Hero banner, Latest Audit Reports (3 cards), Latest News (3 cards), Quick Links, Stats | Single Type "Home"      |
| About Us          | Text + image + mission/vision                                                          | Single Type "AboutUs"   |
| Functions         | List of core functions with icons/description                                          | Single Type "Functions" |
| Audit Reports     | Filterable list (year, type, keyword), detail page, PDF download                      | Collection "AuditReport"|
| News/Updates      | Blog-style list + detail page with rich text + featured image                          | Collection "News"       |
| Resources         | Downloadable guidelines, manuals, templates                                            | Collection "Resource"   |
| Opportunities     | Job openings & tenders (title, deadline, PDF)                                          | Collection "Opportunity"|
| Contact           | Contact form (name, email, message), office address, map embed, success message        | Form handled in Next.js |

**Shared Features:**
- Header with logo + navigation (sticky).
- Footer with links + copyright.
- Search bar (global + per-page).
- Breadcrumbs.
- Dark/light mode toggle (optional but nice).

### 5. Data Models (Strapi Content Types) – Exact Schema You Will Create

**Single Types (static pages):**
- `Home` – heroTitle, heroSubtitle, heroImage, stats (repeatable), featuredReports (relation), featuredNews (relation)
- `AboutUs` – title, body (rich text), image
- `Functions` – title, description (rich text), functions (repeatable component: icon, title, text)

**Collection Types:**
- `AuditReport`  
  Fields: title, slug, reportDate, reportType (enum: Financial, Performance, Compliance, IT), summary, fullReport (PDF upload), coverImage, publishedAt
- `News`  
  Fields: title, slug, date, category, excerpt, content (rich text), featuredImage, author
- `Resource`  
  Fields: title, slug, category, description, file (PDF/upload)
- `Opportunity`  
  Fields: title, slug, type (Job/Tender), deadline, description, attachment (PDF)
- `ContactSetting` (Single) – address, phone, email, googleMapsEmbedUrl

**Components (reusable):**
- `StatCard`, `LinkCard`, `ReportCard`, `NewsCard`

### 6. Non-Functional Requirements
- **Performance:** Next.js Image optimization + Strapi caching.
- **SEO:** Next.js `<Metadata>`, dynamic sitemap, robots.txt, Open Graph tags.
- **Security:** Strapi JWT auth + public API only for GET requests (use API tokens).
- **Accessibility:** Semantic HTML, alt texts, keyboard navigation.
- **Code Quality:** TypeScript, ESLint, Prettier, clean folder structure.

---

**Project Initialization Prompts (copy-paste ready for your LLM coding agent)**

### Prompt 1: Project Setup – Strapi Backend (Run first)
```
You are an expert Strapi v5 + Next.js full-stack developer.

Create a complete Strapi v5 project for the Office of the Auditor General website.

1. Initialize a new Strapi project with PostgreSQL (or SQLite for development).
2. Install and configure these plugins: 
   - @strapi/plugin-users-permissions
   - @strapi/plugin-seo
   - @strapi/provider-upload-local (later cloudinary)
3. Create ALL the content types exactly as defined in the PRD section 5 above (include every field, relations, and components).
4. Set up proper roles: Public role can only read published content. Authenticated role for admins.
5. Generate a sample .env.example and README with instructions.
6. Output the complete folder structure and the exact commands I need to run to start Strapi.

After generating, confirm when it's ready so I can move to Next.js.
```

### Prompt 2: Project Setup – Next.js Frontend
```
Create a latest Next.js (App Router) + TypeScript project for the OAG website that will consume the Strapi backend created in Prompt 1.

Requirements:
- Use Tailwind CSS + shadcn/ui components.
- App Router with folder structure: app/(public), app/api (if needed), components, lib, types.
- Environment variables for STRAPI_URL and STRAPI_API_TOKEN.
- Create a reusable Strapi fetch utility with proper typing (use Strapi's REST API).
- Set up global layout with Header, Footer, and Navigation.
- Add basic SEO utilities (metadata helper).
- Include a .env.example and README.

Output the full project structure and the exact commands to start both Strapi and Next.js in development mode (they should run simultaneously).
```

### Prompt 3: Connect Next.js to Strapi + Create Data Fetching Layer
```
Using the existing Next.js and Strapi projects:

1. Create TypeScript types that match every Strapi content type from the PRD.
2. Build a centralized API client (`lib/strapi.ts`) with functions like:
   - getHomeData()
   - getAllAuditReports({ filters })
   - getAuditReportBySlug(slug)
   - etc.
3. Implement error handling and revalidation (ISR) where appropriate.
4. Add a simple loading and error UI using shadcn components.

Test by fetching data in a temporary page and confirm everything works.
```

### Prompt 4: Build All Pages (you can run this after the above are done)
```
Now build the complete frontend for the OAG website using the existing Next.js + Strapi setup.

Create every page listed in the PRD (Home, About Us, Functions, Audit Reports with filters and detail page, News with detail, Resources, Opportunities, Contact).

For each page:
- Use server components and async/await for data fetching.
- Make it fully responsive and modern (government/professional aesthetic – clean blues and whites).
- Add proper metadata for SEO.
- Implement dynamic routes where needed ([slug]).
- For Audit Reports and News: add filtering, search, and pagination.
- For Contact page: build a working form that sends data to an API route (you can console.log for now or use Resend/EmailJS later).

Output the code file-by-file and tell me the order to implement them.
```

### Prompt 5: Polish & Final Deliverables
```
Final polish for the OAG website:

1. Add 404 page, loading states, and toast notifications.
2. Generate sitemap.xml and robots.txt dynamically.
3. Optimize all images with Next.js Image.
4. Add a simple admin link in footer pointing to Strapi dashboard.
5. Create a README with:
   - How to run both projects
   - How to add new content in Strapi
   - Deployment instructions (Vercel + Strapi host)
6. Export a production-ready build checklist.

This should match the TOR deliverables: fully functional website + admin access.
```

### Prompt 6: Design Color Scheme
```
Role: Act as an expert UI/UX designer and frontend web developer. 

Task: I need you to create a comprehensive website color scheme and CSS implementation plan based on the national flag of the Solomon Islands. 

Design Requirements & Context:
Theme: The design must be consistent with official Solomon Islands government websites. It needs to look authoritative, professional, clean, and trustworthy.
Flag Colors: The palette must incorporate the colors of the Solomon Islands flag: Ocean Blue, Land Green, Sun Yellow, and White. 
Accessibility: The contrast ratios must meet WCAG AA or AAA standards for readability (e.g., do not use white text on a bright yellow background).

Specific Deliverables:
1. Hex Codes & Palette Generation: Provide the exact Hex, RGB, and HSL codes for the primary, secondary, accent, background, and text colors. Create a cohesive palette that tones down the raw flag colors slightly so they look good on a digital screen without being harsh on the eyes.
2.Usage Guidelines: Clearly explain where each color should be used (e.g., "Use Navy/Ocean Blue for the primary navbar, header text, and primary buttons. Use Green for secondary accents. Use Yellow sparingly for alerts, active states, or call-to-action highlights. Use White/Off-White for backgrounds.").
3. CSS Implementation: Write a clean `style.css` snippet utilizing CSS variables (`:root`) for this color palette so I can easily drop it into my project. 
4. Tailwind Configuration (Optional): Provide the `tailwind.config.js` theme extension for these colors.
5. HTML Example: Provide a brief, semantic HTML layout example (Header, Main, Button, Footer) applying these specific color classes to demonstrate what the government-style design looks like in practice.
```
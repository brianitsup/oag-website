# Office of the Auditor General - Next.js Frontend

This is the Next.js App Router frontend for the OAG website. It consumes the Strapi v5 backend to present reports, news, and pages to the public.

## Tech Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Strapi REST API

## Getting Started

1. **Environment Setup**
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   Update `.env.local` if your Strapi backend runs on a different port or you generated a new API token.

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run the Development Server**
   To run Next.js in development mode, execute:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure
- `app/`: Next.js App Router root layout and routes.
- `app/(public)/`: Publicly accessible pages like Home, Reports, News.
- `components/`: UI components including `shadcn/ui` base elements and layout (`Header`, `Footer`, `Navigation`).
- `lib/`: Utility functions (e.g., `strapi.ts` for API calls, `seo.ts` for Metadata mapping).
- `types/`: TypeScript interfaces for Strapi data models.

## Integration with Strapi
The frontend uses the `fetchAPI` utility found in `lib/strapi.ts` to query the Strapi REST API. It handles authorization, URL formatting, and Next.js data revalidation automatically.

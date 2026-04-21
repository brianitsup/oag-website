# Office of the Auditor General (OAG) Solomon Islands - Official Website

This repository contains the complete Next.js frontend and Strapi v5 backend for the OAG official website.

## Project Architecture

- **Backend (`/backend`)**: Headless CMS powered by **Strapi v5**. Uses SQLite for local development. Provides REST API endpoints and an Admin Dashboard for managing content.
- **Frontend (`/frontend`)**: Built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS v4**, and **shadcn/ui**. It statically generates pages and revalidates them periodically (ISR - Incremental Static Regeneration).

---

## 🚀 Running the Project Locally

You will need two terminal windows to run both servers simultaneously.

### 1. Start the Strapi Backend
```bash
cd backend
npm install
npm run develop
```
- The API will be available at `http://localhost:1337/api`
- The Admin Panel will be available at `http://localhost:1337/admin`

### 2. Connect the Frontend
Before starting the frontend, you must generate a Strapi API token:
1. Log in to `http://localhost:1337/admin`
2. Go to **Settings > Global Settings > API Tokens**
3. Create a **Read-Only** token.
4. Copy the token and paste it into `frontend/.env.local`:
   ```env
   STRAPI_API_TOKEN=your_token_here
   ```

### 3. Start the Next.js Frontend
```bash
cd frontend
npm install
npm run dev
```
- The website will be available at `http://localhost:3000`

---

## 📝 How to Add New Content in Strapi

1. Log into the Strapi Admin Panel (`http://localhost:1337/admin`).
2. Use the **Content Manager** on the left sidebar.
3. You will see two types of content:
   - **Collection Types**: Use these to add multiple items like **News**, **Audit Reports**, **Opportunities**, and **Resources**. Click "Create new entry", fill out the fields (make sure to set a slug), and click **Publish**.
   - **Single Types**: Use these to edit singleton pages like **Home**, **About Us**, **Functions**, and **Contact Settings**. Edit the fields and click **Save**.

*Note: The Next.js frontend caches data for 60 seconds. Changes made in Strapi will automatically appear on the website within one minute.*

---

## 🌍 Deployment Instructions

### Deploying the Strapi Backend (Render / DigitalOcean / Heroku)
1. Set up a **PostgreSQL** database.
2. Update the `backend/.env` file with your `DATABASE_CLIENT=postgres` and the respective host, port, username, password.
3. Commit and push your code to GitHub.
4. Connect the repository to your hosting provider.
5. Set the Node environment to `production` and configure the environment variables in the host's dashboard.
6. The build command is `npm run build` and the start command is `npm run start`.

*Note: For production file uploads, install and configure the `@strapi/provider-upload-cloudinary` plugin to store images/PDFs.*

### Deploying the Next.js Frontend (Vercel)
1. Go to [Vercel](https://vercel.com/) and import your GitHub repository.
2. Set the Root Directory to `frontend`.
3. Add the following Environment Variables in Vercel:
   - `NEXT_PUBLIC_STRAPI_URL`: Your live Strapi API URL (e.g., `https://api.oag.gov.sb`).
   - `NEXT_PUBLIC_SITE_URL`: Your live frontend URL (e.g., `https://www.oag.gov.sb`).
   - `STRAPI_API_TOKEN`: The Read-Only token generated from your live Strapi admin.
4. Click **Deploy**. Vercel will automatically build and host your Next.js application.

# Supabase & Vercel Setup Guide

This guide walks you through connecting your local Vercel application to a new Supabase database for the Global Memory Telemetry feature.

---

## Part 1: Setting up Supabase

### 1. Create a Project
1. Go to [database.new](https://database.new) and sign in or create a Supabase account.
2. Click **New Project**.
3. Select your organization, give your project a name (e.g., `rlwrld-telemetry`), and create a strong database password.
4. Choose a region closest to your target users and click **Create new project**. It will take a few minutes for the database to provision.

### 2. Create the Database Table
1. Once provisioned, go to the **SQL Editor** on the left sidebar in your Supabase dashboard.
2. Click **New query** and paste the following SQL schema:
   ```sql
   CREATE TABLE global_runs (
     id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
     created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
     span integer NOT NULL,
     delivery_mode numeric NOT NULL,
     speed numeric NOT NULL,
     easy_mode boolean NOT NULL,
     reaction_time numeric,
     hesitation numeric,
     score integer
   );
   ```
3. Click **Run** (or press Cmd+Enter) to create the table.

### 3. Get Your API Keys
1. Go to **Project Settings** (the gear icon at the bottom of the left sidebar).
2. Under "Configuration", select **API**.
3. Under **Project URL**, copy the URL. This is your `VITE_SUPABASE_URL`.
4. Under **Project API keys**, copy the `service_role` key (you will need to click "Reveal" first). This is your `SUPABASE_SERVICE_ROLE_KEY`. 
   > **Warning:** Never share the `service_role` key or commit it to GitHub. It has administrative privileges.

---

## Part 2: Local Vercel Setup

### 1. Configure Local Environment Variables
1. In your project's root folder, duplicate `.env.example` and rename it to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and paste the URL and Service Role Key you copied from Supabase:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJh... (your long key here)
   ```

### 2. Install Vercel CLI
To run serverless functions (the `api/` folder) locally, you need the Vercel CLI.
1. Run this in your terminal:
   ```bash
   npm i -g vercel
   ```

### 3. Link Your Project to Vercel
1. In your terminal, authenticate with Vercel:
   ```bash
   vercel login
   ```
2. Link your local directory to a Vercel project:
   ```bash
   vercel link
   ```
   *Follow the prompts (Set up and deploy? `N` for now, just link to existing or create new).*

### 4. Pull Environment Variables (Optional but Recommended)
If you add your Supabase credentials to the Vercel dashboard, you can pull them down for local dev:
```bash
vercel env pull
```

---

## Part 3: Running and Testing Locally

1. Start your local Vercel development server:
   ```bash
   vercel dev
   ```
2. This command will start Vite for your frontend (usually on `localhost:3000` or `localhost:5173`) **AND** it will locally host your serverless functions at `localhost:3000/api/telemetry`.
3. Play a round in your browser and intentionally fail.
4. Check the **Network Tab** in Chrome DevTools. You should see a successful `POST /api/telemetry` request.
5. Go back to your Supabase dashboard, click on **Table Editor** in the left sidebar, select `global_runs`, and verify that a new row has appeared!

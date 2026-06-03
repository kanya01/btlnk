# 🌍 Global Memory & Telemetry Plan

## 1. Overview & Aim
Currently, all run data is stored locally in the user's browser via Zustand persist (localStorage). The goal of this initiative is to create a "global memory"—an aggregated, anonymised dataset of every run across all users.

**Primary Aim:** Data visualisation and insights. By collecting this data, we can surface community trends such as:
- *"Most people find the 'Bit by bit' delivery mode most successful for spans > 5."*
- *"The average cognitive limit for this speed setting is 4 items."*
- Global leaderboards or distribution curves (e.g., *"You are in the top 20% of players!"*)

Users do not need to be uniquely identified (no auth required), ensuring low friction and preserving privacy.

---

## 2. Technical Implementation Plan

Since the current application is a pure front-end React (Vite) app deployed on Vercel, we need a lightweight, serverless backend to ingest and query this telemetry data.

### Recommended Stack: Supabase (PostgreSQL) or Vercel KV (Redis)
We recommend **Supabase (PostgreSQL)** for relational queries, as it allows us to easily run aggregations (e.g., average span by delivery mode).

### Step-by-Step Implementation

#### Step 1: Database Schema (Supabase)
Create a simple `runs` table to capture the anonymous telemetry:
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

#### Step 2: The Ingestion API (Vercel Serverless Functions)
To avoid exposing the database directly to the client, we would create a simple Next.js API route or Vercel Function (`api/telemetry`).
When a user finishes a run (fails or completes a session), the client fires a lightweight, non-blocking POST request (`fetch`) with the run payload.

#### Step 3: Aggregation & Caching
Because querying "most successful settings" across thousands of rows can be slow, we would run a scheduled CRON job (or use database materialized views) to pre-calculate global statistics every hour:
- Average span per delivery mode
- Score distributions

#### Step 4: Client-Side Integration
In `src/store.ts` inside the `submitRecall` logic, we add an asynchronous fire-and-forget fetch request to push the `RunRecord` to our ingestion API without blocking the UI.

---

## 3. Critiques & Considerations

### 3.1 Feasibility
- **High Feasibility:** Implementing a simple `/api/telemetry` endpoint that writes to a database is highly feasible and standard practice.
- **Cost:** Services like Supabase or Vercel Postgres offer generous free tiers. Since we only insert a few bytes per run, scaling costs will be negligible in the early stages.

### 3.2 Complexity
- **Low to Medium Complexity:** The most complex part is not the data *collection*, but rather the data *querying* for insights.
- **Frontend Impact:** We must ensure that network failures to the telemetry endpoint do not break the core game loop. The fetch request must fail silently and not block the user's progression.

### 3.3 Data Integrity & Abuse Prevention
Because the endpoint is public and unauthenticated, it is susceptible to "botting" or spam requests polluting the dataset.
- **Risk:** Malicious users could send fake POST requests with impossible scores (e.g., `span: 1000`).
- **Mitigation:**
  - **Sanity Checks:** The API must strictly validate payloads. Reject any span > 20, speed > 3.0, or negative reaction times.
  - **Rate Limiting:** Implement IP-based rate limiting on the ingestion API to prevent spamming.
  - **Outlier Removal:** When calculating averages for the "wisdom" insights, use median values or strip out top/bottom 5% outliers to keep the data clean.

### 3.4 Privacy & Compliance
- **Anonymity:** By not collecting PII (Personally Identifiable Information), we largely bypass strict GDPR/CCPA burdens, though a basic cookie consent or privacy notice may still be required depending on region, especially if logging IP addresses for rate limiting. 
- **Session IDs:** If we send the local `sessionId` to track sequential runs from the same anonymous user, we must ensure it cannot be reversed to identify the individual.

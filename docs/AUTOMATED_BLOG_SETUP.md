# Automated Blog Engine & Publishing Pipeline Setup Guide

This guide details how to configure, verify, and run the automated daily editorial system for **StudentTools.cyou**.

---

## 🏗️ Architecture Overview

The system operates as a decoupled, asynchronous, quality-gated editorial pipeline:

```text
Google Sheet (Queue)
        │ (1 READY topic per day)
        ▼
   Topic Selector (High priority + category balancing)
        │
        ▼
  PROCESSING Lock (Atomic timestamp with 30-min stale recovery)
        │
        ▼
  Gemini API (Server-side structured JSON with tool metadata)
        │
        ▼
  Zod Schema Contract Validation
        │
        ▼
Automated Content Quality Gate
        │
        ├── Quality / Similarity Failure ──► status = REVIEW_REQUIRED (Safe exit)
        ├── Pipeline / API Failure        ──► status = FAILED (Safe exit)
        │
        └── PASS
              │
              ├── 1. Persist to Supabase / PostgreSQL (Source of Truth)
              ├── 2. Update Google Sheet (status = PUBLISHED, URL, hash)
              ├── 3. Dynamic Sitemap update (/blog/[slug])
              └── 4. Two-way internal linking (Calculator ↔ Blog)

[Conditional Monetization Layer]
Public Pages ──► Google AdSense Auto Ads (NEXT_PUBLIC_ADSENSE_ENABLED=true)
```

---

## 📋 Required Environment Variables

Add these to your production environment (e.g. Vercel Project Settings) or `.env.local` for local development:

```bash
# --- Core Platform ---
NEXT_PUBLIC_SITE_URL=https://studenttools.cyou

# --- Gemini API ---
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash

# --- Automated Editorial Engine ---
BLOG_AUTOPUBLISH_ENABLED=false
BLOG_DAILY_LIMIT=1
BLOG_PUBLISH_TIME=09:00
BLOG_TIMEZONE=Asia/Kolkata
CRON_SECRET=your_random_32_char_cron_secret_here

# --- Admin Dashboard ---
ADMIN_SECRET_KEY=your_secure_admin_password_here

# --- Google Sheets Queue (Production) ---
GOOGLE_SHEETS_SPREADSHEET_ID=1n5fsm9OPkQ1XpUNnlxLcLIN_Jl2SKMWa8dNN3vFbKDI
GOOGLE_SHEETS_WORKSHEET_NAME=Topics
GOOGLE_SERVICE_ACCOUNT_EMAIL=studenttools-blog-bot@your-project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgk...-----END PRIVATE KEY-----\n"

# --- Database / Supabase (Source of Truth for Articles) ---
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# --- Google AdSense (Auto Ads) ---
NEXT_PUBLIC_ADSENSE_ENABLED=false
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
```

---

## 1. Google Sheet Setup

1. **Spreadsheet ID:** Found in your Google Sheet URL:
   `https://docs.google.com/spreadsheets/d/1n5fsm9OPkQ1XpUNnlxLcLIN_Jl2SKMWa8dNN3vFbKDI/edit`
   ID = `1n5fsm9OPkQ1XpUNnlxLcLIN_Jl2SKMWa8dNN3vFbKDI`
2. **Worksheet Tab Name:** `Topics`
3. **Required Column Structure (17 Columns):**
   - `topic_id`: Unique identifier (e.g. `ST001`)
   - `topic`: Topic headline / prompt
   - `category`: Category (`JEE`, `Student`, `Career`, `Finance`, `General`)
   - `topic_cluster`: Cluster sub-theme (e.g. `Marks & Scoring`)
   - `article_type`: Educational, How-To, Comparison, Guide
   - `search_intent`: Search query intention
   - `primary_keyword`: Main target SEO keyword
   - `secondary_keywords`: Comma-separated secondary keywords
   - `related_tool`: Title of the matching tool (e.g. `JEE Marks Calculator`)
   - `related_tool_slug`: Canonical route (e.g. `/jee/marks-calculator`)
   - `content_angle`: Editorial angle instruction
   - `evergreen`: YES / NO
   - `priority`: HIGH / MEDIUM / LOW
   - `status`: READY / PROCESSING / PUBLISHED / REVIEW_REQUIRED / FAILED / SKIPPED
   - `published_url`: Canonical URL populated upon publication
   - `published_at`: ISO timestamp populated upon publication
   - `error`: Error details if quality check or API fails
   - `content_hash`: Deterministic SHA-256 hash preventing duplicates

### How to set up Google Cloud Service Account:
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Enable the **Google Sheets API**.
4. Go to **IAM & Admin > Service Accounts** and create a service account (e.g. `studenttools-bot`).
5. Under the Keys tab, click **Add Key > Create New Key > JSON**.
6. Download the key JSON and set:
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`: `client_email` from JSON.
   - `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`: `private_key` from JSON.
7. **Important:** Open your Google Sheet, click **Share**, and grant `Editor` access to your service account email.

*(Note: In local development, if Google Service Account credentials are not provided, the system seamlessly reads from `StudentTools_1105_Blog_Topics_Database.xlsx` as an offline fallback).*

---

## 2. Supabase / PostgreSQL Database Setup

Supabase serves as the authoritative source of truth for all published articles, logs, and locks.

1. Open your Supabase Dashboard or PostgreSQL client.
2. Navigate to the **SQL Editor**.
3. Copy and run the schema from [lib/db/schema.sql](file:///c:/Users/kumku/Documents/antigravity/vibrant-lavoisier/lib/db/schema.sql).
4. Retrieve your **Project URL** and **service_role key** from **Project Settings > API**.
5. Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in your environment.

*(Note: During offline testing or CI builds where Supabase is not connected, the repository automatically falls back to local storage at `data/storage/articles.json`).*

---

## 3. Gemini API Configuration

1. Get your API key from [Google AI Studio](https://aistudio.google.com/).
2. Set `GEMINI_API_KEY` in environment variables.
3. Recommended model: `gemini-2.5-flash` (fast, structured JSON response mode, high factual accuracy).

---

## 4. Automated Content Quality Gate

Before any article is published, it must pass automated quality gates in [lib/quality/validator.ts](file:///c:/Users/kumku/Documents/antigravity/vibrant-lavoisier/lib/quality/validator.ts):
- **Word Count:** 400 to 2,500 words.
- **Section Structure:** At least 3 H2 headers (`## `) with non-empty body content.
- **AI Anti-Filler & Ban List:** Rejects "As an AI language model...", "I cannot...", "[insert here]", "TODO", and robotic intros.
- **SEO Validation:** Meta title (25-75 chars), meta description (100-180 chars), primary keyword presence.
- **Calculator Route Check:** Verifies that `related_tool_slug` maps to an authentic, functioning tool in `data/tools.ts`.
- **Shingle/Jaccard Similarity:** Compares 3-gram character and word shingles against all published articles. If similarity exceeds 0.75, it flags `REVIEW_REQUIRED` to avoid duplicate content.

---

## 5. Daily Publishing Schedule & Vercel Cron

The schedule is configured in [vercel.json](file:///c:/Users/kumku/Documents/antigravity/vibrant-lavoisier/vercel.json):
```json
{
  "crons": [
    {
      "path": "/api/cron/publish",
      "schedule": "0 3 * * *"
    }
  ]
}
```
- `0 3 * * *` runs at 03:00 UTC (09:00 AM Indian Standard Time).
- Vercel automatically passes `x-vercel-cron: 1` and `Authorization: Bearer <CRON_SECRET>`.
- The endpoint is protected against unauthorized third-party triggers.

---

## 6. Google AdSense Auto Ads Configuration

AdSense is decoupled from the editorial pipeline:
1. When your Google AdSense account is approved:
   - Set `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX`
   - Set `NEXT_PUBLIC_ADSENSE_ENABLED=true`
2. AdSense Auto ads script loads conditionally on public routes via `next/script` (`strategy="afterInteractive"`).
3. The layout maintains zero cumulative layout shift (CLS), mobile-first responsiveness, and strict separation from calculator controls.

---

## 7. Admin Observability Dashboard (`/admin/blog`)

1. Visit `/admin/blog` in your browser.
2. Enter your `ADMIN_SECRET_KEY` to authenticate via secure HttpOnly session cookies.
3. Dashboard features:
   - Live queue counts (`READY`, `PROCESSING`, `PUBLISHED`, `REVIEW_REQUIRED`, `FAILED`).
   - Next queued topic for tomorrow.
   - **Dry-Run Test Button:** Tests Gemini generation and quality gate without saving.
   - **Publish Single Topic Now Button:** Triggers single publication with manual override.
   - Generation and quality gate logs with diagnostic errors.

---

## 8. Manual Setup Checklist

- [ ] Run `lib/db/schema.sql` in Supabase SQL Editor.
- [ ] Configure `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
- [ ] Add `GEMINI_API_KEY` to environment variables.
- [ ] Create Google Service Account, share Google Sheet with service account email, and set `GOOGLE_SERVICE_ACCOUNT_EMAIL` & `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`.
- [ ] Set `ADMIN_SECRET_KEY` and `CRON_SECRET`.
- [ ] Deploy to Vercel or hosting platform.
- [ ] Visit `/admin/blog`, sign in, and click **Dry-Run Test (No Save)** to verify Gemini and Quality Gate.
- [ ] Click **Publish Next Topic Now** to generate and publish your first live test article.
- [ ] Check `/blog` and verify the article renders with Breadcrumbs, Calculator CTA, and FAQs.
- [ ] Check that the Google Sheet row updated to `PUBLISHED` with its live URL.
- [ ] Check `/sitemap.xml` to verify the article slug is included.
- [ ] Once satisfied, enable automated daily cron by setting `BLOG_AUTOPUBLISH_ENABLED=true`.
- [ ] When ready for monetization, set `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXX` and `NEXT_PUBLIC_ADSENSE_ENABLED=true`.

# Google AdSense Crawler Verification & Troubleshooting Guide

This document details the exact technical setup, crawler verification behavior, robots.txt configuration, ads.txt implementation, Cloudflare compatibility, and step-by-step diagnostic procedures for **StudentTools.cyou**.

---

## 1. Google AdSense Verification Requirements

When you submit `studenttools.cyou` to Google AdSense for site approval, Google's automated verification bot (`Mediapartners-Google` and `Google-Display-Ads-Bot`) performs an initial crawler pass to verify site ownership and editorial structure.

### Dual-Method Verification Architecture:
To ensure 100% verification compatibility across both of Google's verification mechanisms, the site provides:
1. **AdSense Script Tag in `<head>`:**
   ```html
   <script
     async
     src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
     crossorigin="anonymous"
   ></script>
   ```
2. **AdSense Account Meta Tag in `<head>`:**
   ```html
   <meta name="google-adsense-account" content="ca-pub-XXXXXXXXXXXXXXXX">
   ```

Both tags are dynamically injected into the server-rendered HTML `<head>` on **every public page** when:
- `NEXT_PUBLIC_ADSENSE_ENABLED="true"`
- `NEXT_PUBLIC_ADSENSE_CLIENT="ca-pub-XXXXXXXXXXXXXXXX"` is set.

When AdSense is disabled (`NEXT_PUBLIC_ADSENSE_ENABLED="false"`), neither tag is injected, avoiding unnecessary third-party requests and ensuring zero impact on Core Web Vitals.

---

## 2. Robots.txt Configuration

Google's crawler requires explicit confirmation that it is allowed to crawl the site. The application implements dynamic robots configuration at `app/robots.ts` (`https://studenttools.cyou/robots.txt`):

```txt
User-Agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

User-Agent: Mediapartners-Google
Allow: /
Disallow: /admin/
Disallow: /api/

User-Agent: Google-Display-Ads-Bot
Allow: /
Disallow: /admin/
Disallow: /api/

User-Agent: Googlebot
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://studenttools.cyou/sitemap.xml
```

### Safety Guarantees:
- Public tools (`/jee/*`, `/student/*`, `/career/*`, `/finance/*`, `/calculators/*`) and educational guides (`/blog/*`) are crawlable.
- `/ads.txt` is NOT disallowed.
- Internal administrative dashboards (`/admin/*`) and private publishing APIs (`/api/*`) remain protected from search engines.

---

## 3. Dynamic ads.txt Implementation

The `ads.txt` file is dynamically served by Next.js at `app/ads.txt/route.ts` (`https://studenttools.cyou/ads.txt`):

- **Format:** `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`
- **Content-Type:** `text/plain; charset=utf-8`
- **HTTP Status:** `200 OK`
- **Prefix Handling:** The route automatically strips any leading `ca-` prefix from the client ID, ensuring the standard `pub-` format required by the IAB ads.txt specification.

---

## 4. Required Vercel Environment Variables

In your **Vercel Project Dashboard** (`Settings` -> `Environment Variables`), configure the following for **Production**:

| Variable Name | Required for AdSense | Production Example Value |
|---|---|---|
| `NEXT_PUBLIC_ADSENSE_ENABLED` | **Yes** | `true` |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | **Yes** | `ca-pub-1405060407756207` |
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://studenttools.cyou` |

> **Important:** In Next.js, variables prefixed with `NEXT_PUBLIC_` are inlined into the client bundle at build time. Whenever you change `NEXT_PUBLIC_ADSENSE_ENABLED` or `NEXT_PUBLIC_ADSENSE_CLIENT`, you must trigger a **Redeploy** in Vercel.

---

## 5. Cloudflare Compatibility & WAF Settings

If your domain uses Cloudflare (orange-cloud proxied DNS), Cloudflare's security layers can unintentionally block or challenge Google's crawler. Check the following settings in your Cloudflare dashboard:

### A. Bot Fight Mode (Most Common Cause)
- Go to: **Security** -> **Bots**
- If **Bot Fight Mode** is set to ON, Cloudflare may issue JavaScript challenges (Cloudflare Turnstile / Managed Challenge) to automated requests.
- **Action:** Temporarily toggle Bot Fight Mode OFF during site review, or upgrade to Super Bot Fight Mode and set "Definitely automated" to *Allow* for Verified Bots.

### B. WAF Custom Rules
- Go to: **Security** -> **WAF** -> **Custom Rules**
- Create a bypass rule for verified search and ad bots:
  - **Rule Name:** `Allow Verified Google Bots`
  - **Expression:** `(cf.client.bot) or (http.user_agent contains "Mediapartners-Google") or (http.user_agent contains "Google-Display-Ads-Bot")`
  - **Action:** `Skip` -> Check: *All remaining custom rules*, *WAF Managed Rules*, and *Rate Limiting*.

### C. SSL/TLS Encryption Mode
- Go to: **SSL/TLS** -> **Overview**
- Ensure mode is set to **Full (Strict)**.
- Setting it to "Flexible" can trigger infinite redirect loops between Cloudflare (HTTP port 80) and Vercel's automatic HTTPS redirect.

---

## 6. How to Inspect Cloudflare Security Events

To confirm whether Cloudflare blocked a crawler:
1. Open Cloudflare Dashboard -> Select `studenttools.cyou`.
2. Navigate to **Security** -> **Events**.
3. Filter by:
   - **Action:** `Managed Challenge`, `Block`, or `JS Challenge`
   - **User Agent:** Contains `Google` or `Mediapartners`
4. If you see challenged requests from Google IP addresses, note the matching Firewall/WAF Rule ID and adjust the rule.

---

## 7. Verifying the Live Production HTML

To verify that the AdSense tags are physically present in the live production HTML:

### Terminal Verification (Curl):
```bash
# Check raw SSR HTML for the AdSense client script and meta tag
curl -sL https://www.studenttools.cyou/ | grep -E "(pagead2|google-adsense-account)"
```

**Expected Output:**
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1405060407756207" crossorigin="anonymous"></script>
<meta name="google-adsense-account" content="ca-pub-1405060407756207"/>
```

### Browser Verification:
1. Visit `https://www.studenttools.cyou` in an incognito window.
2. Right-click anywhere and select **View Page Source** (Ctrl+U / Cmd+Option+U).
3. Search (`Ctrl+F`) for `pagead2.googlesyndication.com` or `google-adsense-account`.
4. Confirm both elements exist between `<head>` and `</head>`.

---

## 8. Verifying HTTP Status Codes & Redirects

Ensure your primary domain and subdomains resolve with clean HTTP status codes:

```bash
# Check apex domain redirect
curl -ILs https://studenttools.cyou/

# Check www subdomain
curl -ILs https://www.studenttools.cyou/

# Check robots.txt
curl -ILs https://www.studenttools.cyou/robots.txt

# Check ads.txt
curl -ILs https://www.studenttools.cyou/ads.txt
```

**Requirements:**
- The final destination page MUST return `HTTP/1.1 200 OK`.
- `ads.txt` and `robots.txt` must return `HTTP/1.1 200 OK` with `Content-Type: text/plain`.
- No page should return `401 Unauthorized`, `403 Forbidden`, or infinite 301/308 loops.

---

## 9. Google AdSense Dashboard Manual Checklist

Before clicking **Request Review** in the Google AdSense dashboard:

1. **Verify Site URL Match:**
   - Confirm whether the site is listed in AdSense as `studenttools.cyou` or `www.studenttools.cyou`.
   - Vercel automatically redirects one to the other (canonical). Ensure both resolve smoothly to `200 OK`.
2. **Select Verification Method:**
   - In AdSense: **Sites** -> Click on `studenttools.cyou`.
   - If "AdSense code snippet" failed earlier, select **Meta tag** (`<meta name="google-adsense-account" content="...">`). The site provides **both**, so either method will succeed.
3. **Verify ads.txt Status:**
   - In AdSense: **Sites** -> Check `ads.txt` column. Once crawled, AdSense will mark it as "Authorized".
4. **Editorial Quality Note:**
   - While these technical configurations guarantee that the AdSense crawler can reach and verify your site, AdSense approval also requires substantial unique content, compliant privacy policies, and navigational transparency. Automated quality gates assist in meeting these criteria, but final approval is determined by Google.

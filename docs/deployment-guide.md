# Deployment Guide

**Version:** 1.0  
**Last Updated:** April 2025  
**Target:** Vercel / Netlify / Static Hosting

---

## Quick Start

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm 9+ or yarn 3+
- Git (for version control)
- Google Gemini API key (from Google AI Studio)
- Google OAuth client ID (from Google Cloud Console)

### 1. Local Setup (Development)

```bash
# Clone repository
git clone https://github.com/yourusername/hom-nay-an-gi.git
cd hom-nay-an-gi

# Install dependencies
npm install

# Create .env.local file with secrets
cat > .env.local << EOF
GEMINI_API_KEY=your-gemini-api-key-here
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id-here
EOF

# Start development server (port 3000)
npm run dev

# App opens at http://localhost:3000
```

### 2. Verify Setup

```bash
# Check TypeScript compilation
npm run lint

# Build for production (test build locally)
npm run build

# Preview production build
npm run preview
```

---

## Environment Variables

### Required Variables

#### `GEMINI_API_KEY`
**Purpose:** Google Gemini 2.0 Flash API authentication  
**Value:** Long alphanumeric string from Google AI Studio  
**How to get:**
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy key (starts with `AIza...`)
4. Keep it secret (restrict by HTTP referrer)

**Security notes:**
- Client-side exposure risk (key visible in browser)
- Restrict in Google Cloud Console: `APIs & Services` → `Credentials` → Edit API key
- Add HTTP referrer: `https://yourdomain.com/*`
- Or: Move to backend proxy in production (not Phase 1)

**Example:**
```
GEMINI_API_KEY=AIzaSyC_qwert_yui_op_asdf_ghjk_lzxc_vbnm
```

#### `VITE_GOOGLE_CLIENT_ID`
**Purpose:** Google OAuth 2.0 client ID for Google Calendar integration  
**Value:** String ending with `.apps.googleusercontent.com`  
**How to get:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create project (or select existing)
3. Enable `Google Calendar API`
4. Create OAuth 2.0 Client ID (Web app)
5. Add authorized redirect URIs:
   - `http://localhost:3000` (dev)
   - `http://localhost:5173` (Vite default)
   - `https://yourdomain.com` (production)
6. Copy Client ID

**Security notes:**
- Client ID is semi-public (visible in browser)
- Configure redirect URIs to prevent abuse
- No sensitive data in Client ID itself

**Example:**
```
VITE_GOOGLE_CLIENT_ID=123456789-abc1defg2hij3klm4nopqrst5uvwxyz.apps.googleusercontent.com
```

### Development vs. Production

```bash
# Development (.env.local)
GEMINI_API_KEY=test-key-or-real-key
VITE_GOOGLE_CLIENT_ID=localhost-client-id

# Production (Vercel/Netlify env vars)
GEMINI_API_KEY=production-gemini-key
VITE_GOOGLE_CLIENT_ID=production-google-id
```

---

## Local Development

### Start Dev Server
```bash
npm run dev

# Output:
#   VITE v6.2.0  ready in 245 ms
#   ➜  Local:   http://localhost:3000/
#   ➜  press h to show help
```

**Port:** 3000 (configured in package.json)  
**Hot reload:** Enabled (changes visible instantly)  
**HTTPS:** Not required for localhost

### Build for Testing
```bash
npm run build
# Output: dist/ folder with optimized files

npm run preview
# Output: Preview at http://localhost:4173/
```

### Linting & Type Checking
```bash
npm run lint
# Runs: tsc --noEmit (TypeScript strict mode)
# Shows errors without creating .js files
```

### Clean Build
```bash
npm run clean
# Removes dist/ folder
# Use if build cache is corrupted
```

---

## Building for Production

### Build Step
```bash
npm run build
```

**What it does:**
1. Runs TypeScript compiler (strict mode)
2. Bundles React + dependencies (tree-shaking)
3. Minifies JavaScript & CSS
4. Optimizes images
5. Outputs to `dist/` folder

**Output structure:**
```
dist/
├── index.html            (~5 KB)
├── assets/
│   ├── main-[hash].js    (~150 KB gzipped)
│   ├── main-[hash].css   (~30 KB gzipped)
│   └── [other assets]
└── vite.svg
```

**Performance targets:**
- Bundle size < 500 KB (gzipped)
- Build time < 30 seconds
- No build warnings (only info messages OK)

### Build Optimization Checklist

```bash
# Before deployment
❌ npm run lint          # Fix any TypeScript errors
❌ npm run build         # No build errors/warnings
❌ npm run preview       # Manual smoke test
❌ du -sh dist/          # Check bundle size
❌ git status           # No uncommitted changes
```

---

## Deployment Platforms

### Option 1: Vercel (Recommended)

**Best for:** Automatic deployments, edge functions, analytics  
**Cost:** Free tier available (unlimited projects)  
**Setup time:** ~5 minutes

#### Step 1: Connect Repository
```bash
# Push code to GitHub
git push origin main

# Go to https://vercel.com
# Click "New Project"
# Select GitHub repo "hom-nay-an-gi"
# Click Import
```

#### Step 2: Configure Environment Variables
```
In Vercel Dashboard:
  Settings → Environment Variables
  
Add:
  GEMINI_API_KEY=<your-key>
  VITE_GOOGLE_CLIENT_ID=<your-client-id>

Select:
  Production, Preview, Development (all checked)
```

#### Step 3: Deploy
```
Vercel auto-detects:
  Build command: npm run build
  Output directory: dist
  
Click "Deploy"
```

**Result:**
- Live at `hom-nay-an-gi.vercel.app` (auto-generated)
- Custom domain: Settings → Domains → Add custom domain

#### Continuous Deployment
```
Pushes to main → Auto-deploy to production
Pushes to other branches → Preview URLs (staging)
PRs → Automated preview environments
```

#### Vercel-Specific Features
```
Analytics:
  Insights → Web Vitals (FCP, LCP, CLS, FID)
  
Performance:
  Analytics → Response time per endpoint
  
Environment:
  Settings → Environment Variables (per stage)
  
Logs:
  Deployments → Logs (build & runtime errors)
```

---

### Option 2: Netlify

**Best for:** Simple SPA hosting, forms, analytics  
**Cost:** Free tier available (100 GB/month)  
**Setup time:** ~5 minutes

#### Step 1: Connect Repository
```bash
# Go to https://app.netlify.com
# Click "New site from Git"
# Select GitHub repo "hom-nay-an-gi"
```

#### Step 2: Configure Build
```
Netlify auto-detects:
  Build command: npm run build
  Publish directory: dist
  
No changes needed (uses package.json)
```

#### Step 3: Set Environment Variables
```
In Netlify Dashboard:
  Site settings → Environment → Variables
  
Add:
  GEMINI_API_KEY=<your-key>
  VITE_GOOGLE_CLIENT_ID=<your-client-id>
```

#### Step 4: Deploy
```
Netlify auto-deploys on git push
  Main branch → Production
  Other branches → Preview
```

**Result:**
- Live at `hom-nay-an-gi.netlify.app`
- Custom domain: Domain settings → Custom domains

---

### Option 3: Static Hosting (Manual)

**Best for:** Maximum control, custom CI/CD  
**Platforms:** AWS S3 + CloudFront, Render, GitHub Pages  
**Setup time:** ~20 minutes

#### Example: AWS S3 + CloudFront

##### Step 1: Build Locally
```bash
npm run build
# Creates dist/ folder
```

##### Step 2: Upload to S3
```bash
# Create S3 bucket
aws s3 mb s3://hom-nay-an-gi

# Upload dist/ contents
aws s3 sync dist/ s3://hom-nay-an-gi/ \
  --delete \
  --cache-control "public, max-age=3600"

# Set index.html cache-control
aws s3 cp dist/index.html s3://hom-nay-an-gi/ \
  --cache-control "public, max-age=0, must-revalidate" \
  --content-type "text/html"
```

##### Step 3: CloudFront Distribution
```bash
# Create CloudFront distribution
# Origin: hom-nay-an-gi.s3.amazonaws.com
# Default root object: index.html

# Configure caching:
#   HTML: 0 seconds (always revalidate)
#   JS/CSS: 86400 seconds (1 day)
#   Images: 31536000 seconds (1 year)
```

##### Step 4: Setup Custom Domain
```bash
# Route 53 → Create A record → CloudFront distribution
# Domain: hom-nay-an-gi.com → CloudFront endpoint
```

---

## Post-Deployment Verification

### Health Checks

```bash
# 1. Verify deployment is live
curl https://hom-nay-an-gi.vercel.app
# Should return 200 OK

# 2. Check app loads
# Open https://hom-nay-an-gi.vercel.app in browser
# Should see app UI within 2 seconds

# 3. Test features
## Random suggest
  - Click "Ngẫu nhiên" button
  - Should spin and show dish
  
## AI suggest
  - Click "AI Gợi ý" button
  - Should call Gemini API
  - Should show suggestion or fallback

## Shopee Food
  - Click "Shopee Food" button
  - Should open Shopee Food search in new tab

## Google Calendar (if OAuth set up)
  - Click "Ghi vào lịch" button
  - Should redirect to Google login
```

### Browser Compatibility

Test on:
- ✓ Chrome (latest 2 versions)
- ✓ Safari (latest 2 versions)
- ✓ Firefox (latest 2 versions)
- ✓ Edge (latest 2 versions)
- ✓ Mobile Safari (iOS 14+)
- ✓ Chrome Mobile (Android 8+)

### Performance Checks

```bash
# Lighthouse score (via Chrome DevTools)
#   Performance: ≥ 80
#   Accessibility: ≥ 90
#   Best Practices: ≥ 90
#   SEO: ≥ 90

# Bundle size
#   Total: < 500 KB (gzipped)
#   JS: < 150 KB (gzipped)
#   CSS: < 50 KB (gzipped)

# First Contentful Paint
#   Target: < 2 seconds
#   Test: Lighthouse, WebPageTest
```

---

## Rollback & Recovery

### Vercel Rollback
```bash
# In Vercel Dashboard:
#   Deployments → Select previous deployment
#   Click "Promote to Production"
#
# Or via CLI:
vercel rollback
```

### Netlify Rollback
```bash
# In Netlify Dashboard:
#   Deploys → Select previous deploy
#   Click "Publish Deploy"
```

### Manual Rollback
```bash
# If using S3 + CloudFront:

# Get previous build from git
git checkout <previous-commit>

# Rebuild
npm run build

# Re-upload to S3
aws s3 sync dist/ s3://hom-nay-an-gi/ --delete
```

---

## Monitoring & Debugging

### Error Tracking (Recommended)

Setup Sentry for production errors:

```bash
npm install @sentry/react @sentry/tracing

# In main.tsx:
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://key@sentry.io/project",
  environment: "production",
  tracesSampleRate: 0.1,
});

export default Sentry.withProfiler(App);
```

### Analytics (Recommended)

Setup Google Analytics:

```bash
npm install @react-google-analytics

# Track:
#   Random suggestions (event: "randomize")
#   AI suggestions (event: "ai_suggest")
#   Shopee Food clicks (event: "shopee_click")
#   Calendar logs (event: "calendar_log")
#   Share events (event: "share")
```

### Logs

**Vercel:**
- Dashboard → Deployments → Logs → Function Logs
- Shows build errors & runtime errors
- Search by timestamp or error message

**Netlify:**
- Dashboard → Deploys → Deploy Log
- Shows build output & deployment errors

**Browser Console:**
- Open DevTools (F12)
- Console tab shows any JavaScript errors
- Network tab shows API failures

---

## API Key Security Best Practices

### Development
```bash
# 1. Create .env.local (git-ignored)
echo ".env.local" >> .gitignore

# 2. Store keys locally
GEMINI_API_KEY=<dev-key>
VITE_GOOGLE_CLIENT_ID=<dev-client>

# 3. Never commit secrets
git add .
git commit -m "..."  # .env.local automatically ignored
```

### Production

**Gemini API Key:**
```bash
# 1. Restrict by HTTP referrer
#    Google Cloud Console → APIs & Services → Credentials
#    Edit API key → Application restrictions
#    Websites: https://hom-nay-an-gi.com/*

# 2. Monitor usage
#    Google Cloud Console → Billing → Budget alerts
#    Set alert at $50/month (prevents runaway costs)

# 3. Rotate keys periodically
#    Generate new key → Update in Vercel/Netlify
#    Delete old key after verification
```

**Google OAuth Client ID:**
```bash
# 1. Restrict redirect URIs
#    Google Cloud Console → APIs & Services → OAuth consent screen
#    Authorized redirect URIs:
#      - https://hom-nay-an-gi.com
#      - https://hom-nay-an-gi.vercel.app (if using Vercel)

# 2. Monitor usage
#    Google Cloud Console → APIs & Services → Quotas
#    Set quotas to prevent abuse

# 3. Test with multiple origins
#    Ensure localhost, staging, and production all work
```

### Incident Response

```bash
# If key is compromised:

# 1. Immediately revoke key in Google Cloud Console
#    Credentials → Delete key

# 2. Generate new key
#    APIs & Services → Credentials → Create API Key

# 3. Update in Vercel/Netlify
#    Settings → Environment Variables → Update

# 4. Monitor for unauthorized usage
#    Google Cloud Console → Billing → View all billing data
#    Check for sudden spikes

# 5. Notify users if necessary
#    If data was accessed, follow GDPR/privacy laws
```

---

## Troubleshooting

### Common Deployment Issues

#### Build Fails with TypeScript Errors
```bash
# Error: "src/App.tsx:45: Property 'selectedDish' does not exist"

# Fix:
npm run lint  # See exact errors
# Fix TypeScript issues in source files
npm run build  # Retry
```

#### App Loads But Features Don't Work

**Symptom:** Random suggest doesn't show results  
**Cause:** Filter pool is empty  
**Fix:** Check activeTab, budget, dietaryPrefs filters

**Symptom:** AI suggest shows fallback always  
**Cause:** GEMINI_API_KEY not set or invalid  
**Fix:** 
```bash
# Verify env var in Vercel/Netlify dashboard
# Restart deployment
# Check browser console for exact error
```

**Symptom:** Calendar button does nothing  
**Cause:** VITE_GOOGLE_CLIENT_ID not set or invalid  
**Fix:**
```bash
# Verify OAuth client ID in Google Cloud Console
# Ensure redirect URI includes your domain
# Check browser console for OAuth error
```

#### Performance Issues

**Slow page load:**
```bash
npm run build
npm run preview

# Check bundle size
du -sh dist/assets/

# If > 200 KB JS, analyze with:
npm install --save-dev webpack-bundle-analyzer

# Update vite.config.ts to include analyzer plugin
```

**High API latency:**
```bash
# Gemini API slow (2–5s response)
#   Expected: API calls are slow
#   Mitigation: Show loading spinner, set timeout 10s

# Geolocation slow (5–8s response)
#   Expected: Browser permission dialog
#   Mitigation: Show timeout message, use saved preference
```

### Debug Mode

```bash
# Add to App.tsx for debugging:
if (import.meta.env.MODE === "development") {
  console.log("basePool:", basePool);
  console.log("selectedDish:", selectedDish);
  console.log("mealHistory:", mealHistory);
}

# Or use browser localStorage:
localStorage.setItem("DEBUG", "true");

# Then in code:
if (localStorage.getItem("DEBUG")) {
  console.log("Debug info:", ...);
}
```

---

## Scaling & Future Deployment

### Phase 3+ Considerations

**When adding backend (vote sessions, group features):**
```bash
# Current: Pure client-side SPA
# Phase 3: Need simple backend for voting

# Option 1: Firebase (recommended for MVP)
#   - Realtime Database (vote counts)
#   - Cloud Functions (vote validation)
#   - No ops required

# Option 2: Custom Node.js backend
#   - Express API server
#   - PostgreSQL for persistence
#   - Deploy to Heroku, Railway, or Render
#   - Use Vercel Serverless Functions
```

### Multi-Environment Strategy

```
Development
  │
  └─ npm run dev (localhost:3000)

Staging
  │
  └─ Preview deployments (Vercel/Netlify branch previews)

Production
  │
  └─ Main branch auto-deploy (vercel.app)
```

---

## Support & Resources

### Official Documentation
- [Vite Guide](https://vitejs.dev/guide/) — Build tool
- [React 19 Docs](https://react.dev) — Framework
- [Tailwind CSS](https://tailwindcss.com/docs) — Styling
- [Google Gemini API](https://ai.google.dev/docs) — AI suggestions
- [Google Calendar API](https://developers.google.com/calendar) — Event creation

### Deployment Platforms
- [Vercel Docs](https://vercel.com/docs) — Recommended
- [Netlify Docs](https://docs.netlify.com) — Alternative
- [AWS S3 Hosting](https://docs.aws.amazon.com/s3/) — Advanced

### Community
- GitHub Issues for bug reports
- GitHub Discussions for feature requests
- Stack Overflow (tag: reactjs, typescript)

---

## Checklist: Pre-Launch

Before deploying to production:

```
Setup
  ☐ Node.js 18+ installed
  ☐ npm 9+ installed
  ☐ Repository cloned locally
  ☐ .env.local created with test keys
  ☐ npm install runs without errors

Development
  ☐ npm run dev works
  ☐ All features testable locally
  ☐ No console errors
  ☐ npm run lint passes

Production Build
  ☐ npm run build completes
  ☐ No TypeScript errors
  ☐ dist/ folder created
  ☐ Bundle size < 500 KB

API Keys
  ☐ GEMINI_API_KEY obtained & tested
  ☐ VITE_GOOGLE_CLIENT_ID obtained & tested
  ☐ API key restricted by HTTP referrer
  ☐ OAuth redirect URIs configured

Platform Setup
  ☐ Vercel/Netlify account created
  ☐ Repository connected
  ☐ Build settings configured
  ☐ Environment variables set

Testing
  ☐ Random suggest works
  ☐ AI suggest works
  ☐ Filters work
  ☐ Shopee Food link opens
  ☐ Google Maps link opens
  ☐ Calendar log works (if OAuth set up)
  ☐ Mobile responsive
  ☐ All browsers tested

Launch
  ☐ Domain set up (if custom domain)
  ☐ SSL/TLS enabled (auto on Vercel/Netlify)
  ☐ Monitoring set up (optional: Sentry, Analytics)
  ☐ Rollback procedure documented
  ☐ Stakeholders notified
  ☐ Deploy to production
```

---

## After Deployment

### Day 1 (Launch)
- ✓ Monitor error logs
- ✓ Check analytics (if set up)
- ✓ Gather user feedback
- ✓ Be ready to rollback if needed

### Week 1
- ✓ Review performance metrics
- ✓ Fix any critical bugs
- ✓ Document any issues encountered

### Monthly
- ✓ Update dependencies (npm update)
- ✓ Review logs for patterns
- ✓ Plan next feature iteration

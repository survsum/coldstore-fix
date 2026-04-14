# 🚀 Cold Dog — Vercel Deployment Guide

## Step 1: Get a Free PostgreSQL Database (Neon)

1. Go to **neon.tech** → Sign up free
2. Create a new project → "cold-dog-prod"
3. Copy both connection strings:
   - **DATABASE_URL** — Pooled connection (starts with `postgresql://...pgbouncer=true`)
   - **DIRECT_URL** — Direct connection (no pgbouncer param)

## Step 2: Get Free Image Hosting (Cloudinary)

1. Go to **cloudinary.com** → Sign up free (25GB storage)
2. Go to **Settings → Upload → Upload Presets**
3. Click "Add upload preset" → Set **Signing Mode: Unsigned**
4. Copy your:
   - **Cloud Name** (shown on dashboard)
   - **Upload Preset Name**

## Step 3: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/cold-dog.git
git push -u origin main
```

## Step 4: Deploy on Vercel

1. Go to **vercel.com** → New Project → Import your GitHub repo
2. Framework: **Next.js** (auto-detected)
3. Click **Environment Variables** and add ALL of these:

```
DATABASE_URL          = your_neon_pooled_url
DIRECT_URL            = your_neon_direct_url
ADMIN_EMAIL           = admin@store.com
ADMIN_PASSWORD        = your_secure_password
ADMIN_SESSION_SECRET  = (generate: openssl rand -hex 32)
USER_JWT_SECRET       = (generate: openssl rand -hex 32)
NEXTAUTH_SECRET       = (generate: openssl rand -hex 32)
NEXTAUTH_URL          = https://your-project.vercel.app
RAZORPAY_KEY_ID       = rzp_live_your_key
RAZORPAY_KEY_SECRET   = your_razorpay_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID = rzp_live_your_key
CLOUDINARY_CLOUD_NAME = your_cloud_name
CLOUDINARY_UPLOAD_PRESET = your_unsigned_preset
SMTP_HOST             = smtp.gmail.com
SMTP_PORT             = 587
SMTP_USER             = your@gmail.com
SMTP_PASS             = your_gmail_app_password
SMTP_FROM             = Cold Dog <your@gmail.com>
```

4. Click **Deploy**

## Step 5: Seed the Database

After first deploy, run locally with production DATABASE_URL:

```bash
# Replace with your actual Neon DIRECT_URL
DATABASE_URL="postgresql://..." npm run db:push
DATABASE_URL="postgresql://..." npm run db:seed
```

Or use Neon's SQL editor to run seed manually.

## Step 6: Update Razorpay Webhook URL

In Razorpay Dashboard → Webhooks → Add:
```
https://your-project.vercel.app/api/razorpay/verify
```

---

## Common Errors & Fixes

| Error | Fix |
|-------|-----|
| `PrismaClientInitializationError` | Check DATABASE_URL is set in Vercel env vars |
| `Can't reach database server` | Use Neon's pooled URL (has `?pgbouncer=true`) |
| `Environment variable not found: DATABASE_URL` | Add to Vercel env vars AND redeploy |
| `Upload failed` | Add CLOUDINARY_CLOUD_NAME + CLOUDINARY_UPLOAD_PRESET to Vercel |
| `NEXTAUTH_URL` warning | Set to your actual Vercel URL |
| Hydration error | Already fixed in latest code |

## Generate Random Secrets (run in terminal)
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

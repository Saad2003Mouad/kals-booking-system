# Boston Legend Ice Cream Truck - Booking System

A full-stack, enterprise-grade booking and management system for Boston Legend Ice Cream Truck. Built with Next.js 14, Prisma, PostgreSQL (Supabase), and NextAuth.

## Features
- **Customer Booking Flow**: Seamlessly book an ice cream truck with live pricing, address validation, and date availability checking.
- **Admin Dashboard**: Manage vehicles, drivers, packages, and calendar bookings. 
- **Customer Portal**: Manage existing bookings with secure OTP verification.
- **AI Integration**: AI-powered customer service and internal task management.
- **Secure Infrastructure**: OTP rate-limiting, secure NextAuth implementation, and Supabase RLS.

---

## Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd boston_legend.webflow.io
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env` file in the root directory (see *Environment Variables* section).

4. **Initialize Database**
   ```bash
   npx prisma generate
   npx prisma db push
   # Or run migrations: npx prisma migrate dev
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

---

## Environment Variables

Your `.env` file requires the following keys:

```env
# Database (Supabase)
DATABASE_URL="postgres://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres"
DIRECT_URL="postgres://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_secure_random_string"

# Email Setup (SMTP)
SMTP_HOST="smtp.example.com"
SMTP_PORT=465
SMTP_USER="info@bostonlegendicecreamtruck.com"
SMTP_PASS="your-app-password"

# AI Integrations (Groq / OpenAI)
GROQ_API_KEY="gsk_..."
OPENAI_API_KEY="sk-..."
```

---

## Prisma

The application uses **Prisma ORM** connected to a Supabase PostgreSQL instance.

- **Schema**: Located at `prisma/schema.prisma`
- **Models**: Defines `User`, `Booking`, `Customer`, `Vehicle`, `Package`, etc.
- **Migrations**: Since we use Supabase, we connect directly via `DATABASE_URL` as the `postgres` user. 

**Commands:**
- `npm run build` will automatically run `prisma generate`.
- To open Prisma Studio: `npx prisma studio`

---

## Supabase & RLS (Row Level Security)

We utilize Supabase for the PostgreSQL database.
**Note on `rls_disabled_in_public` warning:**
Because Prisma accesses the database using the `postgres` Service Role connection string (`DATABASE_URL`), it naturally bypasses Row Level Security (RLS). 
However, to maintain defense-in-depth and satisfy Supabase's security recommendations:
1. We have provided a script: `supabase-rls-setup.sql` in the project root.
2. **Action Required**: Copy the contents of this file and run it in your Supabase SQL Editor. It will enable RLS across all tables and deny public/anon access, securing your data even if anonymous API keys are leaked.

---

## Email Setup

We use **Nodemailer** for transactional emails (Booking Confirmations, OTPs, Review Requests).
- Ensure your SMTP Provider (e.g., Google Workspace, SendGrid) supports secure connections.
- If using Gmail/Google Workspace, you **must use an App Password**, not your account password.
- Configuration is handled in `src/lib/email.ts` or inline in the API routes.

---

## OTP System

The application uses a robust, database-backed OTP (One-Time Password) system for verification.
- **Flows**: Customer Booking Verification, Manage Booking Login.
- **Security**: 
  - Cryptographically secure generation (`crypto.randomInt`).
  - Brute-force protection: Blocks IP/Email for 15 minutes after 5 failed attempts.
  - 60-second cooldown between resend requests.
  - Expiration after `OTP_TTL` minutes.

---

## AI Integrations

The platform uses AI (Groq / OpenAI via `@ai-sdk`) for:
- Chatbots answering customer inquiries.
- Generating automated tasks for admins from inquiry data.

---

## Booking Flow

1. Customer selects a package via `/packages`.
2. Fills out event details (Date, Time, Location, Guests).
3. System verifies OTP (`/api/otp/send` -> `/api/otp/verify`).
4. Creates a `Booking` and associated `Customer` record.
5. Sends Confirmation Email via Nodemailer.

---

## Admin Flow

- **Login**: Accessed at `/login`. Uses `NextAuth` Credentials provider.
- **Security**: Hardened with rate limiting (max 5 failed attempts per 15 mins).
- **Dashboard**: `/admin` — Protected by server-side session checks and robust RBAC via `requirePermission()`.

---

## Cron Jobs

Scheduled tasks (e.g., sending review requests after an event, or pre-event reminders) should be configured to hit the secure `/api/cron/*` endpoints using a service like Vercel Cron.
- Review Requests: `/api/cron/review-requests`
- Reminders: `/api/cron/reminders`

---

## Deployment on Vercel

1. Push your code to GitHub.
2. Import the project in Vercel.
3. Add all **Environment Variables** in the Vercel dashboard.
4. Vercel will automatically run `npm run build` which triggers `prisma generate`.

---

## Troubleshooting

- **Next.js Build Errors**: Ensure `node_modules` is up to date and you have the correct `.env` files. Try deleting `.next` and `node_modules` and re-running `npm install`.
- **Emails Not Sending**: Check `SMTP_USER` and `SMTP_PASS`. Look at server logs for `[SMTP ERROR]`. If using Google, ensure 2FA is on and use an App Password.
- **Prisma Connection Issues**: Verify your IP isn't blocked by Supabase, or ensure you're using the Transaction pooling URL (port 6543) if deploying to a serverless environment like Vercel.

# Scaler Scheduler

A Calendly-style scheduling platform built with Next.js App Router, Tailwind CSS, shadcn-style UI components, Prisma, Neon PostgreSQL, React Hook Form, Zod, and Nodemailer.

## Stack

- Next.js 15 App Router
- Tailwind CSS
- shadcn-style component structure
- Prisma ORM
- Neon PostgreSQL
- React Hook Form + Zod
- date-fns + date-fns-tz
- Nodemailer email delivery

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and set:

- `DATABASE_URL`
- `DIRECT_URL`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `NEXT_PUBLIC_APP_URL`
- `APP_OWNER_EMAIL`

3. Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. Seed the default host, event type, and weekly schedule:

```bash
npm run prisma:seed
```

5. Start the app:

```bash
npm run dev
```

## Neon Notes

- Create a Neon project and copy the pooled connection string into `DATABASE_URL`.
- Copy the direct connection string into `DIRECT_URL`.
- Keep `sslmode=require` enabled for both.

## Email Notes

- Configure any SMTP provider that works with Nodemailer.
- Common options include Gmail app passwords, Zoho Mail, Mailgun SMTP, SendGrid SMTP, or your hosting provider's SMTP relay.
- Set `SMTP_SECURE=true` for port `465`; use `false` for port `587`.
- Use a verified sender in `SMTP_FROM` before production.

## Current Feature Coverage

- Dashboard overview
- Event types listing and creation
- Weekly availability editor
- Public booking page
- Slot generation with timezone math, buffers, and booking conflict checks
- Transactional booking creation API
- Booking confirmation page
- Basic booking confirmation and cancellation emails

## Next Build Steps

- Add edit and delete flows for event types
- Add date-specific override management UI
- Add upcoming/past tabs, meeting detail views, and cancel/reschedule actions
- Add authentication provider for multi-user dashboard access
- Add polished toast notifications and loading skeletons
- Add richer Resend React email templates
- Add richer HTML email templates and transport health checks

## Deploying to Vercel

1. Push the project to GitHub.
2. Import into Vercel.
3. Add the same environment variables from `.env`.
4. Run Prisma migrations against Neon:

```bash
npx prisma migrate deploy
```

5. Set build command to:

```bash
npm run build
```

6. Set install command to:

```bash
npm install
```

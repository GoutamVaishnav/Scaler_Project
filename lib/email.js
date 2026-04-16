import nodemailer from "nodemailer";
import { formatDateTimeRange } from "@/lib/dates";

const smtpConfigured =
  process.env.SMTP_HOST &&
  process.env.SMTP_PORT &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASS &&
  process.env.SMTP_FROM;

const transporter = smtpConfigured
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })
  : null;

function buildShell({ title, subtitle, body }) {
  return `
    <div style="background:#f8fafc;padding:32px;font-family:Arial,sans-serif;">
      <div style="max-width:620px;margin:0 auto;background:#ffffff;border-radius:18px;padding:32px;border:1px solid #e2e8f0;">
        <p style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#64748b;margin:0 0 12px;">Scaler Scheduler</p>
        <h1 style="font-size:24px;color:#0f172a;margin:0 0 8px;">${title}</h1>
        <p style="font-size:15px;line-height:1.6;color:#475569;margin:0 0 24px;">${subtitle}</p>
        ${body}
      </div>
    </div>
  `;
}

export async function sendBookingEmail({ to, booking, eventType, hostTimezone }) {
  if (!transporter) {
    return;
  }

  const timeRange = formatDateTimeRange(booking.startTimeUtc, booking.endTimeUtc, booking.inviteeTimezone);

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: `Booking confirmed: ${eventType.name}`,
    html: buildShell({
      title: "Your meeting is confirmed",
      subtitle: `You are booked with ${eventType.user?.name || "your host"}.`,
      body: `
        <p style="font-size:16px;color:#0f172a;"><strong>${eventType.name}</strong></p>
        <p style="font-size:14px;color:#475569;line-height:1.7;">${timeRange}</p>
        <p style="font-size:14px;color:#475569;line-height:1.7;">Host timezone: ${hostTimezone}</p>
      `
    })
  });
}

export async function sendCancellationEmail({ to, booking, eventType }) {
  if (!transporter) {
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: `Meeting canceled: ${eventType.name}`,
    html: buildShell({
      title: "Your meeting was canceled",
      subtitle: `The ${eventType.name} booking is no longer scheduled.`,
      body: `<p style="font-size:14px;color:#475569;line-height:1.7;">Canceled booking for ${booking.inviteeName}.</p>`
    })
  });
}

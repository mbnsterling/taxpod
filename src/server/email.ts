import nodemailer from "nodemailer";
import { env } from "~/env";

const smtpHost = env.SMTP_HOST;
const smtpPort = env.SMTP_PORT ? Number(env.SMTP_PORT) : undefined;
const smtpUser = env.SMTP_USER;
const smtpPass = env.SMTP_PASS;
const smtpFrom = env.SMTP_FROM ?? "no-reply@taxpod.ng";

if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
  // In dev we allow missing SMTP and simply log instead of throwing on import.
  // Individual send functions will fallback to console logging when transporter cannot be created.
  console.warn(
    "[email] SMTP configuration is incomplete. Emails will be logged to console.",
  );
}

function createTransport() {
  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    return null;
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

type SendEmailOptions = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail(options: SendEmailOptions) {
  const transporter = createTransport();

  if (!transporter) {
    console.info("[email] Would send email:", {
      from: smtpFrom,
      ...options,
    });
    return;
  }

  await transporter.sendMail({
    from: smtpFrom,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
}

export function buildVerificationEmail(options: {
  verifyUrl: string;
  userEmail: string;
}) {
  const { verifyUrl, userEmail } = options;

  const subject = "Verify your TaxPod email";

  const html = `
  <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f3f4f6; padding: 32px;">
    <div style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 20px; padding: 32px; border: 1px solid #e5e7eb; box-shadow: 0 18px 45px rgba(15,23,42,0.08);">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-flex; align-items: center; justify-content: center; gap: 10px;">
          <div style="display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, #22c55e, #0f766e); color: #ffffff; font-weight: 800; font-size: 20px; box-shadow: 0 12px 30px rgba(16,185,129,0.4);">
            T
          </div>
          <div style="text-align: left;">
            <div style="font-size: 20px; font-weight: 800; letter-spacing: -0.03em; color: #0f172a;">
              TaxPod
            </div>
            <div style="margin-top: 2px; font-size: 10px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #10b981;">
              Nigeria
            </div>
          </div>
        </div>
      </div>
      <h1 style="font-size: 22px; line-height: 1.35; font-weight: 700; color: #111827; margin: 0 0 8px;">Confirm your email address</h1>
      <p style="margin: 0 0 16px; color: #4b5563; font-size: 14px;">
        Hi ${userEmail},<br/>
        Tap the button below to verify your email and activate your secure TaxPod account.
      </p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${verifyUrl}" style="display: inline-block; padding: 10px 22px; border-radius: 999px; background: linear-gradient(135deg, #22c55e, #16a34a); color: #ecfdf5; font-weight: 600; font-size: 14px; text-decoration: none; box-shadow: 0 18px 40px rgba(16,185,129,0.35);">
          Verify email
        </a>
      </div>
      <p style="margin: 0 0 8px; color: #6b7280; font-size: 12px;">
        Or copy and paste this link into your browser:
      </p>
      <p style="margin: 0 0 16px; color: #9ca3af; font-size: 11px; word-break: break-all;">
        ${verifyUrl}
      </p>
      <p style="margin: 0; color: #9ca3af; font-size: 11px;">
        This link will expire soon for your security. If you didn&apos;t create a TaxPod account, you can safely ignore this email.
      </p>
    </div>
    <p style="margin-top: 16px; text-align: center; color: #9ca3af; font-size: 11px;">
      Built for Nigerian tax compliance. &copy; ${new Date().getFullYear()} TaxPod.
    </p>
  </div>
  `;

  return { subject, html };
}

export function buildResetPasswordEmail(options: {
  resetUrl: string;
  userEmail: string;
}) {
  const { resetUrl, userEmail } = options;

  const subject = "Reset your TaxPod password";

  const html = `
  <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f3f4f6; padding: 32px;">
    <div style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 20px; padding: 32px; border: 1px solid #e5e7eb; box-shadow: 0 18px 45px rgba(15,23,42,0.08);">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-flex; align-items: center; justify-content: center; gap: 10px;">
          <div style="display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, #22c55e, #0f766e); color: #ffffff; font-weight: 800; font-size: 20px; box-shadow: 0 12px 30px rgba(16,185,129,0.4);">
            T
          </div>
          <div style="text-align: left;">
            <div style="font-size: 20px; font-weight: 800; letter-spacing: -0.03em; color: #0f172a;">
              TaxPod
            </div>
            <div style="margin-top: 2px; font-size: 10px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #10b981;">
              Nigeria
            </div>
          </div>
        </div>
      </div>
      <h1 style="font-size: 22px; line-height: 1.35; font-weight: 700; color: #111827; margin: 0 0 8px;">Reset your password</h1>
      <p style="margin: 0 0 16px; color: #4b5563; font-size: 14px;">
        We received a request to reset the password for the account associated with ${userEmail}.
      </p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 22px; border-radius: 999px; background: linear-gradient(135deg, #0ea5e9, #22c55e); color: #ecfdf5; font-weight: 600; font-size: 14px; text-decoration: none; box-shadow: 0 18px 40px rgba(59,130,246,0.4);">
          Choose a new password
        </a>
      </div>
      <p style="margin: 0 0 8px; color: #6b7280; font-size: 12px;">
        Or copy and paste this link into your browser:
      </p>
      <p style="margin: 0 0 16px; color: #9ca3af; font-size: 11px; word-break: break-all;">
        ${resetUrl}
      </p>
      <p style="margin: 0; color: #9ca3af; font-size: 11px;">
        This link will expire shortly for your security. If you didn&apos;t request a password reset, you can safely ignore this email.
      </p>
    </div>
    <p style="margin-top: 16px; text-align: center; color: #9ca3af; font-size: 11px;">
      Built for Nigerian tax compliance. &copy; ${new Date().getFullYear()} TaxPod.
    </p>
  </div>
  `;

  return { subject, html };
}

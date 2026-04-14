import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

export async function sendOTPEmail(email: string, otp: string, name?: string) {
  const isConfigured =
    process.env.SMTP_USER &&
    process.env.SMTP_USER !== 'your_email@gmail.com';

  // Dev mode — just log to terminal
  if (!isConfigured) {
    console.log('\n' + '─'.repeat(40));
    console.log(`📧  OTP for ${email}`);
    console.log(`🔑  Code: ${otp}`);
    console.log('─'.repeat(40) + '\n');
    return { success: true, dev: true };
  }

  try {
    await getTransporter().sendMail({
      from: process.env.SMTP_FROM || `Cold Dog <${process.env.SMTP_USER}>`,
      to: email,
      subject: `${otp} — your Cold Dog sign-in code`,
      html: `
        <div style="font-family:-apple-system,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0d1117;color:#e6edf3;border-radius:16px;">
          <h2 style="margin:0 0 24px;font-size:20px;font-weight:700;letter-spacing:-0.02em;">
            🐾 Cold Dog — Sign In
          </h2>
          <p style="color:#8b949e;font-size:14px;margin-bottom:8px;">
            Hi ${name || 'there'}, here's your one-time code:
          </p>
          <div style="background:#161b22;border:1px solid #30363d;border-radius:12px;padding:24px;text-align:center;margin:20px 0;">
            <span style="font-size:36px;font-weight:800;letter-spacing:0.18em;color:#e63030;font-family:monospace;">${otp}</span>
          </div>
          <p style="color:#6e7681;font-size:12px;text-align:center;">
            Expires in <strong>5 minutes</strong> · Single use only
          </p>
          <p style="color:#484f58;font-size:11px;text-align:center;margin-top:24px;">
            If you didn't request this, ignore this email.
          </p>
        </div>
      `,
    });
    return { success: true };
  } catch (err: any) {
    console.error('Email error:', err.message);
    // Fallback: log to terminal
    console.log(`\n🔑 OTP for ${email}: ${otp}\n`);
    return { success: false };
  }
}

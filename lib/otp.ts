import { prisma } from './prisma';

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createOTP(email: string, purpose = 'login') {
  // Invalidate old unused OTPs for this email
  await prisma.oTP.updateMany({
    where: { email, used: false, purpose },
    data: { used: true },
  });

  const code = generateOTP();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

  await prisma.oTP.create({ data: { email, code, purpose, expiresAt } });
  return { code };
}

export async function verifyOTP(
  email: string,
  code: string,
  purpose = 'login'
): Promise<{ valid: boolean; reason?: string }> {
  const otp = await prisma.oTP.findFirst({
    where: {
      email,
      code,
      purpose,
      used: false,
      expiresAt: { gt: new Date() },
    },
  });

  if (!otp) return { valid: false, reason: 'Invalid or expired code' };

  await prisma.oTP.update({ where: { id: otp.id }, data: { used: true } });
  return { valid: true };
}

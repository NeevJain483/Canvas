import crypto from "crypto";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASS,
  },
});

export async function mailVerificationCode(
  { to }: { to: string },
  code: number,
) {
  const mailOptions = {
    from: `"Drawing app" <${process.env.EMAIL_ID}>`,
    to,
    subject: "Your Verification Code",
    text: `Your verification code is ${code}. It will expire in 20 minutes`,
  };

  return await transporter.sendMail(mailOptions);
}

export function generateVerificationCode(length = 6): number {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return crypto.randomInt(min, max + 1);
}

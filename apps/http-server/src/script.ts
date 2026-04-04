import crypto from "crypto";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

export async function mailVerificationCode({to}:{to:string}, code: number) {
  const email_id = process.env.EMAIL_ID;
  const email_password = process.env.EMAIL_PASS;

  const mailOptions = {
          from: `"Draawing app" <${process.env.EMAIL_ID}>`,
          to,
          subject: "Your Verification Code",
          text: `Your verification code is ${code}. It will expire in 20 minute`,
        };

  const transponder = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: email_id,
      pass: email_password,
    },
  });

  return await transponder.sendMail(mailOptions)
}

export function generateVerificationCode(length = 6): number {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return crypto.randomInt(min, max + 1);
}

import nodemailer from "nodemailer";

const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_EMAIL = process.env.FROM_EMAIL;

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export async function sendEmail(opts: {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
}) {
  const recipients = Array.isArray(opts.to) ? opts.to.join(",") : opts.to;

  const mailOptions = {
    from: FROM_EMAIL,
    to: recipients,
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
  };
  return transporter.sendMail(mailOptions);
}

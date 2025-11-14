import crypto from "crypto";
import { Subscriber, ISubscriber } from "../models/subscriber.model";
import { sendEmail } from "../utils/email";

const CONFIRM_REQUIRED = false;
const TOKEN_TTL_HOURS = 48;
const BASE = process.env.BASE_URL;

function makeToken(len = 32) {
  return crypto.randomBytes(len).toString("hex");
}

export async function subscribeEmail(email: string, name?: string) {
  const normalized = String(email).trim().toLowerCase();

  let existing = await Subscriber.findOne({ email: normalized }).exec();

  if (existing && existing.status === "unsubscribed") {
    existing.status = CONFIRM_REQUIRED ? "pending" : "subscribed";
    existing.name = name ?? existing.name;
    existing.unsubToken = existing.unsubToken ?? makeToken(12);

    if (CONFIRM_REQUIRED) {
      existing.confirmToken = makeToken();
      existing.confirmExpiresAt = new Date(Date.now() + TOKEN_TTL_HOURS * 3600 * 1000);
    } else {
      existing.confirmToken = null;
      existing.confirmExpiresAt = null;
    }

    await existing.save();
  }

  if (!existing) {
    const doc: Partial<ISubscriber> = {
      email: normalized,
      name,
      status: CONFIRM_REQUIRED ? "pending" : "subscribed",
      unsubToken: makeToken(12),
    };

    if (CONFIRM_REQUIRED) {
      doc.confirmToken = makeToken();
      doc.confirmExpiresAt = new Date(Date.now() + TOKEN_TTL_HOURS * 3600 * 1000);
    }

    existing = await Subscriber.create(doc);
  }

  if (CONFIRM_REQUIRED) {
    const confirmUrl = `${BASE}/newsletter/confirm?token=${existing.confirmToken}`;

    const html = `
      <p>Hi ${existing.name ?? ""},</p>
      <p>Thanks for subscribing. Please confirm your subscription by clicking the link below:</p>
      <p><a href="${confirmUrl}">Confirm subscription</a></p>
      <p>If you didn't sign up, ignore this email.</p>
    `;
    await sendEmail({
      purpose: "noreply",
      from: process.env.NOREPLY_FROM_EMAIL,
      to: existing.email,
      subject: "Please confirm your subscription",
      html,
    });
  } else {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Newsletter Subscription Confirmation</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: 'Inter', Arial, sans-serif;
            line-height: 1.6;
            color: #241153;
            margin: 0;
            padding: 20px;
            background-color: #e1e5e9;
            min-height: 100vh;
          }

          .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 20px;
            border: 1px solid rgba(0, 208, 160, 0.2);
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          }

          .container {
            background: #ffffff;
            padding: 50px 40px;
            position: relative;
          }

          .container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, #00D0A0 0%, #00b894 50%, #00D0A0 100%);
          }

          .logo {
            text-align: center;
            margin-bottom: 40px;
            position: relative;
          }

          .logo::after {
            content: '';
            position: absolute;
            bottom: -20px;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 2px;
            background: linear-gradient(90deg, transparent, #00D0A0, transparent);
          }

          .logo img {
            max-width: 180px;
            height: auto;
            filter: drop-shadow(0 4px 20px rgba(0, 208, 160, 0.3));
            transition: transform 0.3s ease;
          }

          h1 {
            color: #00D0A0;
            text-align: center;
            margin-bottom: 30px;
            font-size: 28px;
            font-weight: 600;
            text-shadow: 0 2px 10px rgba(0, 208, 160, 0.3);
            letter-spacing: -0.5px;
          }

          .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #241153;
            font-weight: 400;
          }

          .welcome-badge {
            display: inline-block;
            background: linear-gradient(135deg, #00D0A0 0%, #00b894 100%);
            color: #ffffff;
            padding: 12px 24px;
            border-radius: 25px;
            font-size: 16px;
            font-weight: 600;
            margin: 20px 0;
            box-shadow: 0 4px 15px rgba(0, 208, 160, 0.4);
            letter-spacing: 0.3px;
          }

          .content-section {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
            border: 1px solid rgba(0, 208, 160, 0.1);
          }

          p {
            margin-bottom: 16px;
            font-size: 16px;
            color: #241153;
            line-height: 1.7;
          }

          .highlight-text {
            color: #00D0A0;
            font-weight: 500;
          }

          .unsubscribe-section {
            background: #f1f3f4;
            border-radius: 12px;
            padding: 20px;
            margin-top: 30px;
            text-align: center;
            border: 1px solid rgba(0, 208, 160, 0.1);
          }

          .unsubscribe-section p {
            color: #1a0d3f;
          }

          .unsubscribe-link {
            color: #00D0A0;
            text-decoration: none;
            font-weight: 500;
            padding: 8px 16px;
            border-radius: 20px;
            transition: all 0.3s ease;
            border: 1px solid rgba(0, 208, 160, 0.3);
            display: inline-block;
            margin-top: 5px;
          }

          .unsubscribe-link:hover {
            background: rgba(0, 208, 160, 0.1);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 208, 160, 0.2);
          }

          .footer {
            margin-top: 40px;
            padding-top: 25px;
            border-top: 1px solid rgba(0, 208, 160, 0.1);
            font-size: 14px;
            color: #6b7280;
            text-align: center;
            line-height: 1.6;
          }

          .decorative-dots {
            text-align: center;
            margin: 30px 0;
          }

          .dot {
            display: inline-block;
            width: 6px;
            height: 6px;
            background: #00D0A0;
            border-radius: 50%;
            margin: 0 4px;
            opacity: 0.6;
          }

          .dot:nth-child(2) {
            opacity: 0.8;
            transform: scale(1.2);
          }

          .dot:nth-child(3) {
            opacity: 0.4;
          }

          @media (max-width: 600px) {
            body {
              padding: 10px;
            }

            .container {
              padding: 30px 25px;
            }

            h1 {
              font-size: 24px;
            }

            .content-section {
              padding: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="container">
            <div class="logo">
              <img src="https://res.cloudinary.com/dlpbzlmix/image/upload/v1756908514/logo_nygb95.png" alt="Smarti Community" />
            </div>

            <h1>Welcome to Smarti Community!</h1>

            <p class="greeting">Hi <span class="highlight-text">${existing.name ?? "there"}</span>,</p>

            <div class="welcome-badge">
              🎉 Welcome, you are now subscribed to our newsletter!
            </div>

            <div class="content-section">
              <p>Thank you for joining our <span class="highlight-text">Smarti Community</span>! We're excited to have you on board.</p>

              <p>You'll receive our latest updates, insights, exclusive content, and community highlights directly in your inbox. Get ready for:</p>

              <p style="margin-left: 20px;">
                ✨ Weekly educational insights and trends<br>
                🚀 Exclusive community content<br>
                📱 Product updates and announcements
              </p>
            </div>

            <div class="decorative-dots">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>

            <div class="unsubscribe-section">
              <p style="margin-bottom: 12px; font-size: 14px;">Need to step away? No problem!</p>
              <p>If you want to unsubscribe at any time, you can <a href="${BASE}/newsletter/subscription/unsubscribe?token=${existing.unsubToken}" class="unsubscribe-link">click here</a>.</p>
            </div>

            <div class="footer">
              <p>This email was sent to <span class="highlight-text">${existing.email}</span></p>
              <p>You received this because you subscribed to the Smarti Community newsletter.</p>
              <p style="margin-top: 15px; font-size: 12px; opacity: 0.7;">
                © ${new Date().getFullYear()} Smarti Community. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      purpose: "noreply",
      from: process.env.NOREPLY_FROM_EMAIL,
      to: existing.email,
      subject: "Welcome to Smarti Community",
      html,
    });
  }

  return existing;
}

export async function fetchSubscribersCount() {
  return Subscriber.countDocuments({ status: "subscribed" }).exec();
}

export async function confirmSubscription(token: string) {
  const doc = await Subscriber.findOne({ confirmToken: token }).exec();
  if (!doc) return { ok: false, reason: "invalid_token" };

  if (doc.confirmExpiresAt && doc.confirmExpiresAt.getTime() < Date.now()) {
    return { ok: false, reason: "expired_token" };
  }

  doc.status = "subscribed";
  doc.confirmToken = null;
  doc.confirmExpiresAt = null;
  if (!doc.unsubToken) doc.unsubToken = makeToken(12);
  await doc.save();

  // send welcome
  await sendEmail({
    purpose: "noreply",
    from: process.env.NOREPLY_FROM_EMAIL,
    to: doc.email,
    subject: "Subscription confirmed",
    html: `<p>Thanks — your subscription is confirmed.</p><p>Unsubscribe: <a href="${BASE}/newsletter/unsubscribe?token=${doc.unsubToken}">Unsubscribe</a></p>`,
  });

  return { ok: true, subscriber: doc };
}

export async function unsubscribeByToken(token?: string, email?: string) {
  if (token) {
    const doc = await Subscriber.findOne({ unsubToken: token }).exec();
    if (!doc) return { ok: false, reason: "not_found" };
    doc.status = "unsubscribed";
    await doc.save();
    return { ok: true };
  }

  if (email) {
    const normalized = String(email).toLowerCase();
    const doc = await Subscriber.findOne({ email: normalized }).exec();
    if (!doc) return { ok: false, reason: "not_found" };
    doc.status = "unsubscribed";
    await doc.save();
    return { ok: true };
  }

  return { ok: false, reason: "missing_params" };
}

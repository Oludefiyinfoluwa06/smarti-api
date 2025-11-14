import nodemailer from "nodemailer";

const {
  SMTP_HOST,
  SMTP_USER,
  SMTP_PASS,
  NOREPLY_SMTP_USER,
  NOREPLY_SMTP_PASS,
  NEWSLETTER_SMTP_USER,
  NEWSLETTER_SMTP_PASS,
} = process.env;


type Purpose = "noreply" | "newsletter";

function getAuthForPurpose(purpose: Purpose) {
  if (purpose === "newsletter") {
    return {
      user: NEWSLETTER_SMTP_USER || SMTP_USER,
      pass: NEWSLETTER_SMTP_PASS || SMTP_PASS,
    };
  }

  return {
    user: NOREPLY_SMTP_USER || SMTP_USER,
    pass: NOREPLY_SMTP_PASS || SMTP_PASS,
  };
}

const transporterCache = new Map<string, nodemailer.Transporter>();

function createOrGetTransporterForUser(user: string, pass: string) {
  const key = `${user}:${pass}`;
  if (transporterCache.has(key)) return transporterCache.get(key)!;

  if (!SMTP_HOST) {
    throw new Error("Missing required env var: SMTP_HOST");
  }
  if (!user || !pass) {
    throw new Error(
      `Missing SMTP credentials for user. Ensure env vars are set for the requested purpose.`
    );
  }

  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  transporterCache.set(key, transport);
  return transport;
}

function domainOf(email: string) {
  const parts = email.split("@");
  return parts.length === 2 ? parts[1].toLowerCase() : "";
}

export async function sendEmail(opts: {
  from: string;
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  purpose?: Purpose;
}) {
  const purpose: Purpose = opts.purpose || "noreply";

  const { user: authUser, pass: authPass } = getAuthForPurpose(purpose);

  if (!authUser || !authPass) {
    throw new Error(
      `No SMTP credentials available for purpose="${purpose}". ` +
        `Set the corresponding env vars (e.g. NOREPLY_SMTP_USER / NOREPLY_SMTP_PASS or global SMTP_USER / SMTP_PASS).`
    );
  }

  const from = opts.from;
  const fromLower = from.toLowerCase();
  const authUserLower = authUser.toLowerCase();

  const authDomain = domainOf(authUserLower);
  const fromDomain = domainOf(fromLower);

  const fromMatchesAuth =
    fromLower === authUserLower || (authDomain && authDomain === fromDomain);

  if (!fromMatchesAuth) {
    throw new Error(
      `The "from" address ("${opts.from}") is not compatible with the selected SMTP identity ("${authUser}"). ` +
        `Use the SMTP user's email as the from address or use an address with the same domain as the SMTP user.`
    );
  }

  const transporter = createOrGetTransporterForUser(authUser, authPass);

  const recipients = Array.isArray(opts.to) ? opts.to.join(",") : opts.to;

  const mailOptions = {
    from: opts.from,
    to: recipients,
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
  };

  return transporter.sendMail(mailOptions);
}

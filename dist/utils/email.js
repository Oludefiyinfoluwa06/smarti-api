"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const { SMTP_HOST, SMTP_USER, SMTP_PASS, NOREPLY_SMTP_USER, NOREPLY_SMTP_PASS, NEWSLETTER_SMTP_USER, NEWSLETTER_SMTP_PASS, } = process.env;
function getAuthForPurpose(purpose) {
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
const transporterCache = new Map();
function createOrGetTransporterForUser(user, pass) {
    const key = `${user}:${pass}`;
    if (transporterCache.has(key))
        return transporterCache.get(key);
    if (!SMTP_HOST) {
        throw new Error("Missing required env var: SMTP_HOST");
    }
    if (!user || !pass) {
        throw new Error(`Missing SMTP credentials for user. Ensure env vars are set for the requested purpose.`);
    }
    const transport = nodemailer_1.default.createTransport({
        host: SMTP_HOST,
        port: 465,
        secure: true,
        auth: { user, pass },
    });
    transporterCache.set(key, transport);
    return transport;
}
function domainOf(email) {
    const parts = email.split("@");
    return parts.length === 2 ? parts[1].toLowerCase() : "";
}
function sendEmail(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const purpose = opts.purpose || "noreply";
        const { user: authUser, pass: authPass } = getAuthForPurpose(purpose);
        if (!authUser || !authPass) {
            throw new Error(`No SMTP credentials available for purpose="${purpose}". ` +
                `Set the corresponding env vars (e.g. NOREPLY_SMTP_USER / NOREPLY_SMTP_PASS or global SMTP_USER / SMTP_PASS).`);
        }
        const from = opts.from;
        const fromLower = from.toLowerCase();
        const authUserLower = authUser.toLowerCase();
        const authDomain = domainOf(authUserLower);
        const fromDomain = domainOf(fromLower);
        const fromMatchesAuth = fromLower === authUserLower || (authDomain && authDomain === fromDomain);
        if (!fromMatchesAuth) {
            throw new Error(`The "from" address ("${opts.from}") is not compatible with the selected SMTP identity ("${authUser}"). ` +
                `Use the SMTP user's email as the from address or use an address with the same domain as the SMTP user.`);
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
    });
}
//# sourceMappingURL=email.js.map
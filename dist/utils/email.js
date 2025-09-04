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
exports.transporter = void 0;
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_EMAIL = process.env.FROM_EMAIL;
exports.transporter = nodemailer_1.default.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
});
function sendEmail(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const recipients = Array.isArray(opts.to) ? opts.to.join(",") : opts.to;
        const mailOptions = {
            from: FROM_EMAIL,
            to: recipients,
            subject: opts.subject,
            text: opts.text,
            html: opts.html,
        };
        return exports.transporter.sendMail(mailOptions);
    });
}
//# sourceMappingURL=email.js.map
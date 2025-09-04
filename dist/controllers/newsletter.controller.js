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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewsLetters = getNewsLetters;
exports.getNewsLetter = getNewsLetter;
exports.createNewsLetter = createNewsLetter;
exports.updateNewsLetter = updateNewsLetter;
exports.sendNewsLetter = sendNewsLetter;
exports.deleteNewsLetter = deleteNewsLetter;
const mongoose_1 = require("mongoose");
const newsletter_model_1 = require("../models/newsletter.model");
const subscriber_model_1 = require("../models/subscriber.model");
const email_1 = require("../utils/email");
function getNewsLetters(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            const total = yield newsletter_model_1.NewsLetter.countDocuments().exec();
            const newsLetters = yield newsletter_model_1.NewsLetter.find()
                .sort({ updatedAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec();
            const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
            const meta = {
                total,
                page,
                limit,
                totalPages,
                hasPrevPage: page > 1,
                hasNextPage: page < totalPages,
            };
            return res.status(200).json({ data: newsLetters, meta });
        }
        catch (err) {
            return res.status(500).json({ message: err.message || "Error fetching newsletters" });
        }
    });
}
function getNewsLetter(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newsLetterId = new mongoose_1.Types.ObjectId(req.params.id);
            const newsLetter = yield newsletter_model_1.NewsLetter.findById(newsLetterId);
            return res.status(200).json(newsLetter);
        }
        catch (err) {
            return res.status(500).json({ message: err.message || "Error fetching newsletter" });
        }
    });
}
function createNewsLetter(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { draftId, title, content } = req.body;
            const newsLetter = new newsletter_model_1.NewsLetter({ draftId, title, content });
            yield newsLetter.save();
            return res.status(201).json(newsLetter);
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({ message: err.message || "Error creating newsletter" });
        }
    });
}
function updateNewsLetter(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { title, content } = req.body;
            const newsLetter = yield newsletter_model_1.NewsLetter.findByIdAndUpdate(id, { title, content }, { new: true });
            if (!newsLetter)
                return res.status(404).json({ message: "Newsletter not found" });
            return res.status(200).json(newsLetter);
        }
        catch (err) {
            return res.status(500).json({ message: err.message || "Error updating newsletter" });
        }
    });
}
function sendNewsLetter(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newsLetterId = new mongoose_1.Types.ObjectId(req.params.id);
            const newsLetter = yield newsletter_model_1.NewsLetter.findById(newsLetterId);
            const subscribers = yield subscriber_model_1.Subscriber.find({ status: "subscribed" }).exec();
            const subscribersEmails = [];
            subscribers.map((subscriber) => subscribersEmails.push(subscriber.email));
            yield (0, email_1.sendEmail)({
                to: subscribersEmails,
                subject: newsLetter === null || newsLetter === void 0 ? void 0 : newsLetter.title,
                html: newsLetter === null || newsLetter === void 0 ? void 0 : newsLetter.content,
            });
            return res.status(200).json({ ok: true });
        }
        catch (err) {
            return res.status(500).json({ message: err.message || "Error sending newsletter" });
        }
    });
}
function deleteNewsLetter(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const newsLetter = yield newsletter_model_1.NewsLetter.findOneAndDelete({ draftId: id });
            if (!newsLetter)
                return res.status(404).json({ message: "Newsletter not found" });
            return res.status(200).json({ message: "Newsletter deleted successfully" });
        }
        catch (err) {
            return res.status(500).json({ message: err.message || "Error deleting newsletter" });
        }
    });
}
//# sourceMappingURL=newsletter.controller.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsLetter = void 0;
const mongoose_1 = require("mongoose");
const NewsLetterSchema = new mongoose_1.Schema({
    draftId: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String },
}, { timestamps: true });
exports.NewsLetter = (0, mongoose_1.model)("NewsLetter", NewsLetterSchema);
//# sourceMappingURL=newsletter.model.js.map
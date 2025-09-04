"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscriber = void 0;
const mongoose_1 = require("mongoose");
const SubscriberSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        index: true,
    },
    name: {
        type: String,
        default: null,
    },
    status: {
        type: String,
        enum: ["pending", "subscribed", "unsubscribed"],
        default: "pending",
    },
    confirmToken: {
        type: String
    },
    confirmExpiresAt: {
        type: Date
    },
    unsubToken: {
        type: String
    },
}, { timestamps: true });
SubscriberSchema.index({ email: 1 }, { unique: true });
exports.Subscriber = (0, mongoose_1.model)("Subscriber", SubscriberSchema);
//# sourceMappingURL=subscriber.model.js.map
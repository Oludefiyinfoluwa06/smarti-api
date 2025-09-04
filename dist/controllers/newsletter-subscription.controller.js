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
exports.subscribeHandler = subscribeHandler;
exports.fetchAllSubscribersCount = fetchAllSubscribersCount;
exports.confirmHandler = confirmHandler;
exports.unsubscribeHandler = unsubscribeHandler;
const newsletter_subscription_service_1 = require("../services/newsletter-subscription.service");
function subscribeHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const { email, name } = (_a = req.body) !== null && _a !== void 0 ? _a : {};
            if (!email || typeof email !== "string") {
                return res.status(400).json({ error: "email is required" });
            }
            const sub = yield (0, newsletter_subscription_service_1.subscribeEmail)(email, name);
            return res.status(201).json({ ok: true, email: sub.email, status: sub.status });
        }
        catch (err) {
            console.error("subscribe error:", err);
            return res.status(500).json({ error: (_b = err === null || err === void 0 ? void 0 : err.message) !== null && _b !== void 0 ? _b : "Server error" });
        }
    });
}
function fetchAllSubscribersCount(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const subscribersCount = yield (0, newsletter_subscription_service_1.fetchSubscribersCount)();
            return res.status(200).json({ ok: true, count: subscribersCount });
        }
        catch (err) {
            console.error("fetchAllSubscribers error:", err);
            return res.status(500).json({ error: (_a = err === null || err === void 0 ? void 0 : err.message) !== null && _a !== void 0 ? _a : "Server error" });
        }
    });
}
function confirmHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            const token = String((_b = (_a = req.query.token) !== null && _a !== void 0 ? _a : req.body.token) !== null && _b !== void 0 ? _b : "");
            if (!token)
                return res.status(400).json({ error: "token is required" });
            const result = yield (0, newsletter_subscription_service_1.confirmSubscription)(token);
            if (!result.ok) {
                if (result.reason === "expired_token")
                    return res.status(400).json({ error: "Token expired" });
                return res.status(400).json({ error: "Invalid token" });
            }
            return res.json({ ok: true, message: "Subscription confirmed" });
        }
        catch (err) {
            console.error("confirm error:", err);
            return res.status(500).json({ error: (_c = err === null || err === void 0 ? void 0 : err.message) !== null && _c !== void 0 ? _c : "Server error" });
        }
    });
}
function unsubscribeHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            const token = req.query.token;
            const email = (_a = req.body) === null || _a === void 0 ? void 0 : _a.email;
            const result = yield (0, newsletter_subscription_service_1.unsubscribeByToken)(token, email);
            if (!result.ok) {
                return res.status(400).json({ error: (_b = result.reason) !== null && _b !== void 0 ? _b : "Unable to unsubscribe" });
            }
            return res.json({ ok: true });
        }
        catch (err) {
            console.error("unsubscribe error:", err);
            return res.status(500).json({ error: (_c = err === null || err === void 0 ? void 0 : err.message) !== null && _c !== void 0 ? _c : "Server error" });
        }
    });
}
//# sourceMappingURL=newsletter-subscription.controller.js.map
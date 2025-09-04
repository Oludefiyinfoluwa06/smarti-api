"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const newsletter_subscription_controller_1 = require("../controllers/newsletter-subscription.controller");
const router = (0, express_1.Router)();
router.post("/subscribe", newsletter_subscription_controller_1.subscribeHandler);
router.get("/count", auth_middleware_1.requireAuth, newsletter_subscription_controller_1.fetchAllSubscribersCount);
router.get("/confirm", newsletter_subscription_controller_1.confirmHandler);
router.post("/confirm", newsletter_subscription_controller_1.confirmHandler);
router.post("/unsubscribe", newsletter_subscription_controller_1.unsubscribeHandler);
router.get("/unsubscribe", newsletter_subscription_controller_1.unsubscribeHandler);
exports.default = router;
//# sourceMappingURL=newsletter-subscription.route.js.map
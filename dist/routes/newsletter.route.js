"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const newsletter_controller_1 = require("../controllers/newsletter.controller");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.requireAuth, newsletter_controller_1.getNewsLetters);
router.get("/:id", auth_middleware_1.requireAuth, newsletter_controller_1.getNewsLetter);
router.post("/", auth_middleware_1.requireAuth, newsletter_controller_1.createNewsLetter);
router.put("/:id", auth_middleware_1.requireAuth, newsletter_controller_1.updateNewsLetter);
router.post("/:id", auth_middleware_1.requireAuth, newsletter_controller_1.sendNewsLetter);
router.delete("/:id", auth_middleware_1.requireAuth, newsletter_controller_1.deleteNewsLetter);
exports.default = router;
//# sourceMappingURL=newsletter.route.js.map
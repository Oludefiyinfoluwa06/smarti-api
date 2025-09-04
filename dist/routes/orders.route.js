"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const order_controller_1 = require("../controllers/order.controller");
const router = (0, express_1.Router)();
router.post("/", order_controller_1.placeOrder);
router.get("/", auth_middleware_1.requireAuth, order_controller_1.getOrders);
router.get("/:id", auth_middleware_1.requireAuth, order_controller_1.getOneOrder);
router.put("/:id/status", auth_middleware_1.requireAuth, order_controller_1.updateOrder);
exports.default = router;
//# sourceMappingURL=orders.route.js.map
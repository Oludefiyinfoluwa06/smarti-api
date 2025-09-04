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
exports.placeOrder = placeOrder;
exports.getOrders = getOrders;
exports.getOneOrder = getOneOrder;
exports.updateOrder = updateOrder;
const order_service_1 = require("../services/order.service");
const ALLOWED_PACKAGES = ["StudyLite", "StudyPro"];
const ORDER_STATUS = ["Pending", "Processing", "Shipped", "Delivered", "Accepted", "Declined"];
function placeOrder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const { customer, email, phone, address, packageItems, paymentReference, paymentStatus, } = req.body;
            if (!customer) {
                return res.status(400).json({ error: "Name is required" });
            }
            if (!email) {
                return res.status(400).json({ error: "Email is required" });
            }
            if (!phone) {
                return res.status(400).json({ error: "Phone is required" });
            }
            if (!address) {
                return res.status(400).json({ error: "Address is required" });
            }
            if (!packageItems) {
                return res.status(400).json({ error: "Please, select at least one package item" });
            }
            if (!Array.isArray(packageItems) || packageItems.length === 0) {
                return res.status(400).json({ error: "Please, select at least one package item" });
            }
            for (const item of packageItems) {
                if (!item.type || !ALLOWED_PACKAGES.includes(item.type)) {
                    return res.status(400).json({ error: `Invalid package type: ${item.type}` });
                }
                if (typeof item.qty !== "number" || item.qty <= 0) {
                    return res.status(400).json({ error: `Invalid qty for ${item.type}` });
                }
            }
            const created = yield (0, order_service_1.createOrder)({
                customer,
                email,
                phone,
                address,
                packageItems,
                paymentReference,
                paymentStatus,
            });
            return res.status(201).json(created);
        }
        catch (err) {
            console.error("Create order error:", err);
            return res.status(500).json({ error: (_a = err.message) !== null && _a !== void 0 ? _a : "Server error" });
        }
    });
}
function getOrders(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const { status, page, limit } = req.query;
            const parsedPage = page ? Number(page) : undefined;
            const parsedLimit = limit ? Number(limit) : undefined;
            const result = yield (0, order_service_1.listOrders)({
                status: status,
                page: parsedPage,
                limit: parsedLimit,
            });
            const mapped = result.items.map(order_service_1.mapToAdminOrder);
            return res.status(200).json(Object.assign(Object.assign({}, result), { items: mapped }));
        }
        catch (err) {
            console.error("List orders error:", err);
            return res.status(500).json({ error: (_a = err.message) !== null && _a !== void 0 ? _a : "Server error" });
        }
    });
}
function getOneOrder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const order = yield (0, order_service_1.getOrderById)(req.params.id);
            if (!order) {
                return res.status(404).json({ error: "Order not found" });
            }
            return res.status(200).json((0, order_service_1.mapToAdminOrder)(order));
        }
        catch (err) {
            console.error("Get order error:", err);
            return res.status(500).json({ error: (_a = err.message) !== null && _a !== void 0 ? _a : "Server error" });
        }
    });
}
function updateOrder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const { status } = req.body;
            if (!status || !ORDER_STATUS.includes(status)) {
                return res.status(400).json({ error: "Invalid status" });
            }
            const updated = yield (0, order_service_1.updateOrderStatus)(req.params.id, status);
            if (!updated) {
                return res.status(404).json({ error: "Order not found" });
            }
            return res.json((0, order_service_1.mapToAdminOrder)(updated));
        }
        catch (err) {
            console.error("Update order status error:", err);
            return res.status(500).json({ error: (_a = err.message) !== null && _a !== void 0 ? _a : "Server error" });
        }
    });
}
//# sourceMappingURL=order.controller.js.map
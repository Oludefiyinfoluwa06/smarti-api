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
exports.calculateTotalFromPackageItems = calculateTotalFromPackageItems;
exports.createOrder = createOrder;
exports.listOrders = listOrders;
exports.getOrderById = getOrderById;
exports.updateOrderStatus = updateOrderStatus;
exports.mapToAdminOrder = mapToAdminOrder;
const order_model_1 = require("../models/order.model");
const packages_1 = require("../config/packages");
function calculateTotalFromPackageItems(items) {
    let total = 0;
    for (const it of items) {
        const price = packages_1.PACKAGE_PRICES[it.type];
        if (price == null)
            throw new Error(`Unknown package type: ${it.type}`);
        const qty = Math.max(0, Math.floor(it.qty));
        total += price * qty;
    }
    return total;
}
function createOrder(input) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        if (!input.packageItems || input.packageItems.length === 0) {
            throw new Error("Please, select at least one package");
        }
        const total = calculateTotalFromPackageItems(input.packageItems);
        const orderId = `ORD-${Date.now()}`;
        const order = new order_model_1.Order({
            customer: input.customer,
            email: input.email,
            phone: input.phone,
            address: input.address,
            school: (_a = input.school) !== null && _a !== void 0 ? _a : undefined,
            packageItems: input.packageItems,
            total,
            orderId,
            paymentReference: (_b = input.paymentReference) !== null && _b !== void 0 ? _b : null,
            paymentStatus: (_c = input.paymentStatus) !== null && _c !== void 0 ? _c : "pending",
            status: "Pending",
        });
        return order.save();
    });
}
function listOrders(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const page = Math.max(1, (_a = opts === null || opts === void 0 ? void 0 : opts.page) !== null && _a !== void 0 ? _a : 1);
        const limit = Math.max(1, Math.min(100, (_b = opts === null || opts === void 0 ? void 0 : opts.limit) !== null && _b !== void 0 ? _b : 50));
        const filter = {};
        if (opts === null || opts === void 0 ? void 0 : opts.status) {
            filter.status = opts.status;
        }
        const skip = (page - 1) * limit;
        const [items, total] = yield Promise.all([
            order_model_1.Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            order_model_1.Order.countDocuments(filter),
        ]);
        return { items, total, page, limit };
    });
}
function getOrderById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return order_model_1.Order.findById(id);
    });
}
function updateOrderStatus(id, status) {
    return __awaiter(this, void 0, void 0, function* () {
        const order = yield order_model_1.Order.findById(id);
        if (!order) {
            return null;
        }
        order.status = status;
        yield order.save();
        return order;
    });
}
function mapToAdminOrder(order) {
    var _a;
    return {
        id: order._id,
        customer: order.customer,
        email: order.email,
        school: (_a = order.school) !== null && _a !== void 0 ? _a : undefined,
        total: Number(order.total).toFixed(2),
        date: order.createdAt.toISOString(),
        status: order.status,
        orderId: order.orderId,
        packageSummary: order.packageItems.map(p => `${p.type} x${p.qty}`).join(", "),
    };
}
//# sourceMappingURL=order.service.js.map
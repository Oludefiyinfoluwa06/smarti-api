"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const PackageItemSchema = new mongoose_1.Schema({
    type: { type: String, enum: ["StudyLite", "StudyPro"], required: true },
    qty: { type: Number, required: true, min: 1 },
});
const OrderSchema = new mongoose_1.Schema({
    customer: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    packageItems: { type: [PackageItemSchema], required: true, validate: (v) => Array.isArray(v) && v.length > 0 },
    total: { type: Number, required: true },
    status: {
        type: String,
        enum: ["Pending", "Processing", "Shipped", "Delivered", "Accepted", "Declined"],
        default: "Pending",
    },
    orderId: { type: String, required: true },
    school: { type: String, trim: true },
    paymentStatus: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    paymentReference: { type: String },
}, { timestamps: true });
exports.Order = (0, mongoose_1.model)("Order", OrderSchema);
//# sourceMappingURL=order.model.js.map
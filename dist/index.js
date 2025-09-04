"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const connectDB_1 = require("./config/connectDB");
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const orders_route_1 = __importDefault(require("./routes/orders.route"));
const newsletter_route_1 = __importDefault(require("./routes/newsletter.route"));
const newsletter_subscription_route_1 = __importDefault(require("./routes/newsletter-subscription.route"));
const PORT = process.env.PORT;
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
(0, connectDB_1.connectDB)();
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
app.use('/api/auth', auth_route_1.default);
app.use('/api/orders', orders_route_1.default);
app.use('/api/newsletter', newsletter_route_1.default);
app.use('/api/newsletter/subscription', newsletter_subscription_route_1.default);
exports.default = app;
//# sourceMappingURL=index.js.map
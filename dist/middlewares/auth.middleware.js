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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const jwt_1 = require("../utils/jwt");
const admin_model_1 = require("../models/admin.model");
function requireAuth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const header = req.headers.authorization;
        if (!header || !header.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Missing Authorization header" });
        }
        const token = header.replace("Bearer ", "");
        try {
            const payload = (0, jwt_1.verifyJwt)(token);
            const admin = yield admin_model_1.Admin.findById(payload.sub).lean();
            const _a = admin, { password } = _a, adminData = __rest(_a, ["password"]);
            if (!admin) {
                return res.status(401).json({ error: "Invalid token" });
            }
            req.auth = adminData;
            return next();
        }
        catch (err) {
            return res.status(401).json({ error: err.message || "Invalid or expired token" });
        }
    });
}
//# sourceMappingURL=auth.middleware.js.map
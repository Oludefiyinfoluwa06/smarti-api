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
exports.loginAdmin = loginAdmin;
const admin_model_1 = require("../models/admin.model");
const hash_1 = require("../utils/hash");
const jwt_1 = require("../utils/jwt");
function loginAdmin(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const admin = yield admin_model_1.Admin.findOne({
            email: email.toLowerCase(),
        });
        if (!admin) {
            return null;
        }
        const ok = yield (0, hash_1.comparePassword)(password, admin.password);
        if (!ok) {
            return null;
        }
        const token = (0, jwt_1.signJwt)({
            sub: admin._id,
        });
        return {
            token,
            admin: {
                id: admin._id,
                email: admin.email,
            },
        };
    });
}
//# sourceMappingURL=auth.service.js.map
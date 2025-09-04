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
exports.seedAdmin = seedAdmin;
const admin_model_1 = require("../models/admin.model");
const hash_1 = require("../utils/hash");
function seedAdmin() {
    return __awaiter(this, void 0, void 0, function* () {
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;
        const existing = yield admin_model_1.Admin.findOne({ email }).lean();
        if (existing) {
            return;
        }
        const hashed = yield (0, hash_1.hashPassword)(`${password}`);
        const admin = new admin_model_1.Admin({
            email,
            password: hashed,
        });
        yield admin.save();
    });
}
//# sourceMappingURL=seedAdmin.js.map
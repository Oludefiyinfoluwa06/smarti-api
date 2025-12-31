import { Router } from "express";
import { createPaymentRecord, verifyPayment, getPayments, getOnePayment, initPayment } from "../controllers/payment.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// public create (fallback), init and verify endpoints
router.post("/", createPaymentRecord);
router.post("/init", initPayment);
router.post("/verify", verifyPayment);

// admin only list and get
router.get("/", requireAuth, getPayments);
router.get("/:id", requireAuth, getOnePayment);

export default router;

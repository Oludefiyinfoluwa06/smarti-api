import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { getOneOrder, getOrders, placeOrder, updateOrder } from "../controllers/order.controller";

const router = Router();

router.post("/", placeOrder);

router.get("/", requireAuth, getOrders);

router.get("/:id", requireAuth, getOneOrder);

router.put("/:id/status", requireAuth, updateOrder);

export default router;

import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import {
  subscribeHandler,
  fetchAllSubscribersCount,
  confirmHandler,
  unsubscribeHandler,
} from "../controllers/newsletter-subscription.controller";

const router = Router();

router.post("/subscribe", subscribeHandler);
router.get("/count", requireAuth, fetchAllSubscribersCount);
router.get("/confirm", confirmHandler);
router.post("/confirm", confirmHandler);
router.post("/unsubscribe", unsubscribeHandler);
router.get("/unsubscribe", unsubscribeHandler);

export default router;

import { Request, Response } from "express";
import {
  subscribeEmail,
  fetchSubscribersCount,
  confirmSubscription,
  unsubscribeByToken,
} from "../services/newsletter-subscription.service";

export async function subscribeHandler(req: Request, res: Response) {
  try {
    const { email, name } = req.body ?? {};
    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "email is required" });
    }

    const sub = await subscribeEmail(email, name);
    return res.status(201).json({ ok: true, email: sub.email, status: sub.status });
  } catch (err: any) {
    console.error("subscribe error:", err);
    return res.status(500).json({ error: err?.message ?? "Server error" });
  }
}

export async function fetchAllSubscribersCount(req: Request, res: Response) {
  try {
    const subscribersCount = await fetchSubscribersCount();
    return res.status(200).json({ ok: true, count: subscribersCount });
  } catch (err: any) {
    console.error("fetchAllSubscribers error:", err);
    return res.status(500).json({ error: err?.message ?? "Server error" });
  }
}

export async function confirmHandler(req: Request, res: Response) {
  try {
    const token = String(req.query.token ?? req.body.token ?? "");
    if (!token) return res.status(400).json({ error: "token is required" });

    const result = await confirmSubscription(token);
    if (!result.ok) {
      if (result.reason === "expired_token") return res.status(400).json({ error: "Token expired" });
      return res.status(400).json({ error: "Invalid token" });
    }

    return res.json({ ok: true, message: "Subscription confirmed" });
  } catch (err: any) {
    console.error("confirm error:", err);
    return res.status(500).json({ error: err?.message ?? "Server error" });
  }
}

export async function unsubscribeHandler(req: Request, res: Response) {
  try {
    const token = req.query.token as string | undefined;
    const email = req.body?.email as string | undefined;
    const result = await unsubscribeByToken(token, email);

    if (!result.ok) {
      return res.status(400).json({ error: result.reason ?? "Unable to unsubscribe" });
    }

    return res.json({ ok: true });
  } catch (err: any) {
    console.error("unsubscribe error:", err);
    return res.status(500).json({ error: err?.message ?? "Server error" });
  }
}

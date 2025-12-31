import { Request, Response } from "express";
import axios from "axios";
import { createPayment, findPaymentByReference, listPayments, getPaymentById } from "../services/payment.service";

// Initialize a Paystack transaction and create a pending payment record
export async function initPayment(req: Request, res: Response) {
  try {
    const { email, amount, currency, metadata } = req.body;
    if (!email || !amount) return res.status(400).json({ error: "email and amount are required" });

    const secret = process.env.PAYSTACK_SECRET;
    if (!secret) return res.status(500).json({ error: "PAYSTACK_SECRET not configured on server" });

    const payload: any = {
      email,
      amount: Math.round(Number(amount) * 100), // paystack expects kobo
      currency: currency || "NGN",
      metadata: metadata || {},
    };

    const url = `https://api.paystack.co/transaction/initialize`;
    const resp = await axios.post(url, payload, { headers: { Authorization: `Bearer ${secret}` } });
    const data = resp.data;
    if (!data || !data.status) return res.status(500).json({ error: "Paystack initialize failed" });

    const tx = data.data;
    // create pending payment record
    const created = await createPayment({
      payerName: undefined,
      email,
      phone: undefined,
      amount: Number(payload.amount) / 100,
      currency: payload.currency,
      reference: tx.reference,
      status: "pending",
      method: undefined,
      meta: tx,
    });

    return res.status(200).json({ authorization_url: tx.authorization_url, access_code: tx.access_code, reference: tx.reference, payment: created });
  } catch (err: any) {
    console.error("Init payment error:", err?.response?.data || err.message || err);
    return res.status(500).json({ error: err?.response?.data || err.message || "Server error" });
  }
}

// Create payment record directly (fallback)
export async function createPaymentRecord(req: Request, res: Response) {
  try {
    const { payerName, email, phone, amount, currency, reference, status, method, meta } = req.body;
    if (!email || !amount || !reference) {
      return res.status(400).json({ error: "email, amount and reference are required" });
    }
    const existing = await findPaymentByReference(reference);
    if (existing) return res.status(200).json(existing);
    const created = await createPayment({ payerName, email, phone, amount: Number(amount), currency, reference, status, method, meta });
    return res.status(201).json(created);
  } catch (err: any) {
    console.error("Create payment error:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
}

// Verify Paystack transaction and record
export async function verifyPayment(req: Request, res: Response) {
  try {
    const { reference } = req.body;
    if (!reference) return res.status(400).json({ error: "reference is required" });

    // check existing
    const existing = await findPaymentByReference(reference);
    if (existing && existing.status === "completed") return res.json(existing);

    const secret = process.env.PAYSTACK_SECRET;
    if (!secret) return res.status(500).json({ error: "PAYSTACK_SECRET not configured on server" });

    const url = `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`;
    const resp = await axios.get(url, { headers: { Authorization: `Bearer ${secret}` } });
    const data = resp.data;
    if (!data || !data.status) {
      return res.status(500).json({ error: "Invalid verify response" });
    }

    if (!data.data) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    const tx = data.data;
    const paymentPayload = {
      payerName: tx.customer?.first_name ? `${tx.customer.first_name} ${tx.customer.last_name || ''}`.trim() : undefined,
      email: tx.customer?.email || tx.customer?.email || "",
      phone: tx.customer?.phone || undefined,
      amount: Number(tx.amount) / 100,
      currency: tx.currency || "NGN",
      reference: tx.reference,
      status: tx.status === 'success' ? 'completed' : 'failed',
      method: tx.channel || tx.authorization?.channel || undefined,
      meta: tx,
    };

    // upsert
    if (existing) {
      // update status if needed
      existing.status = paymentPayload.status as any;
      existing.meta = paymentPayload.meta;
      await existing.save();
      return res.json(existing);
    }

    const created = await createPayment(paymentPayload as any);
    return res.json(created);
  } catch (err: any) {
    console.error("Verify payment error:", err?.response?.data || err.message || err);
    return res.status(500).json({ error: err?.response?.data || err.message || "Server error" });
  }
}

export async function getPayments(req: Request, res: Response) {
  try {
    const { page, limit } = req.query as any;
    const parsedPage = page ? Number(page) : undefined;
    const parsedLimit = limit ? Number(limit) : undefined;
    const result = await listPayments({ page: parsedPage, limit: parsedLimit });
    return res.json(result);
  } catch (err: any) {
    console.error("List payments error:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
}

export async function getOnePayment(req: Request, res: Response) {
  try {
    const p = await getPaymentById(req.params.id);
    if (!p) return res.status(404).json({ error: "Payment not found" });
    return res.json(p);
  } catch (err: any) {
    console.error("Get payment error:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
}

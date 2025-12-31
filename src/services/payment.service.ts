import { Payment, IPayment } from "../models/payment.model";

export interface CreatePaymentInput {
  payerName?: string;
  email: string;
  phone?: string;
  amount: number;
  currency?: string;
  reference: string;
  status?: "pending" | "completed" | "failed";
  method?: string;
  meta?: any;
}

export async function createPayment(input: CreatePaymentInput): Promise<IPayment> {
  const p = new Payment({
    payerName: input.payerName,
    email: input.email,
    phone: input.phone,
    amount: input.amount,
    currency: input.currency ?? "NGN",
    reference: input.reference,
    status: input.status ?? "pending",
    method: input.method,
    meta: input.meta,
  });
  return p.save();
}

export async function findPaymentByReference(reference: string) {
  return Payment.findOne({ reference });
}

export async function getPaymentById(id: string) {
  return Payment.findById(id);
}

export async function listPayments(opts?: { page?: number; limit?: number; }) {
  const page = Math.max(1, opts?.page ?? 1);
  const limit = Math.max(1, Math.min(200, opts?.limit ?? 50));
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Payment.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Payment.countDocuments(),
  ]);
  return { items, total, page, limit };
}

import { Order, IOrder, OrderStatus, PackageType } from "../models/order.model";
import { PACKAGE_PRICES } from "../config/packages";

export interface PackageItemInput {
  type: PackageType;
  qty: number;
}

export interface CreateOrderInput {
  customer: string;
  email: string;
  phone: string;
  address: string;
  school?: string;
  packageItems: PackageItemInput[];
  paymentReference?: string | null;
  paymentStatus?: "pending" | "completed" | "failed";
}

export function calculateTotalFromPackageItems(items: PackageItemInput[]): number {
  let total = 0;
  for (const it of items) {
    const price = PACKAGE_PRICES[it.type];
    if (price == null) throw new Error(`Unknown package type: ${it.type}`);
    const qty = Math.max(0, Math.floor(it.qty));
    total += price * qty;
  }
  return total;
}

export async function createOrder(input: CreateOrderInput): Promise<IOrder> {
  if (!input.packageItems || input.packageItems.length === 0) {
    throw new Error("Please, select at least one package");
  }

  const total = calculateTotalFromPackageItems(input.packageItems);
  const orderId = `ORD-${Date.now()}`;

  const order = new Order({
    customer: input.customer,
    email: input.email,
    phone: input.phone,
    address: input.address,
    school: input.school ?? undefined,
    packageItems: input.packageItems,
    total,
    orderId,
    paymentReference: input.paymentReference ?? null,
    paymentStatus: input.paymentStatus ?? "pending",
    status: "Pending" as OrderStatus,
  });

  return order.save();
}

export async function listOrders(opts?: { status?: OrderStatus; page?: number; limit?: number; }) {
  const page = Math.max(1, opts?.page ?? 1);
  const limit = Math.max(1, Math.min(100, opts?.limit ?? 50));
  const filter: any = {};

  if (opts?.status) {
    filter.status = opts.status;
  }

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Order.countDocuments(filter),
  ]);

  return { items, total, page, limit };
}

export async function getOrderById(id: string) {
  return Order.findById(id);
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const order = await Order.findById(id);

  if (!order) {
    return null;
  }

  order.status = status;
  await order.save();
  return order;
}

export function mapToAdminOrder(order: IOrder) {
  return {
    id: order._id,
    customer: order.customer,
    email: order.email,
    school: (order as any).school ?? undefined,
    total: Number(order.total).toFixed(2),
    date: order.createdAt.toISOString(),
    status: order.status,
    orderId: order.orderId,
    packageSummary: order.packageItems.map(p => `${p.type} x${p.qty}`).join(", "),
  };
}

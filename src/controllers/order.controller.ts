import { Request, Response } from "express";
import {
  createOrder,
  getOrderById,
  listOrders,
  mapToAdminOrder,
  updateOrderStatus,
} from "../services/order.service";
import { IOrder } from "../models/order.model";

const ALLOWED_PACKAGES = ["StudyLite", "StudyPro"];
const ORDER_STATUS = ["Pending", "Processing", "Shipped", "Delivered", "Accepted", "Declined"];

export async function placeOrder(req: Request, res: Response) {
  try {
    const {
      customer,
      email,
      phone,
      address,
      packageItems,
      paymentReference,
      paymentStatus,
    } = req.body;

    if (!customer) {
      return res.status(400).json({ error: "Name is required" });
    }

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    if (!phone) {
      return res.status(400).json({ error: "Phone is required" });
    }

    if (!address) {
      return res.status(400).json({ error: "Address is required" });
    }

    if (!packageItems) {
      return res.status(400).json({ error: "Please, select at least one package item" });
    }

    if (!Array.isArray(packageItems) || packageItems.length === 0) {
      return res.status(400).json({ error: "Please, select at least one package item" });
    }

    for (const item of packageItems) {
      if (!item.type || !ALLOWED_PACKAGES.includes(item.type)) {
        return res.status(400).json({ error: `Invalid package type: ${item.type}` });
      }
      if (typeof item.qty !== "number" || item.qty <= 0) {
        return res.status(400).json({ error: `Invalid qty for ${item.type}` });
      }
    }

    const created = await createOrder({
      customer,
      email,
      phone,
      address,
      packageItems,
      paymentReference,
      paymentStatus,
    });

    return res.status(201).json(created);
  } catch (err: any) {
    console.error("Create order error:", err);
    return res.status(500).json({ error: err.message ?? "Server error" });
  }
}

export async function getOrders(req: Request, res: Response) {
  try {
    const { status, page, limit } = req.query as any;
    const parsedPage = page ? Number(page) : undefined;
    const parsedLimit = limit ? Number(limit) : undefined;
    const result = await listOrders({
      status: status as any,
      page: parsedPage,
      limit: parsedLimit,
    });

    const mapped = result.items.map(mapToAdminOrder);
    return res.status(200).json({ ...result, items: mapped });
  } catch (err: any) {
    console.error("List orders error:", err);
    return res.status(500).json({ error: err.message ?? "Server error" });
  }
}

export async function getOneOrder(req: Request, res: Response) {
  try {
    const order = await getOrderById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.status(200).json(mapToAdminOrder(order as IOrder));
  } catch (err: any) {
    console.error("Get order error:", err);
    return res.status(500).json({ error: err.message ?? "Server error" });
  }
}

export async function updateOrder(req: Request, res: Response) {
  try {
    const { status } = req.body;
    if (!status || !ORDER_STATUS.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updated: any = await updateOrderStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.json(mapToAdminOrder(updated as IOrder));
  } catch (err: any) {
    console.error("Update order status error:", err);
    return res.status(500).json({ error: err.message ?? "Server error" });
  }
}

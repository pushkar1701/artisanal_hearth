import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { getRedis } from "@/lib/kv";

export type OrderItem = {
  id: string;
  name: string;
  priceInr: number;
  quantity: number;
  lineTotalInr: number;
};

export type CustomerOrder = {
  id: string;
  createdAtIso: string;
  customerName: string;
  phone: string;
  address: string;
  notes?: string;
  deliveryDate: string;
  deliveryWindow: string;
  distanceKm: number;
  isBulk: boolean;
  deliveryFeeInr: number;
  itemsSubtotalInr: number;
  totalInr: number;
  paymentMethod: "upi";
  upiReference?: string;
  items: OrderItem[];
};

export type OrdersFile = { orders: CustomerOrder[] };

const ORDERS_PATH = path.join(process.cwd(), "data", "orders.json");
const ORDERS_KEY = "artisanal_hearth:orders";

function sanitize(file: OrdersFile): OrdersFile {
  if (!Array.isArray(file.orders)) return { orders: [] };
  return { orders: file.orders };
}

export async function readOrders(): Promise<OrdersFile> {
  const redis = getRedis();
  if (redis) {
    const fromKv = await redis.get<OrdersFile>(ORDERS_KEY);
    if (fromKv) return sanitize(fromKv);
  }

  try {
    const raw = await readFile(ORDERS_PATH, "utf8");
    return sanitize(JSON.parse(raw) as OrdersFile);
  } catch {
    return { orders: [] };
  }
}

export async function writeOrders(file: OrdersFile): Promise<void> {
  const normalized = sanitize(file);
  const redis = getRedis();
  if (redis) {
    await redis.set(ORDERS_KEY, normalized);
    return;
  }
  await writeFile(ORDERS_PATH, JSON.stringify(normalized, null, 2), "utf8");
}

export async function addOrder(order: CustomerOrder): Promise<void> {
  const current = await readOrders();
  await writeOrders({ orders: [order, ...current.orders] });
}

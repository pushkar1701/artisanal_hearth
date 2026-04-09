import { NextResponse } from "next/server";
import { PHONE_WHATSAPP } from "@/lib/contact";
import { addOrder, type CustomerOrder } from "@/lib/order-store";

type CreateOrderBody = {
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
  items: Array<{
    id: string;
    name: string;
    priceInr: number;
    quantity: number;
  }>;
};

function chefMessage(order: CustomerOrder): string {
  const lines = order.items
    .map((item) => `- ${item.name} x${item.quantity} (Rs ${item.lineTotalInr})`)
    .join("\n");
  return [
    "New order placed",
    `Order ID: ${order.id}`,
    `Customer: ${order.customerName}`,
    `Phone: ${order.phone}`,
    `Delivery: ${order.deliveryDate} (${order.deliveryWindow})`,
    `Address: ${order.address}`,
    `Distance: ${order.distanceKm.toFixed(1)} km`,
    `Bulk: ${order.isBulk ? "Yes" : "No"}`,
    "Items:",
    lines,
    `Items total: Rs ${order.itemsSubtotalInr}`,
    `Delivery fee: Rs ${order.deliveryFeeInr}`,
    `Grand total: Rs ${order.totalInr}`,
    `UPI ref: ${order.upiReference || "N/A"}`,
    `Notes: ${order.notes || "N/A"}`,
  ].join("\n");
}

async function triggerSmsWebhook(message: string): Promise<void> {
  const url = process.env.SMS_WEBHOOK_URL;
  if (!url) return;
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.SMS_WEBHOOK_AUTH_TOKEN
        ? { Authorization: `Bearer ${process.env.SMS_WEBHOOK_AUTH_TOKEN}` }
        : {}),
    },
    body: JSON.stringify({ message }),
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<CreateOrderBody>;

  if (!body.customerName || !body.phone || !body.address || !body.deliveryDate || !body.deliveryWindow) {
    return NextResponse.json({ ok: false, error: "Missing customer or delivery details." }, { status: 400 });
  }
  if (body.paymentMethod !== "upi") {
    return NextResponse.json({ ok: false, error: "Only UPI payments are accepted." }, { status: 400 });
  }
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ ok: false, error: "Cart is empty." }, { status: 400 });
  }

  const items = body.items
    .filter((item) => item.quantity > 0)
    .map((item) => ({
      id: item.id,
      name: item.name,
      priceInr: item.priceInr,
      quantity: item.quantity,
      lineTotalInr: Math.round(item.priceInr * item.quantity),
    }));
  if (items.length === 0) {
    return NextResponse.json({ ok: false, error: "Cart is empty." }, { status: 400 });
  }

  const itemsSubtotalInr = items.reduce((sum, item) => sum + item.lineTotalInr, 0);
  const deliveryFeeInr = Math.max(0, Number(body.deliveryFeeInr || 0));
  const totalInr = itemsSubtotalInr + deliveryFeeInr;

  const order: CustomerOrder = {
    id: `AH-${Date.now()}`,
    createdAtIso: new Date().toISOString(),
    customerName: body.customerName.trim(),
    phone: body.phone.trim(),
    address: body.address.trim(),
    notes: body.notes?.trim() || "",
    deliveryDate: body.deliveryDate,
    deliveryWindow: body.deliveryWindow,
    distanceKm: Number(body.distanceKm || 0),
    isBulk: Boolean(body.isBulk),
    deliveryFeeInr,
    itemsSubtotalInr,
    totalInr,
    paymentMethod: "upi",
    upiReference: body.upiReference?.trim() || "",
    items,
  };

  await addOrder(order);

  const message = chefMessage(order);
  const whatsappUrl = `https://wa.me/${PHONE_WHATSAPP}?text=${encodeURIComponent(message)}`;
  void triggerSmsWebhook(message);

  return NextResponse.json({
    ok: true,
    orderId: order.id,
    whatsappNotifyUrl: whatsappUrl,
  });
}

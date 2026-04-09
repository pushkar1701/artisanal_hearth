import { readOrders } from "@/lib/order-store";

export async function ChefOrdersPanel() {
  const { orders } = await readOrders();
  const latest = orders.slice(0, 20);

  return (
    <section className="space-y-4">
      <header>
        <h2 className="font-serif-display text-3xl text-ah-on-bg">Chef orders</h2>
        <p className="text-sm text-ah-on-surface-variant">
          Latest customer orders with delivery details and item breakdown.
        </p>
      </header>
      {latest.length === 0 ? (
        <p className="rounded-xl bg-ah-surface-low p-4 text-sm text-ah-on-surface-variant">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {latest.map((order) => (
            <article key={order.id} className="rounded-xl border border-ah-outline-variant/30 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold text-emerald-950">
                  {order.customerName} - {order.id}
                </h3>
                <p className="text-sm text-ah-on-surface-variant">
                  {new Date(order.createdAtIso).toLocaleString("en-IN")}
                </p>
              </div>
              <p className="mt-1 text-sm text-ah-on-surface-variant">
                {order.phone} | {order.address}
              </p>
              <p className="mt-1 text-sm text-ah-on-surface-variant">
                Delivery: {order.deliveryDate} ({order.deliveryWindow}) | Distance: {order.distanceKm.toFixed(1)} km
              </p>
              <ul className="mt-3 list-inside list-disc text-sm text-ah-on-bg">
                {order.items.map((item) => (
                  <li key={`${order.id}-${item.id}`}>
                    {item.name} x{item.quantity} - Rs {item.lineTotalInr}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm font-semibold text-ah-primary">
                Total: Rs {order.totalInr} (Items Rs {order.itemsSubtotalInr} + Delivery Rs {order.deliveryFeeInr})
              </p>
              {order.notes && <p className="mt-1 text-sm text-ah-on-surface-variant">Chef note: {order.notes}</p>}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

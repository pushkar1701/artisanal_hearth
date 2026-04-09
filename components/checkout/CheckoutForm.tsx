"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/artisan/Icon";
import { CART_KEY, cartSubtotal, type CartItem } from "@/lib/cart";
import { PHONE_DISPLAY } from "@/lib/contact";
import { distanceKm, getKitchenCoords, quoteDelivery } from "@/lib/delivery";
import { isSameDayDelivery, tomorrowDateString, todayDateString } from "@/lib/order-dates";

export function CheckoutForm() {
  const minDate = tomorrowDateString();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [deliveryDate, setDeliveryDate] = useState(minDate);
  const [deliveryWindow, setDeliveryWindow] = useState("12:00–2:00 PM");
  const [bulk, setBulk] = useState(false);
  const [porterQuoteInr, setPorterQuoteInr] = useState("");
  const [geoStatus, setGeoStatus] = useState<string | null>(null);
  const [distanceKmVal, setDistanceKmVal] = useState<number | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [upiRef, setUpiRef] = useState("");
  const [placing, setPlacing] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<string | null>(null);
  const [chefWhatsAppUrl, setChefWhatsAppUrl] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as CartItem[];
      if (Array.isArray(parsed)) setCart(parsed);
    } catch {
      setCart([]);
    }
  }, []);

  function saveCart(next: CartItem[]) {
    setCart(next);
    localStorage.setItem(CART_KEY, JSON.stringify(next));
  }

  function inc(itemId: string) {
    const next = cart.map((item) =>
      item.id === itemId
        ? { ...item, quantity: Math.min(item.quantityAvailable, item.quantity + 1) }
        : item
    );
    saveCart(next);
  }

  function dec(itemId: string) {
    const next = cart
      .map((item) => (item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item))
      .filter((item) => item.quantity > 0);
    saveCart(next);
  }

  const quote = useMemo(() => {
    if (distanceKmVal == null) return null;
    const pq = porterQuoteInr ? Number(porterQuoteInr) : undefined;
    return quoteDelivery(distanceKmVal, bulk, pq && !Number.isNaN(pq) ? pq : undefined);
  }, [distanceKmVal, bulk, porterQuoteInr]);

  const itemsSubtotalInr = useMemo(() => cartSubtotal(cart), [cart]);
  const deliveryFeeInr = useMemo(() => {
    if (!quote || !quote.ok) return 0;
    if (quote.requiresPorterQuote) return Number(porterQuoteInr || 0) || 0;
    return quote.feeInr;
  }, [quote, porterQuoteInr]);
  const grandTotalInr = itemsSubtotalInr + deliveryFeeInr;

  const deliveryFeeDisplay = useMemo(() => {
    if (!quote || !quote.ok) return null;
    if (quote.requiresPorterQuote) return "Enter Porter quote below";
    return quote.feeInr === 0 ? "Free" : `Rs ${quote.feeInr}`;
  }, [quote]);

  const sameDaySelected = isSameDayDelivery(deliveryDate);

  const canSubmit =
    cart.length > 0 &&
    !sameDaySelected &&
    fullName.trim().length > 1 &&
    phone.trim().length >= 8 &&
    address.trim().length > 5 &&
    distanceKmVal != null &&
    quote != null &&
    quote.ok &&
    (!("requiresPorterQuote" in quote && quote.requiresPorterQuote) || Number(porterQuoteInr) > 0);

  function locate() {
    if (!navigator.geolocation) {
      setGeoStatus("Geolocation not supported in this browser.");
      return;
    }
    setGeoStatus("Locating…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const kitchen = getKitchenCoords();
        const d = distanceKm(kitchen, {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setDistanceKmVal(Math.round(d * 10) / 10);
        setGeoStatus(`Using your location (~${Math.round(d * 10) / 10} km from kitchen).`);
      },
      () => {
        setGeoStatus("Could not read location. Enter distance manually below.");
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }

  async function placeOrder() {
    if (!canSubmit || placing) return;
    setSubmitMsg(null);
    setChefWhatsAppUrl(null);
    setPlacing(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: fullName,
          phone,
          address,
          notes,
          deliveryDate,
          deliveryWindow,
          distanceKm: distanceKmVal,
          isBulk: bulk,
          deliveryFeeInr,
          itemsSubtotalInr,
          totalInr: grandTotalInr,
          paymentMethod: "upi",
          upiReference: upiRef,
          items: cart.map((item) => ({
            id: item.id,
            name: item.name,
            priceInr: item.priceInr,
            quantity: item.quantity,
          })),
        }),
      });

      const data = (await response.json()) as { ok: boolean; error?: string; orderId?: string; whatsappNotifyUrl?: string };
      if (!response.ok || !data.ok) {
        setSubmitMsg(data.error || "Order could not be placed. Please try again.");
        return;
      }
      localStorage.removeItem(CART_KEY);
      setCart([]);
      setSubmitMsg(`Order placed successfully. Order ID: ${data.orderId}`);
      setChefWhatsAppUrl(data.whatsappNotifyUrl || null);
    } catch {
      setSubmitMsg("Order could not be placed due to network error.");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
      <div className="space-y-10 lg:col-span-7">
        <section className="rounded-xl bg-ah-surface-low p-6 md:p-8">
          <h2 className="font-serif-display text-2xl text-ah-secondary">Delivery date</h2>
          <p className="mt-2 text-sm text-ah-on-surface-variant">
            Orders open <strong>one day in advance</strong> only—same-day delivery is not available.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-xl border-2 border-stone-200 bg-stone-100 px-4 py-3 text-sm font-semibold text-stone-400 line-through"
            >
              Today ({todayDateString()}) — same day
            </button>
          </div>
          <div className="mt-4">
            <label className="text-xs font-bold uppercase tracking-widest text-ah-on-surface-variant">
              Delivery date (earliest: tomorrow)
            </label>
            <input
              type="date"
              min={minDate}
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              className="mt-2 block rounded-t-md border-none bg-ah-surface-high px-4 py-3"
            />
            {sameDaySelected && (
              <p className="mt-2 text-sm font-medium text-ah-error">
                Same-day is not available. Choose tomorrow or later.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-xl bg-ah-surface-low p-6 md:p-8">
          <h2 className="font-serif-display text-2xl text-ah-secondary">1. Where to send?</h2>
          <p className="mt-2 text-sm text-ah-on-surface-variant">
            Service area: <strong>Ghaziabad &amp; Noida Sector 62</strong> region. Delivery fee by road distance
            from our kitchen.
          </p>
          <div className="mt-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-ah-on-surface-variant">
                  Full name
                </label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-2 w-full rounded-t-md border-none bg-ah-surface-high px-4 py-3 focus:ring-2 focus:ring-ah-primary/20"
                  placeholder="Your name"
                  autoComplete="name"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-ah-on-surface-variant">
                  Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-2 w-full rounded-t-md border-none bg-ah-surface-high px-4 py-3 focus:ring-2 focus:ring-ah-primary/20"
                  placeholder={`+91 ${PHONE_DISPLAY}`}
                  autoComplete="tel"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-ah-on-surface-variant">
                Delivery address (area / landmark — full street optional)
              </label>
              <textarea
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-2 w-full rounded-t-md border-none bg-ah-surface-high px-4 py-3 focus:ring-2 focus:ring-ah-primary/20"
                placeholder="Sector, society, landmark near Ghaziabad / Noida 62"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-ah-on-surface-variant">Notes for chef</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-2 w-full rounded-t-md border-none bg-ah-surface-high px-4 py-3 focus:ring-2 focus:ring-ah-primary/20"
                placeholder="Less spice, no onion, gate pass, etc."
              />
            </div>
          </div>
        </section>

        <section className="rounded-xl bg-ah-surface-low p-6 md:p-8">
          <h2 className="font-serif-display text-2xl text-ah-secondary">Distance &amp; delivery fee</h2>
          <p className="mt-2 text-sm text-ah-on-surface-variant">
            0–5 km free · 5–10 km ₹40 · 10–15 km ₹100 · Regular orders max <strong>15 km</strong>. 15–20 km bulk
            only (₹100). Beyond 20 km bulk + Porter quote.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={locate}
              className="inline-flex items-center gap-2 rounded-xl bg-ah-primary px-4 py-2.5 text-sm font-bold text-white"
            >
              <Icon name="my_location" />
              Use my location
            </button>
            <div className="flex items-center gap-2">
              <label className="text-sm text-ah-on-surface-variant">Or distance (km)</label>
              <input
                type="number"
                min={0}
                step={0.1}
                placeholder="e.g. 8"
                value={distanceKmVal ?? ""}
                onChange={(e) =>
                  setDistanceKmVal(e.target.value === "" ? null : Number(e.target.value))
                }
                className="w-28 rounded-t-md border-none bg-ah-surface-high px-3 py-2"
              />
            </div>
          </div>
          {geoStatus && <p className="mt-2 text-sm text-stone-600">{geoStatus}</p>}

          <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-ah-outline-variant/50 bg-white p-4">
            <input
              type="checkbox"
              checked={bulk}
              onChange={(e) => setBulk(e.target.checked)}
              className="mt-1 h-5 w-5 rounded border-ah-outline-variant text-ah-primary"
            />
            <span>
              <strong>Bulk / extended delivery</strong> — required for 15–20 km, or beyond 20 km with Porter /
              partner rider (actual quote).
            </span>
          </label>

          {quote && quote.ok && quote.requiresPorterQuote && (
            <div className="mt-4">
              <label className="text-xs font-bold uppercase tracking-widest text-ah-on-surface-variant">
                Porter / partner quote (₹) — from app or support
              </label>
              <input
                type="number"
                min={0}
                value={porterQuoteInr}
                onChange={(e) => setPorterQuoteInr(e.target.value)}
                className="mt-2 w-full max-w-xs rounded-t-md border-none bg-ah-surface-high px-4 py-3"
                placeholder="Enter quoted amount"
              />
            </div>
          )}

          {distanceKmVal != null && quote && !quote.ok && (
            <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-900">{quote.message}</p>
          )}
        </section>

        <section className="rounded-xl bg-ah-surface-low p-6 md:p-8">
          <h2 className="font-serif-display text-2xl text-ah-secondary">2. Delivery window</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {["12:00–2:00 PM", "7:00–9:00 PM"].map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setDeliveryWindow(w)}
                className={`rounded-xl border-2 bg-white px-5 py-3 text-sm font-semibold text-ah-on-bg ${
                  deliveryWindow === w ? "border-ah-primary" : "border-ah-outline-variant/50 hover:border-ah-primary"
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-xl bg-ah-surface-low p-6 md:p-8">
          <h2 className="font-serif-display text-2xl text-ah-secondary">3. Payment</h2>
          <p className="mt-2 text-sm text-ah-on-surface-variant">UPI only.</p>
          <div className="mt-6 space-y-4">
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-ah-outline-variant/50 bg-white p-4">
              <input type="radio" name="pay" defaultChecked className="h-5 w-5 text-ah-primary" />
              <span className="font-medium">UPI / QR</span>
            </label>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-ah-on-surface-variant">
                UPI reference (optional)
              </label>
              <input
                value={upiRef}
                onChange={(e) => setUpiRef(e.target.value)}
                className="mt-2 w-full rounded-t-md border-none bg-ah-surface-high px-4 py-3"
                placeholder="e.g. 413245678901"
              />
            </div>
          </div>
        </section>
      </div>

      <aside className="lg:col-span-5">
        <div className="sticky top-24 rounded-xl border border-ah-outline-variant/40 bg-white p-6 shadow-sm">
          <h3 className="font-serif-display text-xl text-emerald-950">Order summary</h3>
          {cart.length === 0 ? (
            <p className="mt-4 text-sm text-ah-on-surface-variant">
              Your cart is empty. Go to <Link href="/menu" className="underline">Daily menu</Link> and add dishes.
            </p>
          ) : (
            <ul className="mt-4 space-y-3 text-sm">
              {cart.map((item) => (
                <li key={item.id} className="rounded-lg bg-ah-surface-low p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.name}</span>
                    <span>Rs {item.priceInr * item.quantity}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <button type="button" onClick={() => dec(item.id)} className="h-8 w-8 rounded-full border border-ah-outline-variant">
                      -
                    </button>
                    <span className="min-w-6 text-center">{item.quantity}</span>
                    <button type="button" onClick={() => inc(item.id)} className="h-8 w-8 rounded-full border border-ah-primary text-ah-primary">
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex justify-between text-ah-on-surface-variant">
              <span>Items subtotal</span>
              <span>Rs {itemsSubtotalInr}</span>
            </li>
            <li className="flex justify-between text-ah-on-surface-variant">
              <span>Delivery fee</span>
              <span>{deliveryFeeDisplay ?? "—"}</span>
            </li>
            {quote && quote.ok && !quote.requiresPorterQuote && (
              <li className="text-xs text-stone-500">{quote.tier}</li>
            )}
            <li className="flex justify-between border-t border-ah-outline-variant/50 pt-3 text-lg font-bold text-ah-primary">
              <span>Total</span>
              <span>Rs {grandTotalInr}</span>
            </li>
          </ul>
          {submitMsg && <p className="mt-4 text-sm font-medium text-ah-secondary">{submitMsg}</p>}
          {chefWhatsAppUrl && (
            <a
              href={chefWhatsAppUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-ah-primary underline"
            >
              Notify chef on WhatsApp now
              <Icon name="arrow_outward" />
            </a>
          )}
          <button
            type="button"
            onClick={placeOrder}
            disabled={!canSubmit}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-ah-primary py-4 font-bold text-white transition hover:bg-ah-primary-container disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            {placing ? "Placing order..." : "Place order"}
            <Icon name="lock" className="text-xl" />
          </button>
        </div>
      </aside>
    </div>
  );
}

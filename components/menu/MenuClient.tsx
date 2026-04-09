"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/artisan/Icon";
import { CART_KEY, cartSubtotal, type CartItem } from "@/lib/cart";
import type { Dish } from "@/lib/menu-store";

const PLACEHOLDER =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAbT_5nN-bECVeNC8xlR9OUC7eQad4M5bYzqPGaN1Z9L2f6ZR0KjEeVN8C8EB2PqNexBTFSM-KY43KoKZRn5WdcSW4Z_CK3FBspGraUJ4cSZmMQCt4ux_9QCMC2TCjUxs0Zm5fq0aGEcXjMp-jijD9_EBvM8jbgaFK7IOPb8RAM0tykia-vrA_ZUeWetKraTDbAiF5GKV1U5GMteo0DFXspbIldqE9NHyMQB88wQb5w1KfFhP-c5OuHuxHf8QQjsIzsb04qwkSVoOWr";

function toCartItem(dish: Dish): CartItem {
  return {
    id: dish.id,
    name: dish.name,
    priceInr: dish.priceInr,
    quantityAvailable: dish.quantityAvailable,
    quantity: 1,
  };
}

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function MenuClient({ dishes }: { dishes: Dish[] }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCart(readCart());
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  function updateCart(next: CartItem[]) {
    setCart(next);
    writeCart(next);
  }

  function itemQty(dishId: string): number {
    return cart.find((item) => item.id === dishId)?.quantity ?? 0;
  }

  function add(dish: Dish) {
    const current = readCart();
    const index = current.findIndex((item) => item.id === dish.id);
    if (index === -1) {
      updateCart([...current, toCartItem(dish)]);
      return;
    }
    const next = [...current];
    const maxQty = Math.max(0, dish.quantityAvailable);
    next[index] = { ...next[index], quantity: Math.min(maxQty, next[index].quantity + 1) };
    updateCart(next);
  }

  function dec(dish: Dish) {
    const current = readCart();
    const index = current.findIndex((item) => item.id === dish.id);
    if (index === -1) return;
    const next = [...current];
    const qty = next[index].quantity - 1;
    if (qty <= 0) {
      next.splice(index, 1);
    } else {
      next[index] = { ...next[index], quantity: qty };
    }
    updateCart(next);
  }

  const totalItems = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const subtotal = useMemo(() => cartSubtotal(cart), [cart]);

  return (
    <>
      {dishes.length === 0 ? (
        <p className="text-ah-on-surface-variant">
          No dishes yet. Use the <Link href="/admin" className="font-semibold text-ah-primary underline">admin</Link>{" "}
          panel to add items.
        </p>
      ) : (
        <ul className="space-y-8">
          {dishes.map((item, i) => {
            const qty = itemQty(item.id);
            return (
              <li
                key={item.id}
                className="flex flex-col gap-4 rounded-2xl border border-ah-outline-variant/40 bg-white p-4 shadow-sm md:flex-row md:items-stretch md:justify-between md:gap-6"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl md:aspect-auto md:h-44 md:w-56 md:shrink-0">
                  <Image
                    src={PLACEHOLDER}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 224px"
                    priority={i === 0}
                  />
                </div>
                <div className="flex flex-1 flex-col justify-center">
                  <h2 className="font-serif-display text-2xl text-emerald-950">{item.name}</h2>
                  {item.description && <p className="mt-2 text-ah-on-surface-variant">{item.description}</p>}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(item.tags ?? []).map((t) => (
                      <span key={t} className="rounded-full bg-ah-surface-highest px-3 py-1 text-xs font-semibold text-ah-on-surface-variant">
                        {t}
                      </span>
                    ))}
                    <span className="inline-flex items-center gap-1 rounded-full bg-ah-tertiary-container px-3 py-1 text-xs font-semibold text-ah-on-tertiary-container">
                      <Icon name="inventory_2" className="text-base" />
                      {item.quantityAvailable} left
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 flex-row items-center justify-between gap-6 border-t border-ah-outline-variant/30 pt-4 md:flex-col md:border-l md:border-t-0 md:pl-6 md:pt-0">
                  <span className="font-serif-display text-3xl font-bold text-ah-primary">Rs {item.priceInr}</span>
                  {item.quantityAvailable <= 0 ? (
                    <span className="rounded-xl bg-stone-300 px-5 py-2.5 text-sm font-bold text-white">Sold out</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => dec(item)} className="h-9 w-9 rounded-full border border-ah-outline-variant text-lg">
                        -
                      </button>
                      <span className="min-w-7 text-center font-semibold">{qty}</span>
                      <button type="button" onClick={() => add(item)} className="h-9 w-9 rounded-full border border-ah-primary text-lg text-ah-primary">
                        +
                      </button>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="sticky bottom-4 mt-10 rounded-2xl border border-ah-outline-variant/40 bg-white p-4 shadow-lg">
        <div className="flex items-center justify-between text-sm text-ah-on-surface-variant">
          <span>{totalItems} item(s) in cart</span>
          <span>Subtotal: Rs {subtotal}</span>
        </div>
        <Link
          href="/checkout"
          className={`mt-3 block rounded-xl py-3 text-center font-bold text-white ${totalItems > 0 ? "bg-ah-primary" : "pointer-events-none bg-stone-300"}`}
        >
          Place order
        </Link>
      </div>
    </>
  );
}

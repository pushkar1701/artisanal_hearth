"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon } from "./Icon";

const nav = [
  { href: "/menu", label: "Daily Menu" },
  { href: "/meal-plans", label: "Meal Plans" },
  { href: "/party-orders", label: "Party Orders" },
  { href: "/cooks", label: "Our chef" },
];

function linkClass(active: boolean) {
  return active
    ? "border-b-2 border-ah-primary pb-1 text-ah-primary"
    : "text-stone-600 transition-colors hover:text-ah-primary";
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200/80 bg-stone-50/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-4 px-4 py-4 md:px-8">
        <Link
          href="/"
          className="font-serif-display text-xl font-bold italic tracking-tight text-emerald-950 md:text-2xl"
        >
          Artisanal Hearth
        </Link>
        <nav className="hidden items-center gap-6 font-serif-display text-sm font-medium tracking-tight md:flex md:gap-8 md:text-base">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass(isActive(item.href))}>
              {item.label}
            </Link>
          ))}
          <Link href="/admin" className={linkClass(isActive("/admin"))}>
            Admin
          </Link>
        </nav>
        <div className="flex items-center gap-2 md:gap-5">
          <Link href="/checkout" aria-label="Basket" className="text-emerald-900 md:hidden">
            <Icon name="shopping_basket" className="text-2xl" />
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 text-emerald-900 md:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <Icon name={open ? "close" : "menu"} className="text-2xl" />
          </button>
          <Link href="/checkout" aria-label="Basket" className="hidden text-emerald-900 md:inline-flex">
            <Icon name="shopping_basket" className="text-2xl" />
          </Link>
          <button type="button" aria-label="Account" className="hidden text-emerald-900 md:inline-flex">
            <Icon name="account_circle" className="text-2xl" />
          </button>
          <Link
            href="/checkout"
            className="hidden rounded-xl bg-gradient-to-r from-ah-primary to-ah-primary-container px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 active:scale-[0.98] md:inline-flex md:px-6 md:py-2.5"
          >
            Order Now
          </Link>
        </div>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-t border-stone-200 bg-stone-50 px-4 py-3 font-serif-display text-base font-medium md:hidden">
          {[...nav, { href: "/admin", label: "Admin" }].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 ${isActive(item.href) ? "bg-ah-surface-low text-ah-primary" : "text-stone-700"}`}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/checkout"
            className="mt-2 rounded-xl bg-gradient-to-r from-ah-primary to-ah-primary-container py-3 text-center font-bold text-white"
            onClick={() => setOpen(false)}
          >
            Order now
          </Link>
        </nav>
      )}
    </header>
  );
}

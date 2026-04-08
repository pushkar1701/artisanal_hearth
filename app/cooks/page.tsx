import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CHEF } from "@/lib/chef";

export const metadata: Metadata = {
  title: "Chef",
};

const IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBf8ZmblvUrpJfpldisAcXNLhxSno0muOFeoGgaUHq-hFiNKswq0xRJYXksGEncAKuHtwLyejbLs24mVQPRnOrCu4E4LiW21xaR41xJXtKfHv-Z2wmgD3AIkFR5quHDUb3J7Rv1z4eql-W-ZcU4v1jJvkc0lgLj273eyyQqTb9jdNZVFg4z3gDhJrthd84DaqNTdHP-BKfUeiHJanzWgldPRfoCR3cGtqXLn-VqJpjAXz-F57sjtmcXKC_RwAuOAh12RCAPP1g-M82Y";

export default function CooksPage() {
  return (
    <main className="mx-auto max-w-screen-xl px-6 py-14 md:px-8">
      <header className="mb-12 max-w-2xl">
        <h1 className="font-serif-display text-4xl text-ah-primary md:text-5xl">Our chef</h1>
        <p className="mt-4 text-lg text-ah-on-surface-variant">
          One home kitchen—no commissary line. We list a service area instead of a street address for privacy.
        </p>
      </header>
      <div className="grid gap-12 md:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-xl">
          <Image
            src={IMG}
            alt="Mamta Kalra in her home kitchen"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
        <div className="space-y-6">
          <div>
            <h2 className="font-serif-display text-3xl text-emerald-950">{CHEF.name}</h2>
            <p className="mt-2 text-sm font-semibold text-ah-secondary">{CHEF.serviceArea}</p>
          </div>
          <blockquote className="rounded-2xl bg-ah-surface-low p-6 text-lg italic leading-relaxed text-ah-on-surface-variant">
            &ldquo;{CHEF.bio}&rdquo;
          </blockquote>
          <div className="rounded-2xl border border-ah-outline-variant/50 bg-white p-6 text-sm text-ah-on-surface-variant">
            <p className="font-semibold text-ah-on-bg">{CHEF.fssai}</p>
            <p className="mt-3">
              Target audience: families and offices near <strong>Ghaziabad</strong> and{" "}
              <strong>Noida Sector 62</strong>, India. We do not publish a full street address online; exact
              pickup or delivery coordination happens after you order.
            </p>
          </div>
          <Link
            href="/meal-plans"
            className="inline-block rounded-xl bg-gradient-to-r from-ah-primary to-ah-primary-container px-6 py-3 font-bold text-white"
          >
            View meal plans
          </Link>
        </div>
      </div>
    </main>
  );
}

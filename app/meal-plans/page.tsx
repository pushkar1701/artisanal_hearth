import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/artisan/Icon";
import { readMealPlans } from "@/lib/meal-plan-store";

export const metadata: Metadata = {
  title: "Meal plans",
};

export const dynamic = "force-dynamic";

export default async function MealPlansPage() {
  const { plans } = await readMealPlans();
  return (
    <main className="mx-auto max-w-screen-2xl px-6 py-14 md:px-8">
      <header className="mb-14 text-center">
        <h1 className="font-serif-display text-4xl text-ah-primary md:text-5xl">Meal subscriptions</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-ah-on-surface-variant">
          Subscriptions mirror the Stitch “subscription meal plans” flow: predictable billing, rotating menus,
          and INR pricing transparent on every tier.
        </p>
      </header>
      <div className="grid gap-8 md:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`flex flex-col rounded-2xl border p-8 ${
              p.highlighted
                ? "border-ah-primary bg-ah-surface-low shadow-lg ring-2 ring-ah-primary/20"
                : "border-ah-outline-variant/50 bg-white"
            }`}
          >
            {p.highlighted && (
              <span className="mb-4 inline-flex w-fit items-center gap-1 rounded-full bg-ah-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-ah-primary">
                <Icon name="star" className="text-sm" />
                Most popular
              </span>
            )}
            <h2 className="font-serif-display text-2xl text-emerald-950">{p.name}</h2>
            <p className="mt-3 flex items-baseline gap-1">
              <span className="font-serif-display text-4xl font-bold text-ah-primary">{p.price}</span>
              <span className="text-sm text-ah-on-surface-variant">{p.period}</span>
            </p>
            <p className="mt-4 flex-1 text-ah-on-surface-variant">{p.blurb}</p>
            <ul className="mt-6 space-y-2 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Icon name="check_circle" className="mt-0.5 text-ah-primary" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/checkout"
              className={`mt-8 block w-full rounded-xl py-3 text-center text-sm font-bold text-white ${
                p.highlighted
                  ? "bg-gradient-to-r from-ah-primary to-ah-primary-container"
                  : "bg-ah-secondary hover:opacity-95"
              }`}
            >
              Choose plan
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}

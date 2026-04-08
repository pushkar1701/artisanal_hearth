import type { Metadata } from "next";
import { Icon } from "@/components/artisan/Icon";

export const metadata: Metadata = {
  title: "Party & bulk orders",
};

export default function PartyOrdersPage() {
  return (
    <main className="mx-auto max-w-screen-xl px-6 py-14 md:px-8">
      <header className="mb-10 max-w-3xl">
        <h1 className="font-serif-display text-4xl text-ah-primary md:text-5xl">Party &amp; bulk orders</h1>
        <p className="mt-4 text-lg text-ah-on-surface-variant">
          Office lunches, family gatherings, and festival spreads—scaled from the same home-style kitchen. Tell
          us headcount, date, and dietary notes; we&apos;ll confirm on WhatsApp.
        </p>
      </header>
      <div className="grid gap-10 lg:grid-cols-2">
        <section className="rounded-2xl bg-ah-surface-low p-8">
          <h2 className="font-serif-display text-2xl text-emerald-950">What we need</h2>
          <ul className="mt-6 space-y-4 text-ah-on-surface-variant">
            <li className="flex gap-3">
              <Icon name="groups" className="text-ah-primary" />
              Minimum 15 portions for bulk pricing.
            </li>
            <li className="flex gap-3">
              <Icon name="schedule" className="text-ah-primary" />
              Book at least 48 hours ahead for large trays.
            </li>
            <li className="flex gap-3">
              <Icon name="restaurant" className="text-ah-primary" />
              Jain / no-onion-garlic / vegan routes available.
            </li>
          </ul>
        </section>
        <form className="space-y-5 rounded-2xl border border-ah-outline-variant/40 bg-white p-8 shadow-sm">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-ah-on-surface-variant">
              Event name
            </label>
            <input
              className="mt-2 w-full rounded-t-lg border-none bg-ah-surface-high px-4 py-3 text-ah-on-bg placeholder:text-ah-on-surface-variant/50 focus:ring-2 focus:ring-ah-primary/25"
              placeholder="e.g. Team lunch — Acme Labs"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-ah-on-surface-variant">
                Date
              </label>
              <input type="date" className="mt-2 w-full rounded-t-lg border-none bg-ah-surface-high px-4 py-3" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-ah-on-surface-variant">
                Portions
              </label>
              <input
                type="number"
                min={15}
                className="mt-2 w-full rounded-t-lg border-none bg-ah-surface-high px-4 py-3"
                placeholder="25"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-ah-on-surface-variant">
              Notes
            </label>
            <textarea
              rows={4}
              className="mt-2 w-full rounded-t-lg border-none bg-ah-surface-high px-4 py-3 focus:ring-2 focus:ring-ah-primary/25"
              placeholder="Allergies, spice level, delivery window…"
            />
          </div>
          <button
            type="button"
            className="w-full rounded-xl bg-gradient-to-r from-ah-primary to-ah-primary-container py-3.5 font-bold text-white"
          >
            Request quote
          </button>
        </form>
      </div>
    </main>
  );
}

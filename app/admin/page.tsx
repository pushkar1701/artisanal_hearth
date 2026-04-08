import type { Metadata } from "next";
import { Icon } from "@/components/artisan/Icon";
import { AdminMenu } from "@/components/admin/AdminMenu";

export const metadata: Metadata = {
  title: "Admin",
};

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-screen-2xl px-6 py-12 md:px-8">
      <header className="mb-10">
        <h1 className="font-serif-display text-4xl text-ah-on-bg md:text-5xl">Menu admin</h1>
        <p className="mt-2 max-w-2xl text-ah-on-surface-variant">
          Up to 5 dishes on the daily menu. Changes save to <code className="text-sm">data/menu.json</code> when you
          enter the admin password and click save. Set <code className="text-sm">ADMIN_SECRET</code> in{" "}
          <code className="text-sm">.env.local</code> for saves to succeed locally.
        </p>
      </header>
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Orders today", value: "—", icon: "receipt_long" as const },
          { label: "Tiffins out", value: "—", icon: "delivery_dining" as const },
          { label: "Menu items", value: "Live", icon: "restaurant_menu" as const },
        ].map((c) => (
          <div key={c.label} className="rounded-xl bg-ah-surface-low p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-ah-on-surface-variant">{c.label}</span>
              <Icon name={c.icon} className="text-ah-primary" />
            </div>
            <p className="mt-3 font-serif-display text-3xl font-bold text-emerald-950">{c.value}</p>
          </div>
        ))}
      </div>
      <AdminMenu />
    </main>
  );
}

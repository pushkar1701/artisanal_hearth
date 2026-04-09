import type { Metadata } from "next";
import { DAILY_MENU_MAX_DISHES } from "@/lib/menu-constants";
import { readMenu } from "@/lib/menu-store";
import { MenuClient } from "@/components/menu/MenuClient";

export const metadata: Metadata = {
  title: "Daily menu",
};

/** Always read fresh menu from storage (KV or local fallback). */
export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const { dishes: all } = await readMenu();
  const dishes = all.slice(0, DAILY_MENU_MAX_DISHES);

  return (
    <main className="mx-auto max-w-screen-xl px-6 py-14 md:px-8">
      <header className="mb-12 max-w-2xl">
        <h1 className="font-serif-display text-4xl text-ah-primary md:text-5xl">Daily menu</h1>
        <p className="mt-4 text-lg text-ah-on-surface-variant">
          Prepared by Mamta Kalra · Ghaziabad &amp; Noida Sector 62 area · Prices in ₹ · Order opens one day in
          advance at checkout.
        </p>
      </header>
      <MenuClient dishes={dishes} />
    </main>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/artisan/Icon";
import { DAILY_MENU_MAX_DISHES } from "@/lib/menu-constants";
import { readMenu } from "@/lib/menu-store";

export const metadata: Metadata = {
  title: "Daily menu",
};

/** Always read fresh menu from disk (not a stale build snapshot). */
export const dynamic = "force-dynamic";

const PLACEHOLDER =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAbT_5nN-bECVeNC8xlR9OUC7eQad4M5bYzqPGaN1Z9L2f6ZR0KjEeVN8C8EB2PqNexBTFSM-KY43KoKZRn5WdcSW4Z_CK3FBspGraUJ4cSZmMQCt4ux_9QCMC2TCjUxs0Zm5fq0aGEcXjMp-jijD9_EBvM8jbgaFK7IOPb8RAM0tykia-vrA_ZUeWetKraTDbAiF5GKV1U5GMteo0DFXspbIldqE9NHyMQB88wQb5w1KfFhP-c5OuHuxHf8QQjsIzsb04qwkSVoOWr";

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
      {dishes.length === 0 ? (
        <p className="text-ah-on-surface-variant">
          No dishes yet. Use the <Link href="/admin" className="font-semibold text-ah-primary underline">admin</Link>{" "}
          panel to add items.
        </p>
      ) : (
        <ul className="space-y-8">
          {dishes.map((item, i) => (
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
                    <span
                      key={t}
                      className="rounded-full bg-ah-surface-highest px-3 py-1 text-xs font-semibold text-ah-on-surface-variant"
                    >
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
                <span className="font-serif-display text-3xl font-bold text-ah-primary">₹{item.priceInr}</span>
                <Link
                  href="/checkout"
                  className={`rounded-xl px-5 py-2.5 text-center text-sm font-bold text-white ${
                    item.quantityAvailable > 0
                      ? "bg-gradient-to-r from-ah-primary to-ah-primary-container hover:opacity-95"
                      : "cursor-not-allowed bg-stone-300"
                  }`}
                  aria-disabled={item.quantityAvailable <= 0}
                >
                  {item.quantityAvailable > 0 ? "Add" : "Sold out"}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

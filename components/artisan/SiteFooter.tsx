import Link from "next/link";
import { Icon } from "./Icon";
import { PHONE_DISPLAY, TEL_HREF, WHATSAPP_URL } from "@/lib/contact";

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-200 bg-stone-100 pt-14 pb-8">
      <div className="mx-auto grid max-w-screen-xl grid-cols-1 gap-10 px-6 text-sm sm:grid-cols-2 lg:grid-cols-4 md:px-12">
        <div className="space-y-4">
          <div className="font-serif-display text-2xl font-bold text-emerald-950">Artisanal Hearth</div>
          <p className="max-w-xs leading-relaxed text-stone-600">
            Bringing back the joy of home-cooked meals—fresh ingredients, traditional care, and neighborhood
            cooks.
          </p>
          <div className="flex gap-3 text-emerald-900">
            <Icon name="public" />
            <Icon name="local_florist" />
            <Icon name="eco" />
          </div>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-900">Explore</h4>
          <ul className="mt-4 space-y-2 font-medium">
            <li>
              <Link href="/menu" className="text-stone-600 hover:text-emerald-900">
                Daily menu
              </Link>
            </li>
            <li>
              <Link href="/meal-plans" className="text-stone-600 hover:text-emerald-900">
                Meal subscriptions
              </Link>
            </li>
            <li>
              <Link href="/party-orders" className="text-stone-600 hover:text-emerald-900">
                Party &amp; bulk orders
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-900">Contact</h4>
          <ul className="mt-4 space-y-2 font-medium">
            <li>
              <a href={TEL_HREF} className="text-stone-600 hover:text-emerald-900">
                {PHONE_DISPLAY}
              </a>
            </li>
            <li>
              <a href={WHATSAPP_URL} className="text-stone-600 hover:text-emerald-900" target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-900">Legal</h4>
          <ul className="mt-4 space-y-2 font-medium text-stone-600">
            <li>
              <span className="cursor-not-allowed">Privacy Policy</span>
            </li>
            <li>
              <span className="cursor-not-allowed">Terms of Use</span>
            </li>
            <li>
              <span className="cursor-not-allowed">Refund Policy</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-screen-xl flex-col items-center justify-between gap-4 border-t border-stone-200 px-6 pt-8 text-xs font-semibold text-stone-500 md:flex-row md:px-12">
        <p>© {new Date().getFullYear()} Artisanal Hearth. Fresh food, every day.</p>
        <div className="flex flex-wrap justify-center gap-4 text-stone-600 md:gap-6">
          <span className="inline-flex items-center gap-1">
            <Icon name="check_circle" className="text-base" />
            Fresh ingredients
          </span>
          <span className="inline-flex items-center gap-1">
            <Icon name="recycling" className="text-base" />
            Eco-friendly packaging
          </span>
        </div>
      </div>
    </footer>
  );
}

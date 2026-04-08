import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/artisan/Icon";
import { PHONE_DISPLAY, TEL_HREF, WHATSAPP_URL } from "@/lib/contact";
import { CHEF } from "@/lib/chef";

const IMG_HERO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA73LbGogSD9NeLXQYGVki0l4ptbWeDiNxrAiGBTeo8n6_iAm9YnOGkHPSHuVeL5T8rdX0T90NNHzqtagcI5JD7j6Dg5BhjQfd3HaydF5nLkS9j_vwnAkjSCmDrlYJPpUOGpBO4Oho8osQfIdaHk5MaboHK5XjmRN55IyGs3LKobscUKYVTm--ybx4A7xi6GxHKruRHT9GtelJXS0wb6h30wpiWLrso9q37enSs0s5_B3vKpvGHHaD31vF0vaAYxvLwSDlf3B9oI4kY";

const IMG_SPECIAL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAbT_5nN-bECVeNC8xlR9OUC7eQad4M5bYzqPGaN1Z9L2f6ZR0KjEeVN8C8EB2PqNexBTFSM-KY43KoKZRn5WdcSW4Z_CK3FBspGraUJ4cSZmMQCt4ux_9QCMC2TCjUxs0Zm5fq0aGEcXjMp-jijD9_EBvM8jbgaFK7IOPb8RAM0tykia-vrA_ZUeWetKraTDbAiF5GKV1U5GMteo0DFXspbIldqE9NHyMQB88wQb5w1KfFhP-c5OuHuxHf8QQjsIzsb04qwkSVoOWr";

const IMG_COOK =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBf8ZmblvUrpJfpldisAcXNLhxSno0muOFeoGgaUHq-hFiNKswq0xRJYXksGEncAKuHtwLyejbLs24mVQPRnOrCu4E4LiW21xaR41xJXtKfHv-Z2wmgD3AIkFR5quHDUb3J7Rv1z4eql-W-ZcU4v1jJvkc0lgLj273eyyQqTb9jdNZVFg4z3gDhJrthd84DaqNTdHP-BKfUeiHJanzWgldPRfoCR3cGtqXLn-VqJpjAXz-F57sjtmcXKC_RwAuOAh12RCAPP1g-M82Y";

export default function HomePage() {
  return (
    <>
      <section className="relative flex min-h-[560px] items-center overflow-hidden md:min-h-[720px]">
        <div className="absolute inset-0 z-0">
          <Image
            src={IMG_HERO}
            alt="Traditional Indian thali with dal, vegetables, rice, and roti"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="hero-gradient absolute inset-0" />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-screen-2xl px-6 md:px-8">
          <div className="max-w-2xl">
            <p className="mb-6 inline-block rounded-full bg-ah-secondary-fixed px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-ah-on-secondary-fixed-variant">
              Honest · Handmade · Daily
            </p>
            <h1 className="font-serif-display text-5xl leading-[1.1] text-ah-primary md:text-7xl md:leading-[1.1]">
              Nourishment, <br />
              <span className="italic text-ah-secondary">slowly crafted.</span>
            </h1>
            <p className="mt-8 max-w-lg text-lg leading-relaxed text-stone-800 md:text-xl">
              Rediscover home-cooked Indian meals—seasonal ingredients, family recipes, and tiffins delivered
              fresh. Prices in ₹; we focus on Ghaziabad &amp; Noida Sector 62.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/menu"
                className="rounded-xl bg-gradient-to-r from-ah-primary to-ah-primary-container px-8 py-4 text-lg font-bold text-white shadow-lg shadow-ah-primary/20 transition hover:-translate-y-0.5"
              >
                View today&apos;s menu
              </Link>
              <Link
                href="/cooks"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-ah-secondary/20 px-8 py-4 font-bold text-ah-secondary transition hover:bg-ah-secondary-fixed/40"
              >
                <Icon name="play_circle" />
                Our story
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-20 -mt-12 px-6 md:-mt-16">
        <div className="mx-auto flex max-w-screen-xl flex-col items-center justify-between gap-6 rounded-3xl border border-ah-outline-variant/30 bg-white p-6 shadow-xl md:flex-row md:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ah-primary/10 text-ah-primary">
              <Icon name="calculate" className="text-3xl" />
            </div>
            <div>
              <h2 className="font-serif-display text-xl text-ah-primary md:text-2xl">Track your wellness</h2>
              <p className="text-sm text-ah-on-surface-variant">Estimate calories for today&apos;s tiffin.</p>
            </div>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-ah-secondary px-6 py-3 font-bold text-white transition hover:opacity-95"
          >
            Open calorie guide
            <Icon name="arrow_forward" />
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-screen-2xl px-6 py-20 md:px-8">
        <div className="mb-12 flex flex-col items-end justify-between gap-6 md:flex-row">
          <div className="max-w-xl">
            <h2 className="font-serif-display text-3xl italic text-ah-primary md:text-4xl">
              आज का खास खाना <span className="block text-2xl not-italic">(Today&apos;s special)</span>
            </h2>
            <p className="mt-3 text-lg text-stone-700">
              Prepared this morning by our home cooks. Order by 1:00 PM for lunch delivery.
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-wider text-stone-600">Available today</p>
            <p className="font-serif-display text-2xl font-bold text-ah-secondary">Wednesday service</p>
          </div>
        </div>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="overflow-hidden rounded-[2rem] bg-ah-surface-high shadow-sm lg:col-span-7">
            <div className="relative aspect-[4/3]">
              <Image
                src={IMG_SPECIAL}
                alt="Steel tiffin with dal, sabzi, and rice"
                fill
                className="object-cover transition duration-700 hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </div>
          </div>
          <div className="space-y-6 lg:col-span-5">
            <div>
              <h3 className="font-serif-display text-3xl text-emerald-950 md:text-4xl">
                Homestyle dal &amp; seasonal sabzi
              </h3>
              <p className="mt-3 text-lg leading-relaxed text-stone-700">
                Slow-cooked yellow lentils with cumin tadka, seasonal vegetables, and two soft rotis—just like
                home.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100 px-3 py-2 text-sm font-bold text-emerald-900">
                <Icon name="energy_savings_leaf" className="text-lg" />
                High protein
              </span>
              <span className="rounded-lg bg-stone-200 px-3 py-2 text-sm font-bold text-stone-800">
                Serves 1
              </span>
              <span className="rounded-lg bg-orange-100 px-3 py-2 text-sm font-bold text-orange-900">
                Less oil
              </span>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-ah-surface-low p-6">
              <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-emerald-900">
                What&apos;s inside
              </h4>
              <ul className="grid grid-cols-2 gap-2 text-sm font-medium text-stone-800">
                {["Yellow moong dal", "Fresh bhindi fry", "2 whole wheat rotis", "Steamed rice"].map((x) => (
                  <li key={x} className="flex items-center gap-2">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-ah-secondary" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="font-serif-display text-4xl font-bold text-ah-primary">₹180</span>
              <Link
                href="/checkout"
                className="inline-flex items-center gap-2 rounded-xl bg-ah-primary px-6 py-3 font-bold text-white shadow-md transition hover:bg-emerald-900 active:scale-[0.98]"
              >
                Add to tiffin
                <Icon name="add_shopping_cart" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-stone-100 py-20">
        <div className="mx-auto max-w-screen-2xl px-6 md:px-8">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <h2 className="font-serif-display text-3xl italic text-emerald-950 md:text-5xl">
              यह कैसे काम करता है <span className="mt-2 block text-2xl not-italic">(How it works)</span>
            </h2>
            <p className="mt-4 text-lg text-stone-700">
              Choose a plan, we cook fresh in the morning, and your tiffin arrives warm.
            </p>
          </div>
          <div className="grid gap-10 md:grid-cols-3 md:gap-12">
            {[
              { icon: "calendar_month" as const, title: "1. Pick a plan", body: "Single meal or weekly subscription—whatever fits your week." },
              { icon: "outdoor_grill" as const, title: "2. Freshly cooked", body: "Our cooks shop and cook the same morning with care." },
              { icon: "delivery_dining" as const, title: "3. Hot delivery", body: "Your meal reaches home or office, ready to eat." },
            ].map((s) => (
              <div key={s.title} className="space-y-4 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-stone-200 bg-white shadow-sm">
                  <Icon name={s.icon} className="text-4xl text-ah-secondary" />
                </div>
                <h3 className="font-serif-display text-xl font-bold text-ah-primary">{s.title}</h3>
                <p className="leading-relaxed text-stone-700">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-screen-xl px-6 py-20 md:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="order-2 space-y-8 lg:order-1">
            <div>
              <h2 className="font-serif-display text-3xl text-emerald-950 md:text-4xl">Meet {CHEF.name}</h2>
              <p className="mt-2 text-sm font-semibold text-ah-secondary">{CHEF.serviceArea}</p>
              <p className="mt-4 text-xl font-medium leading-relaxed text-stone-800">
                &ldquo;{CHEF.bio}&rdquo;
              </p>
              <p className="mt-4 text-sm text-ah-on-surface-variant">{CHEF.fssai}</p>
            </div>
            <div className="flex flex-col gap-6 rounded-3xl border border-emerald-100 bg-emerald-50/80 p-6 sm:flex-row sm:items-center">
              <div className="rounded-xl bg-white p-4 shadow-md">
                <div className="flex h-24 w-24 flex-col items-center justify-center rounded-lg border-2 border-dashed border-stone-300 bg-stone-100 text-stone-400">
                  <Icon name="qr_code_2" className="text-3xl" />
                  <span className="mt-1 text-[8px] font-bold uppercase tracking-widest">WhatsApp</span>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-emerald-950">Customize your meal?</h4>
                <p className="mt-1 text-sm text-stone-700">
                  Message us for spice levels, allergies, or ingredient swaps.
                </p>
                <a
                  href={WHATSAPP_URL}
                  className="mt-3 inline-flex items-center gap-1 font-bold text-emerald-800 hover:underline"
                >
                  Chat on WhatsApp
                  <Icon name="arrow_outward" className="text-sm" />
                </a>
                <p className="mt-2 text-sm text-stone-600">
                  Or call{" "}
                  <a href={TEL_HREF} className="font-semibold text-emerald-900 hover:underline">
                    {PHONE_DISPLAY}
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className="relative order-1 lg:order-2">
            <div className="relative aspect-square overflow-hidden rounded-[2rem] shadow-2xl">
              <Image
                src={IMG_COOK}
                alt="Home cook in a bright kitchen with spices"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 -z-10 h-24 w-24 rounded-full bg-ah-secondary-fixed opacity-40" />
            <div className="absolute -right-4 -top-4 -z-10 h-32 w-32 rounded-full bg-emerald-200/80" />
          </div>
        </div>
      </section>

      <section className="mx-auto mb-20 max-w-screen-xl px-6 md:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-emerald-950 px-8 py-14 text-center md:px-16 md:py-16">
          <div className="relative z-10 mx-auto max-w-2xl">
            <h2 className="font-serif-display text-3xl text-white md:text-5xl">Ready for a better lunch?</h2>
            <p className="mt-4 text-lg text-emerald-100/90">
              Join neighbors who eat fresh every day—skip oily restaurant grease.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/meal-plans"
                className="rounded-xl bg-ah-secondary-container px-8 py-4 text-lg font-bold text-ah-on-secondary-container transition hover:scale-[1.02]"
              >
                Start your plan
              </Link>
              <button
                type="button"
                className="rounded-xl border-2 border-emerald-700 px-8 py-4 text-lg font-bold text-white transition hover:bg-emerald-900"
              >
                Gift a meal
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

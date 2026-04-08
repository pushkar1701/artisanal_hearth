import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Service area",
  robots: { index: false, follow: false },
};

export default function ServiceAreaPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col justify-center px-6 py-16 text-center">
      <h1 className="font-serif-display text-3xl text-ah-primary">We serve India (NCR) only</h1>
      <p className="mt-4 text-ah-on-surface-variant">
        Artisanal Hearth currently accepts orders from customers in India, with delivery focused around
        Ghaziabad and Noida Sector 62. Your connection appeared to originate outside India, so the storefront
        is unavailable.
      </p>
      <p className="mt-4 text-sm text-stone-500">
        IP-based checks are approximate (VPNs and travel SIMs can misread). If you are in India and see this by
        mistake, try another network or contact us on WhatsApp.
      </p>
      <Link href="/" className="mt-8 text-ah-primary underline">
        Back to home
      </Link>
    </main>
  );
}
